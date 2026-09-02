// Thin API client for the Django/DRF backend with JWT handling.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api'

const TOKEN_KEY = 'ag_access'
const REFRESH_KEY = 'ag_refresh'

export const tokenStore = {
  get access() {
    return localStorage.getItem(TOKEN_KEY)
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY)
  },
  set({ access, refresh }) {
    if (access) localStorage.setItem(TOKEN_KEY, access)
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

async function refreshAccess() {
  const refresh = tokenStore.refresh
  if (!refresh) return null
  const res = await fetch(`${API_URL}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })
  if (!res.ok) {
    tokenStore.clear()
    return null
  }
  const data = await res.json()
  tokenStore.set({ access: data.access })
  return data.access
}

async function request(path, { method = 'GET', body, auth = false, retry = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const access = tokenStore.access
  if (auth && access) headers.Authorization = `Bearer ${access}`

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401 && auth && retry) {
    const newAccess = await refreshAccess()
    if (newAccess) return request(path, { method, body, auth, retry: false })
  }

  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    const err = new Error(data?.detail || 'خطا در ارتباط با سرور')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

/** Unwrap DRF pagination ({count, results}) to a plain array. */
export function asList(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.results)) return data.results
  return []
}

export const api = {
  get: (p, opts) => request(p, { ...opts }),
  post: (p, body, opts) => request(p, { method: 'POST', body, ...opts }),
  patch: (p, body, opts) => request(p, { method: 'PATCH', body, ...opts }),
  put: (p, body, opts) => request(p, { method: 'PUT', body, ...opts }),
  del: (p, opts) => request(p, { method: 'DELETE', ...opts }),
}

export { API_URL }

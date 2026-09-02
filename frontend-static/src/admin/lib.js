// Authenticated admin API helpers.
import { api, API_URL, tokenStore } from '../lib/api'

export const aget = (p) => api.get(p, { auth: true })
export const apost = (p, b) => api.post(p, b, { auth: true })
export const apatch = (p, b) => api.patch(p, b, { auth: true })
export const aput = (p, b) => api.put(p, b, { auth: true })
export const adel = (p) => api.del(p, { auth: true })

/** Upload an image file → returns the absolute URL string. */
export async function aupload(file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(`${API_URL}/uploads/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenStore.access}` },
    body: fd,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.detail || 'خطا در آپلود تصویر')
  return data.url
}

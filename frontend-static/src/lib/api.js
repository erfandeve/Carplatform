// ---------------------------------------------------------------------------
// STATIC / OFFLINE API CLIENT  —  نسخه‌ی مخصوص دیپلوی روی Vercel (بدون بک‌اند)
// ---------------------------------------------------------------------------
// این فایل جایگزین کلاینت اصلی (که به Django وصل می‌شد) شده است. تمام دیتای
// عمومی سایت از فایل `src/data/db.json` خوانده می‌شود (محصولات، مقالات، قوانین،
// دسته‌بندی‌ها، نظرات). ورود کاربر، سفارش‌ها و تیکت‌ها هم روی localStorage مرورگر
// شبیه‌سازی می‌شوند تا کل تجربه‌ی سایت بدون هیچ سروری کامل کار کند.
//
// ⚠️ نرخ تبدیل درهم→تومان: مقدار `db.rate` پایین را می‌توانی هر زمان عوض کنی
//    (یا از پنل — تغییرش فقط در همین مرورگر ذخیره می‌شود چون سروری وجود ندارد).
// ---------------------------------------------------------------------------

import db from '../data/db.json'

// Same interface the app already imports, kept for drop-in compatibility.
export const API_URL = 'static://local'

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

/** Unwrap DRF-style pagination ({count, results}) to a plain array. */
export function asList(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.results)) return data.results
  return []
}

// --------------------------- local persistence -----------------------------

const LS = {
  read(key, fallback) {
    try {
      const v = localStorage.getItem(key)
      return v ? JSON.parse(v) : fallback
    } catch {
      return fallback
    }
  },
  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* quota / private mode — ignore */
    }
  },
}

const RATE_KEY = 'ag_rate'
const DEPOSIT_KEY = 'ag_deposit'
const USER_KEY = 'ag_user'
const USERS_KEY = 'ag_users'
const ORDERS_KEY = 'ag_orders'
const TICKETS_KEY = 'ag_tickets'

const getRate = () => LS.read(RATE_KEY, db.rate)
const getDeposit = () => LS.read(DEPOSIT_KEY, db.deposit)

// --------------------------- helpers ---------------------------------------

const clone = (v) => JSON.parse(JSON.stringify(v))
const uid = () => Math.random().toString(36).slice(2, 10)
const nowFa = () =>
  new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(new Date())

/** Split "path?query" into [pathname, URLSearchParams]. */
function parsePath(path) {
  const [p, qs = ''] = path.split('?')
  return [p.replace(/\/+$/, '/'), new URLSearchParams(qs)]
}

/** All descendant category slugs of `slug` (inclusive), from the nested tree. */
function descendantSlugs(slug) {
  const acc = [slug]
  const walk = (nodes) => {
    for (const n of nodes) {
      if (n.slug === slug) collect(n)
      else if (n.children?.length) walk(n.children)
    }
  }
  const collect = (n) => {
    for (const c of n.children || []) {
      acc.push(c.slug)
      collect(c)
    }
  }
  walk(db.categoriesNested)
  return acc
}

function currentUser() {
  return LS.read(USER_KEY, null)
}

// --------------------------- products --------------------------------------

function filterSortProducts(qp) {
  let items = clone(db.productsList)

  const kind = qp.get('kind')
  if (kind) items = items.filter((p) => p.kind === kind)
  if (qp.get('type') === 'used') items = items.filter((p) => p.kind === 'used')

  const cat = qp.get('cat')
  if (cat) {
    const slugs = new Set(descendantSlugs(cat))
    items = items.filter((p) => p.category && slugs.has(p.category))
  }

  const statuses = qp.get('status')
  if (statuses) {
    const wanted = new Set(statuses.split(',').filter(Boolean))
    items = items.filter((p) => (p.statuses || []).some((s) => wanted.has(s)))
  }

  if (qp.get('featured') === '1' || qp.get('featured') === 'true') {
    items = items.filter((p) => p.featured)
  }

  const q = qp.get('q')
  if (q) {
    const ql = q.trim().toLowerCase()
    items = items.filter((p) => (p.name || '').toLowerCase().includes(ql))
  }

  const rate = getRate()
  // Toman price used for sort/min/max — recomputed from the live rate for cars.
  const price = (p) =>
    p.kind === 'car'
      ? p.priceAed * rate * (1 - (p.discountPercent || 0) / 100)
      : (p.priceToman || 0) * (1 - (p.discountPercent || 0) / 100)

  const min = parseInt(qp.get('min') || '', 10)
  const max = parseInt(qp.get('max') || '', 10)
  if (!Number.isNaN(min)) items = items.filter((p) => price(p) >= min)
  if (!Number.isNaN(max)) items = items.filter((p) => price(p) <= max)

  const sort = qp.get('sort') || 'new'
  if (sort === 'price_asc') items.sort((a, b) => price(a) - price(b))
  else if (sort === 'price_desc') items.sort((a, b) => price(b) - price(a))
  else if (sort === 'popular')
    items.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
  // 'new' keeps the baked order (backend already sorted newest-first).

  return items
}

function paginate(items, qp, defaultSize = 12) {
  const size = parseInt(qp.get('page_size') || '', 10) || defaultSize
  const page = parseInt(qp.get('page') || '1', 10) || 1
  const start = (page - 1) * size
  const slice = items.slice(start, start + size)
  const hasNext = start + size < items.length
  const hasPrev = page > 1
  return {
    count: items.length,
    next: hasNext ? `?page=${page + 1}&page_size=${size}` : null,
    previous: hasPrev ? `?page=${page - 1}&page_size=${size}` : null,
    results: slice,
  }
}

function productDetail(slug) {
  const detail = db.productsDetail[slug]
  if (!detail) return null
  const d = clone(detail)
  // Compute related client-side: same category first, then fill with others.
  const pool = db.productsList.filter((p) => p.slug !== slug)
  const same = pool.filter((p) => p.category && p.category === d.category)
  const related = [...same, ...pool.filter((p) => !same.includes(p))].slice(0, 4)
  d.related = clone(related)
  return d
}

// --------------------------- orders (local) --------------------------------

const STAGES = {
  normal: ['ثبت سفارش', 'پرداخت بیعانه', 'تأمین خودرو', 'ترخیص و مدارک', 'تحویل'],
  used: ['ثبت سفارش', 'کارشناسی خودرو', 'پرداخت بیعانه', 'انتقال سند', 'تحویل'],
  custom: ['ثبت درخواست', 'بررسی کارشناس', 'اعلام قیمت', 'تأیید و بیعانه', 'تحویل'],
}

function buildSteps(orderType) {
  const titles = STAGES[orderType] || STAGES.normal
  return titles.map((title, i) => ({
    id: i + 1,
    title,
    state: i === 0 ? 'current' : 'pending',
  }))
}

function getOrders() {
  return LS.read(ORDERS_KEY, [])
}

function createOrder(body) {
  const orders = getOrders()
  const type = body.order_type || 'normal'
  let product = null
  if (body.product) {
    const p = db.productsList.find((x) => x.slug === body.product)
    if (p) product = { name: p.name, image: p.image, slug: p.slug }
  }
  const steps = buildSteps(type)
  const order = {
    id: uid(),
    orderType: type,
    product,
    selectedColor: body.selected_color || '',
    custom:
      type === 'custom'
        ? {
            carType: body.custom_car_type,
            specs: body.custom_specs,
            color: body.custom_color,
            budget: body.custom_budget_toman,
          }
        : null,
    statusTitle: steps[0].title,
    steps,
    deposit: { accepted: false, paid: false },
    createdAt: nowFa(),
  }
  orders.unshift(order)
  LS.write(ORDERS_KEY, orders)
  return order
}

function acceptTerms(id) {
  const orders = getOrders()
  const o = orders.find((x) => x.id === id)
  if (o) {
    o.deposit = { ...o.deposit, accepted: true }
    // advance to the next stage as a lightweight demo of progress
    const cur = o.steps.findIndex((s) => s.state === 'current')
    if (cur > -1 && cur < o.steps.length - 1) {
      o.steps[cur].state = 'done'
      o.steps[cur + 1].state = 'current'
      o.statusTitle = o.steps[cur + 1].title
    }
    LS.write(ORDERS_KEY, orders)
  }
  return o || {}
}

// --------------------------- tickets (local) -------------------------------

function getTickets() {
  return LS.read(TICKETS_KEY, [])
}

function createTicket(body) {
  const tickets = getTickets()
  const t = {
    id: uid(),
    subject: body.subject,
    status: 'open',
    messages: [{ id: uid(), sender: 'user', body: body.body }],
    createdAt: nowFa(),
  }
  tickets.unshift(t)
  LS.write(TICKETS_KEY, tickets)
  return t
}

function replyTicket(id, body) {
  const tickets = getTickets()
  const t = tickets.find((x) => x.id === id)
  if (t) {
    t.messages.push({ id: uid(), sender: 'user', body: body.body })
    // canned support auto-reply so the thread feels alive in the demo
    t.messages.push({
      id: uid(),
      sender: 'admin',
      body: 'پیام شما دریافت شد. کارشناسان شعبانی خودرو در اسرع وقت پاسخ می‌دهند.',
    })
    t.status = 'answered'
    LS.write(TICKETS_KEY, tickets)
  }
  return t || {}
}

// --------------------------- auth (local) ----------------------------------

function makeUser(payload, phone) {
  const first = payload.first_name || ''
  const last = payload.last_name || ''
  const fullName = `${first} ${last}`.trim()
  return {
    id: uid(),
    phone: phone || payload.phone || '',
    email: payload.email || '',
    first_name: first,
    last_name: last,
    fullName: fullName || undefined,
    role: 'customer',
    is_staff: false,
  }
}

function login(body) {
  // Any credentials are accepted in the offline demo. Reuse a registered
  // profile if the phone matches one, otherwise mint a lightweight user.
  const users = LS.read(USERS_KEY, [])
  const existing = users.find((u) => u.phone === body.phone)
  const user = existing || makeUser({}, body.phone)
  LS.write(USER_KEY, user)
  return { access: 'demo.' + uid(), refresh: 'demo.' + uid(), user }
}

function register(body) {
  const users = LS.read(USERS_KEY, [])
  const user = makeUser(body, body.phone)
  users.push(user)
  LS.write(USERS_KEY, users)
  LS.write(USER_KEY, user)
  return { access: 'demo.' + uid(), refresh: 'demo.' + uid(), user }
}

// --------------------------- router ----------------------------------------

function notFound(path) {
  const err = new Error('یافت نشد: ' + path)
  err.status = 404
  return err
}

function handle(method, path, body) {
  const [p, qp] = parsePath(path)
  const seg = p.split('/').filter(Boolean) // e.g. ['products','swift']

  // ---- settings ----
  if (p === '/settings/exchange-rate/') {
    if (method === 'PUT') {
      LS.write(RATE_KEY, +body.rate)
      return { rate: getRate() }
    }
    return { rate: getRate(), updated_at: new Date().toISOString() }
  }
  if (p === '/settings/deposit/') {
    if (method === 'PUT') {
      LS.write(DEPOSIT_KEY, { ...getDeposit(), ...body })
      return getDeposit()
    }
    return getDeposit()
  }

  // ---- categories ----
  if (p === '/categories/') {
    if (method === 'GET') return clone(db.categoriesNested)
    return body || {}
  }
  if (p === '/categories/flat/') return clone(db.categoriesFlat)
  if (seg[0] === 'categories' && seg.length === 2) return body || {} // write no-op

  // ---- products ----
  if (p === '/products/' && method === 'GET') {
    return paginate(filterSortProducts(qp), qp)
  }
  if (seg[0] === 'products' && seg.length === 2) {
    if (method === 'GET') {
      const d = productDetail(seg[1])
      if (!d) throw notFound(path)
      return d
    }
    return body || {} // create/update/delete no-op in offline mode
  }

  // ---- articles ----
  if (p === '/articles/' && method === 'GET') return clone(db.articlesList)
  if (seg[0] === 'articles' && seg.length === 2) {
    if (method === 'GET') {
      const d = db.articlesDetail[seg[1]]
      if (!d) throw notFound(path)
      return clone(d)
    }
    return body || {}
  }

  // ---- testimonials ----
  if (p === '/testimonials/') return clone(db.testimonials)

  // ---- regulations ----
  if (p === '/regulations/' && method === 'GET') return clone(db.regulations)
  if (seg[0] === 'regulations' && seg.length === 2) {
    if (method === 'GET') {
      const d = db.regulationsDetail[seg[1]]
      if (!d) throw notFound(path)
      return clone(d)
    }
    return body || {}
  }

  // ---- auth ----
  if (p === '/auth/login/') return login(body)
  if (p === '/auth/register/') return register(body)
  if (p === '/auth/token/refresh/') return { access: 'demo.' + uid() }
  if (p === '/auth/me/') {
    const u = currentUser()
    if (!u) throw notFound(path)
    return u
  }

  // ---- orders ----
  if (p === '/orders/') {
    if (method === 'POST') return createOrder(body)
    return getOrders()
  }
  if (seg[0] === 'orders' && seg[2] === 'accept_terms') return acceptTerms(seg[1])

  // ---- tickets ----
  if (p === '/tickets/') {
    if (method === 'POST') return createTicket(body)
    return getTickets()
  }
  if (seg[0] === 'tickets' && seg[2] === 'reply') return replyTicket(seg[1], body)

  // ---- admin (best-effort, offline) ----
  if (seg[0] === 'admin') return handleAdmin(method, seg, qp, body)

  throw notFound(path)
}

// Admin panel reads come from the same baked data; writes are no-ops offline.
function handleAdmin(method, seg, qp, body) {
  const sub = seg[1]
  if (sub === 'dashboard') {
    return {
      products: db.productsList.length,
      orders: getOrders().length,
      tickets: getTickets().length,
      users: LS.read(USERS_KEY, []).length,
      revenue: 0,
    }
  }
  if (sub === 'users') {
    if (method === 'GET') return LS.read(USERS_KEY, [])
    return body || {}
  }
  if (sub === 'orders') {
    if (seg[2] === 'deposit_acceptances') return []
    if (method === 'GET') {
      const type = qp.get('order_type')
      return getOrders().filter((o) => !type || o.orderType === type)
    }
    return body || {}
  }
  if (sub === 'stages') {
    if (method === 'GET') {
      const type = qp.get('order_type') || 'normal'
      return (STAGES[type] || STAGES.normal).map((title, i) => ({
        id: i + 1,
        title,
        position: i,
        order_type: type,
      }))
    }
    return body || {}
  }
  if (sub === 'tickets') {
    if (seg.length === 3 && method === 'GET')
      return getTickets().find((t) => t.id === seg[2]) || {}
    if (method === 'GET') return getTickets()
    return body || {}
  }
  if (sub === 'reviews') {
    if (method === 'GET') return []
    return body || {}
  }
  return body || {}
}

// Async facade so callers keep using await, exactly like the network client.
function request(path, { method = 'GET', body } = {}) {
  return new Promise((resolve, reject) => {
    // microtask delay keeps loading states from flashing synchronously
    setTimeout(() => {
      try {
        resolve(handle(method, path, body))
      } catch (e) {
        reject(e)
      }
    }, 40)
  })
}

export const api = {
  get: (p, opts) => request(p, { ...opts }),
  post: (p, body, opts) => request(p, { method: 'POST', body, ...opts }),
  patch: (p, body, opts) => request(p, { method: 'PATCH', body, ...opts }),
  put: (p, body, opts) => request(p, { method: 'PUT', body, ...opts }),
  del: (p, opts) => request(p, { method: 'DELETE', ...opts }),
}

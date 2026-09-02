// ---------------------------------------------------------------
// Mock data — stands in for the Django/DRF API until the backend
// phase. Shapes mirror the planned models so wiring is a swap later.
// ---------------------------------------------------------------

const u = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

/** Global admin setting: Toman per 1 AED. Editing this reprices all cars. */
export const EXCHANGE_RATE = 26500

// The four customs/ownership states a car can hold simultaneously.
export const STATUS = {
  freePerm: { key: 'freePerm', label: 'منطقه آزاد دائم', color: 'free-perm' },
  freeTemp: { key: 'freeTemp', label: 'منطقه آزاد موقت', color: 'free-temp' },
  gozarPerm: { key: 'gozarPerm', label: 'گذر دائم', color: 'gozar-perm' },
  gozarTemp: { key: 'gozarTemp', label: 'گذر موقت', color: 'gozar-temp' },
}

// Multi-level category tree (اصلی → زیردسته → زیرِ زیردسته)
export const CATEGORIES = [
  {
    slug: 'cars',
    title: 'خودرو',
    icon: 'car',
    children: [
      { slug: 'suv', title: 'شاسی‌بلند / SUV' },
      { slug: 'sedan', title: 'سدان' },
      { slug: 'coupe', title: 'کوپه / اسپرت' },
      { slug: 'ev', title: 'برقی' },
    ],
  },
  {
    slug: 'used-cars',
    title: 'خودروهای دسته دوم',
    icon: 'history',
    children: [
      { slug: 'used-suv', title: 'شاسی‌بلند کارکرده' },
      { slug: 'used-sedan', title: 'سدان کارکرده' },
    ],
  },
  {
    slug: 'parts',
    title: 'لوازم یدکی',
    icon: 'wrench',
    children: [
      {
        slug: 'oil',
        title: 'روغن ماشین',
        children: [
          { slug: 'oil-fuchs', title: 'روغن فوکس' },
          { slug: 'oil-motul', title: 'روغن موتول' },
        ],
      },
      { slug: 'tires', title: 'لاستیک' },
      { slug: 'brake', title: 'لنت و ترمز' },
    ],
  },
]

const car = (o) => ({ kind: 'car', currency: 'AED', rating: 4.8, ...o })

export const CARS = [
  car({
    id: 1,
    slug: 'mercedes-g63-2024',
    name: 'مرسدس‌بنز G63 AMG',
    year: 2024,
    category: 'suv',
    priceAed: 128000,
    discountPercent: 6,
    statuses: ['freePerm', 'gozarPerm'],
    featured: true,
    tag: 'ویژه',
    image: u('1520031441872-265e4ff70366'),
    gallery: [
      u('1520031441872-265e4ff70366'),
      u('1617654112368-307921291f42'),
    ],
    colors: [
      { name: 'مشکی اوبسیدین', hex: '#0b0b0d' },
      { name: 'سفید قطبی', hex: '#eef1f4' },
      { name: 'خاکستری سلنیت', hex: '#5b606a' },
    ],
    rating: 4.9,
    reviews: 42,
  }),
  car({
    id: 2,
    slug: 'porsche-911-carrera',
    name: 'پورشه ۹۱۱ کررا S',
    year: 2023,
    category: 'coupe',
    priceAed: 96000,
    discountPercent: 0,
    statuses: ['freePerm'],
    featured: true,
    tag: 'اسپرت',
    image: u('1503376780353-7e6692767b70'),
    gallery: [u('1503376780353-7e6692767b70'), u('1614162692292-7ac56d7f7f1e')],
    colors: [
      { name: 'قرمز گوارد', hex: '#c1121f' },
      { name: 'نقره‌ای GT', hex: '#c8ccd1' },
    ],
    rating: 5,
    reviews: 31,
  }),
  car({
    id: 3,
    slug: 'bmw-x7-m60i',
    name: 'بی‌ام‌و X7 M60i',
    year: 2024,
    category: 'suv',
    priceAed: 84000,
    discountPercent: 4,
    statuses: ['freeTemp', 'gozarTemp'],
    featured: true,
    tag: 'جدید',
    image: u('1555215695-3004980ad54e'),
    gallery: [u('1555215695-3004980ad54e')],
    colors: [
      { name: 'آبی تانزانیت', hex: '#1f3a5f' },
      { name: 'مشکی کربن', hex: '#111317' },
    ],
    rating: 4.7,
    reviews: 18,
  }),
  car({
    id: 4,
    slug: 'lamborghini-urus-s',
    name: 'لامبورگینی اوروس S',
    year: 2024,
    category: 'suv',
    priceAed: 165000,
    discountPercent: 0,
    statuses: ['freePerm', 'freeTemp', 'gozarPerm'],
    featured: true,
    tag: 'لوکس',
    image: u('1552519507-da3b142c6e3d'),
    gallery: [u('1552519507-da3b142c6e3d')],
    colors: [
      { name: 'زرد نئون', hex: '#f2c200' },
      { name: 'خاکستری نمه', hex: '#3f4145' },
    ],
    rating: 5,
    reviews: 27,
  }),
  car({
    id: 5,
    slug: 'tesla-model-s-plaid',
    name: 'تسلا مدل S پلید',
    year: 2023,
    category: 'ev',
    priceAed: 72000,
    discountPercent: 8,
    statuses: ['freeTemp'],
    image: u('1560958089-b8a1929cea89'),
    gallery: [u('1560958089-b8a1929cea89')],
    colors: [
      { name: 'مشکی مروارید', hex: '#0d0f12' },
      { name: 'سفید صدفی', hex: '#f4f6f8' },
    ],
    rating: 4.6,
    reviews: 12,
  }),
  car({
    id: 6,
    slug: 'range-rover-autobiography',
    name: 'رنج‌روور آتوبیوگرافی',
    year: 2024,
    category: 'suv',
    priceAed: 118000,
    discountPercent: 5,
    statuses: ['gozarPerm', 'gozarTemp'],
    image: u('1553440569-bcc63803a83d'),
    gallery: [u('1553440569-bcc63803a83d')],
    colors: [{ name: 'سبز بریتیش', hex: '#22392c' }],
    rating: 4.8,
    reviews: 20,
  }),
  car({
    id: 7,
    slug: 'audi-rs7-sportback',
    name: 'آئودی RS7 اسپرت‌بک',
    year: 2023,
    category: 'sedan',
    priceAed: 89000,
    discountPercent: 0,
    statuses: ['freePerm', 'gozarPerm'],
    image: u('1606664515524-ed2f786a0bd6'),
    gallery: [u('1606664515524-ed2f786a0bd6')],
    colors: [{ name: 'خاکستری نارود', hex: '#4b4e52' }],
    rating: 4.9,
    reviews: 15,
  }),
  car({
    id: 8,
    slug: 'bentley-continental-gt',
    name: 'بنتلی کانتیننتال GT',
    year: 2024,
    category: 'coupe',
    priceAed: 210000,
    discountPercent: 0,
    statuses: ['freePerm'],
    tag: 'لوکس',
    image: u('1621135802920-133df287f89c'),
    gallery: [u('1621135802920-133df287f89c')],
    colors: [{ name: 'آبی سکوئنشال', hex: '#20406b' }],
    rating: 5,
    reviews: 9,
  }),
]

// Non-car products priced directly in Toman.
export const PARTS = [
  {
    id: 101,
    kind: 'part',
    slug: 'fuchs-titan-5w40',
    name: 'روغن موتور فوکس تیتان ۵W-۴۰',
    category: 'oil-fuchs',
    priceToman: 4850000,
    discountPercent: 10,
    image: u('1635830625698-3b9bd74671ca', 600),
    rating: 4.7,
    reviews: 64,
  },
  {
    id: 102,
    kind: 'part',
    slug: 'michelin-pilot-sport',
    name: 'لاستیک میشلن پایلوت اسپرت ۴',
    category: 'tires',
    priceToman: 12500000,
    discountPercent: 0,
    image: u('1449426468159-d96dbf08f19f', 600),
    rating: 4.9,
    reviews: 38,
  },
  {
    id: 103,
    kind: 'part',
    slug: 'brembo-brake-kit',
    name: 'کیت لنت و دیسک برمبو',
    category: 'brake',
    priceToman: 21800000,
    discountPercent: 6,
    image: u('1486262715619-67b85e0b08d3', 600),
    rating: 4.8,
    reviews: 21,
  },
  {
    id: 104,
    kind: 'part',
    slug: 'motul-8100-5w30',
    name: 'روغن موتور موتول ۸۱۰۰ ۵W-۳۰',
    category: 'oil-motul',
    priceToman: 5600000,
    discountPercent: 0,
    image: u('1621939514649-280e2ee25f60', 600),
    rating: 4.6,
    reviews: 47,
  },
]

export const ARTICLES = [
  {
    id: 1,
    slug: 'rahnamaye-kharid-mashin-gozar',
    title: 'راهنمای کامل خرید ماشین گذر موقت و دائم',
    excerpt:
      'همه‌چیز درباره خرید ماشین گذر؛ از تفاوت گذر موقت و دائم تا مدارک لازم و نکات حقوقی واردات خودرو از کشورهای حوزه خلیج فارس.',
    date: '۱۴۰۳/۰۴/۱۸',
    readMin: 7,
    category: 'راهنمای خرید',
    image: u('1449965408869-eaa3f722e40d', 800),
  },
  {
    id: 2,
    slug: 'tafavot-gozar-mantaghe-azad',
    title: 'تفاوت خرید ماشین منطقه آزاد با گذر چیست؟',
    excerpt:
      'مقایسه کامل خرید ماشین منطقه آزاد و گذر از نظر قوانین، هزینه ترخیص، امکان پلاک ملی و محدودیت‌های تردد.',
    date: '۱۴۰۳/۰۴/۱۰',
    readMin: 6,
    category: 'قوانین گمرکی',
    image: u('1493238792000-8113da705763', 800),
  },
  {
    id: 3,
    slug: 'mohasebe-hazine-tarkhis',
    title: 'محاسبه هزینه ترخیص و گمرک خودرو وارداتی',
    excerpt:
      'چگونه هزینه نهایی خرید ماشین وارداتی را پیش از سفارش تخمین بزنیم؟ فرمول‌ها و نکات کاهش هزینه ترخیص.',
    date: '۱۴۰۳/۰۳/۲۸',
    readMin: 9,
    category: 'راهنمای خرید',
    image: u('1517524008697-84bbe3c3fd98', 800),
  },
]

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'امیر رضایی',
    role: 'خریدار G63',
    rating: 5,
    text: 'کل فرآیند از سفارش تا تحویل شفاف بود و مرحله‌به‌مرحله در پنل کاربری پیگیری کردم. قیمت درهمی و تومانی دقیقاً همان چیزی بود که اعلام شده بود.',
  },
  {
    id: 2,
    name: 'سارا محمدی',
    role: 'خریدار پورشه ۹۱۱',
    rating: 5,
    text: 'انتخاب رنگ خودرو و ثبت سفارش خیلی ساده بود. پشتیبانی از طریق تیکت سریع جواب می‌داد و واریز بیعانه کاملاً امن انجام شد.',
  },
  {
    id: 3,
    name: 'حسین کاظمی',
    role: 'خریدار رنج‌روور',
    rating: 4,
    text: 'برای واردات از منطقه آزاد راهنمایی کامل گرفتم. مقالات سایت هم در تصمیم‌گیری بین گذر و منطقه آزاد خیلی کمکم کرد.',
  },
  {
    id: 4,
    name: 'مریم اسدی',
    role: 'خریدار مدل S',
    rating: 5,
    text: 'اولین بار بود ماشین وارداتی می‌خریدم و نگران بودم، ولی استپر مراحل سفارش باعث شد همیشه بدانم کجای کار هستم.',
  },
]

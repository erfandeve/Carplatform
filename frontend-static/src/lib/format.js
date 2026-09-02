// Persian number + currency formatting helpers

const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

/** Convert Latin digits in a string to Persian digits. */
export function toFa(value) {
  return String(value).replace(/\d/g, (d) => faDigits[+d])
}

/** Group a number with thousands separators, Persian digits. */
export function faNumber(n) {
  return toFa(new Intl.NumberFormat('en-US').format(Math.round(n)))
}

/**
 * Final Toman price = AED price × exchange rate (Toman per AED).
 * This mirrors the admin "exchange rate" global setting; changing the
 * rate updates every car's Toman price with no per-product edits.
 */
export function tomanFromAed(aed, rate) {
  return aed * rate
}

/** "۱۲٬۵۰۰ درهم" */
export function formatAed(aed) {
  return `${faNumber(aed)} درهم`
}

/** "۱٬۲۵۰٬۰۰۰٬۰۰۰ تومان" */
export function formatToman(toman) {
  return `${faNumber(toman)} تومان`
}

/** Apply a percentage discount, returns the discounted amount. */
export function applyDiscount(amount, percent) {
  if (!percent) return amount
  return amount - (amount * percent) / 100
}

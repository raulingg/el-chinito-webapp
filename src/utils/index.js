export const currencyFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
})

export const makeFormatter = ({ locale = 'default', options = {} } = {}) =>
  new Intl.DateTimeFormat(locale, { timeZone: 'America/Lima', ...options })

export const subtractDate = ({ date = new Date(), days = 1 }) =>
  new Date(new Date().setTime(date.getTime() - 3600000 * 24 * days))

export const calculateTimeElapsed = (start, end = new Date()) => {
  const difference = +end - +start

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

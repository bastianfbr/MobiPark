const DAY_START_HOUR = 8
const DAY_END_HOUR = 20
const DAY_PRICE_PER_HOUR = 2
const NIGHT_PRICE_PER_HOUR = 3

export interface PriceEstimate {
  dayHours: number
  nightHours: number
  dayPrice: number
  nightPrice: number
  total: number
}

/**
 * Reprend le tarif de `PriceCalculator` (backend) : 2 €/h de jour (8h–20h), 3 €/h de nuit,
 * heures arrondies à l'inférieur, moto à moitié prix. La recharge électrique n'est pas incluse.
 */
export function estimatePrice(start: Date, end: Date, motorcycle: boolean): PriceEstimate {
  let dayMinutes = 0
  let nightMinutes = 0
  for (let t = start.getTime(); t < end.getTime(); t += 60_000) {
    const hour = new Date(t).getHours()
    if (hour >= DAY_START_HOUR && hour < DAY_END_HOUR) dayMinutes++
    else nightMinutes++
  }
  const dayHours = Math.floor(dayMinutes / 60)
  const nightHours = Math.floor(nightMinutes / 60)
  const dayPrice = dayHours * DAY_PRICE_PER_HOUR
  const nightPrice = nightHours * NIGHT_PRICE_PER_HOUR
  const raw = dayPrice + nightPrice
  return { dayHours, nightHours, dayPrice, nightPrice, total: motorcycle ? Math.floor(raw / 2) : raw }
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

export function formatDateTime(value: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
}

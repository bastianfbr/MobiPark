import type { Occupant, ParkingSpace } from '~/types/api'

/**
 * Données de démonstration, en attendant les routes du backend
 * (attribution de place, rôle administrateur, statistiques).
 * À supprimer au fur et à mesure que l'API les fournit.
 */

const ELECTRIC_SPACES = [5, 6, 25, 26]
const BUSY_SPACES = [2, 4, 7, 10, 12, 13, 16, 19, 24, 25]
const LATE_SPACES = [21]

export function demoSpaces(): ParkingSpace[] {
  return Array.from({ length: 26 }, (_, i) => {
    const number = i + 1
    return {
      number,
      electric: ELECTRIC_SPACES.includes(number),
      status: LATE_SPACES.includes(number) ? 'late' : BUSY_SPACES.includes(number) ? 'busy' : 'free'
    }
  })
}

/** Première place libre compatible : électrique pour un véhicule électrique, standard sinon. */
export function demoAllocateSpace(electricVehicle: boolean): number {
  const space = demoSpaces().find(s => s.status === 'free' && s.electric === electricVehicle)
  return space?.number ?? 15
}

export const DEMO_OCCUPANTS: Record<number, Occupant> = {
  2: { maker: 'Peugeot 208', plate: 'CD-210-EF', owner: 'Samir T.', period: '08:00 – 12:00', amount: '8,00 €', engine: 'Thermique' },
  4: { maker: 'Renault Clio', plate: 'GH-321-IJ', owner: 'Julie F.', period: '10:00 – 18:00', amount: '16,00 €', engine: 'Thermique' },
  7: { maker: 'Citroën C3', plate: 'KL-654-MN', owner: 'Marc L.', period: '09:00 – 13:00', amount: '8,00 €', engine: 'Thermique' },
  10: { maker: 'Renault Scénic', plate: 'AB-123-CD', owner: 'Alice Martin', period: '08:00 – 17:00', amount: '18,00 €', engine: 'Thermique' },
  12: { maker: 'Toyota Yaris', plate: 'OP-987-QR', owner: 'Hugo B.', period: '11:00 – 19:00', amount: '16,00 €', engine: 'Thermique' },
  13: { maker: 'Dacia Sandero', plate: 'ST-147-UV', owner: 'Inès P.', period: '10:00 – 14:00', amount: '8,00 €', engine: 'Thermique' },
  16: { maker: 'Peugeot 308', plate: 'WX-258-YZ', owner: 'Léa D.', period: '11:00 – 16:00', amount: '10,00 €', engine: 'Thermique' },
  19: { maker: 'Kia Picanto', plate: 'BC-369-DE', owner: 'Tom G.', period: '08:00 – 18:00', amount: '20,00 €', engine: 'Thermique' },
  21: { maker: 'Volkswagen Polo', plate: 'NP-963-QR', owner: 'Nora K.', period: '08:00 – 11:00', amount: '6,00 €', engine: 'Thermique' },
  24: { maker: 'Renault Twingo', plate: 'FG-741-HI', owner: 'Paul V.', period: '09:00 – 12:00', amount: '6,00 €', engine: 'Thermique' },
  25: { maker: 'Renault Zoé', plate: 'JK-852-LM', owner: 'Camille R.', period: '08:00 – 16:00', amount: '21,00 €', engine: 'Électrique' }
}

export interface DemoBooking {
  period: string
  user: string
  plate: string
  place: number
  electric: boolean
  amount: string
  status: 'En cours' | 'À venir' | 'Dépassement'
}

export const DEMO_BOOKINGS: DemoBooking[] = [
  { period: '08:00 – 16:00', user: 'Camille R.', plate: 'JK-852-LM', place: 25, electric: true, amount: '21,00 €', status: 'En cours' },
  { period: '11:00 – 19:00', user: 'Hugo B.', plate: 'OP-987-QR', place: 12, electric: false, amount: '16,00 €', status: 'En cours' },
  { period: '11:00 – 16:00', user: 'Léa D.', plate: 'WX-258-YZ', place: 16, electric: false, amount: '10,00 €', status: 'En cours' },
  { period: '08:00 – 11:00', user: 'Nora K.', plate: 'NP-963-QR', place: 21, electric: false, amount: '6,00 €', status: 'Dépassement' },
  { period: '14:00 – 18:00', user: 'Samir T.', plate: 'CD-210-EF', place: 3, electric: false, amount: '8,00 €', status: 'À venir' }
]

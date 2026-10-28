export interface User {
  id: number
  username: string
}

export type VehicleType = 'Car' | 'Motorcycle'
export type EngineKind = 'Thermal' | 'Electrical'

export interface Vehicle {
  type: VehicleType
  maker: string
  licensePlateNumber: string
  engine: EngineKind
}

export interface Reservation {
  reservationId: number
  vehicleId: string
  vehicle: Vehicle
  place: string
  beginDate: string
  endDate: string
}

export interface CreateVehicleBody {
  type: VehicleType
  maker: string
  licensePlate: { type: 'FR' | 'DE', value: string }
  engine: {
    engineType: 'ThermalEngine' | 'ElectricalEngine'
    batteryCapacity?: number
    currentBatteryCapacity?: number
  }
}

export type SpaceStatus = 'free' | 'busy' | 'late'

export interface ParkingSpace {
  number: number
  electric: boolean
  status: SpaceStatus
}

/** Réservation en cours sur une place (vue administrateur). */
export interface Occupant {
  maker: string
  plate: string
  owner: string
  period: string
  amount: string
  engine: string
}

export interface ReservationDraft {
  vehicle: Vehicle
  start: string
  end: string
  total: number
  place: number
}

export type Coordinates = [number, number]

export type ZoneType = 'SAFE' | 'DANGER' | 'CRITICAL'

export type Zone = {
  id: string
  slug: string
  date: string
  hour: string
  description: string
  type: ZoneType
  reports?: number
  featureDetails: {
    id: string
    zoneId: string
    zoneType: ZoneType
    goodLighting: boolean
    policePresence: boolean
    publicTransport: boolean
    insufficientLighting: boolean
    lackOfPolicing: boolean
    abandonedHouses: boolean
    createdAt: string
    updatedAt: string
  }
}

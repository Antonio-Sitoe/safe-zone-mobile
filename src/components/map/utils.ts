import type { Coordinates, Zone, ZoneType } from './store'

export const DEFAULT_COORDINATE: Coordinates = [-8.61398, 41.1413]

export const parseReports = (value: string) => Number.parseInt(value, 10) || 0

export const distanceInMeters = (
  [lng1, lat1]: Coordinates,
  [lng2, lat2]: Coordinates
) => {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const mapZoneToFeatureCollection = (zones: Zone[]) => ({
  type: 'FeatureCollection' as const,
  features: zones.map((zone) => {
    const longitude = zone.geom?.x ?? zone.coordinates?.longitude
    const latitude = zone.geom?.y ?? zone.coordinates?.latitude
    const computedType: ZoneType =
      zone.reports && zone.reports >= 10 ? 'CRITICAL' : zone.type

    return {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [longitude, latitude],
      },
      properties: {
        slug: zone.slug,
        description: zone.description,
        reports: zone.reports,
        displayType: computedType,
        createdBy: zone.createdBy,
      },
    }
  }),
})

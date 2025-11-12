import { create } from 'zustand'
import MapboxGL from '@rnmapbox/maps'

export type Coordinates = [number, number]

export type ZoneType = 'SAFE' | 'DANGER' | 'CRITICAL'

export type Zone = {
  slug: string
  date?: string
  hour?: string
  description?: string
  type: ZoneType
  reports?: number
  coordinates: {
    latitude: number
    longitude: number
  }
  geom?: {
    x: number
    y: number
  }
  createdBy?: string
  id?: string
}

export type MapStyleOption = string

export interface MapStoreState {
  isCheckingPermission: boolean
  hasPermission: boolean | null
  userCoordinate: Coordinates | null
  mapStyle: MapStyleOption
  zones: Zone[]
  isZoneModalVisible: boolean
  pendingCoordinate: Coordinates | null
  zoneDescription: string
  zoneReports: string
  zoneType: ZoneType
  editingZoneSlug: string | null
  isLoadingLocation: boolean
  selectedLocationName: string | null
  isZonesSheetOpen: boolean
}

export interface MapStoreActions {
  setCheckingPermission: (value: boolean) => void
  setHasPermission: (value: boolean | null) => void
  setUserCoordinate: (coordinate: Coordinates | null) => void
  setMapStyle: (style: MapStyleOption) => void
  toggleMapStyle: () => void
  setZones: (zones: Zone[]) => void
  setZoneModalVisible: (value: boolean) => void
  setPendingCoordinate: (coordinate: Coordinates | null) => void
  setZoneDescription: (value: string) => void
  setZoneReports: (value: string) => void
  setZoneType: (value: ZoneType) => void
  setEditingZoneSlug: (slug: string | null) => void
  setLoadingLocation: (value: boolean) => void
  resetZoneForm: () => void
  resetStore: () => void
  setSelectedLocationName: (value: string | null) => void
  setZonesSheetOpen: (value: boolean) => void
  toggleZonesSheet: () => void
}

const defaultState: MapStoreState = {
  isCheckingPermission: true,
  hasPermission: null,
  userCoordinate: null,
  mapStyle: MapboxGL.StyleURL.SatelliteStreet,
  zones: [],
  isZoneModalVisible: false,
  pendingCoordinate: null,
  zoneDescription: '',
  zoneReports: '0',
  zoneType: 'SAFE',
  editingZoneSlug: null,
  isLoadingLocation: true,
  selectedLocationName: null,
  isZonesSheetOpen: false,
}

export const useMapStore = create<MapStoreState & MapStoreActions>(
  (set, get) => ({
    ...defaultState,
    setCheckingPermission: (value) => set({ isCheckingPermission: value }),
    setHasPermission: (value) => set({ hasPermission: value }),
    setUserCoordinate: (coordinate) => set({ userCoordinate: coordinate }),
    setMapStyle: (style) => set({ mapStyle: style }),
    toggleMapStyle: () =>
      set((state) => ({
        mapStyle:
          state.mapStyle === MapboxGL.StyleURL.SatelliteStreet
            ? MapboxGL.StyleURL.Street
            : MapboxGL.StyleURL.SatelliteStreet,
      })),
    setZones: (zones) => set({ zones }),
    setZoneModalVisible: (value) => set({ isZoneModalVisible: value }),
    setPendingCoordinate: (coordinate) =>
      set({ pendingCoordinate: coordinate }),
    setZoneDescription: (value) => set({ zoneDescription: value }),
    setZoneReports: (value) => set({ zoneReports: value }),
    setZoneType: (value) => set({ zoneType: value }),
    setEditingZoneSlug: (slug) => set({ editingZoneSlug: slug }),
    setLoadingLocation: (value) => set({ isLoadingLocation: value }),
    setSelectedLocationName: (value) => set({ selectedLocationName: value }),
    setZonesSheetOpen: (value) => set({ isZonesSheetOpen: value }),
    toggleZonesSheet: () =>
      set((state) => ({ isZonesSheetOpen: !state.isZonesSheetOpen })),
    resetZoneForm: () =>
      set({
        pendingCoordinate: null,
        zoneDescription: '',
        zoneReports: '0',
        zoneType: 'SAFE',
        editingZoneSlug: null,
        isZoneModalVisible: false,
        selectedLocationName: null,
      }),
    resetStore: () => set(defaultState),
  })
)

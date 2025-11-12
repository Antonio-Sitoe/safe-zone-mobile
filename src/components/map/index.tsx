import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Platform, View, Alert, Pressable, Text } from 'react-native'

import {
  DEFAULT_COORDINATE,
  parseReports,
  distanceInMeters,
  mapZoneToFeatureCollection,
} from './utils'

import MapboxGL from '@rnmapbox/maps'
import * as Location from 'expo-location'
import { useAuthStore } from '@/contexts/auth-store'
import { env } from '@/lib/env'
import { MapCanvas } from './components/MapCanvas'
import { ZoneModal } from './components/ZoneModal'
import { ZonesSheet } from './components/zone-list-section'
import { CreateZoneSheet } from './components/CreateZoneSheet'
import { PermissionOverlay } from './components/PermissionOverlay'
import { StyleToggleButton } from './components/StyleToggleButton'
import { CenterOnUserButton } from './components/CenterOnUserButton'
import { CreateArea } from '@/components/modal/area-form'
import type { SafeZoneData } from '@/@types/area'
import { getAllZones } from '@/actions/zone'
import { useQuery } from '@tanstack/react-query'
import { Coordinates, Zone, ZoneType } from './types'

MapboxGL.setAccessToken(env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN)

export default function MapComponent() {
  const { user } = useAuthStore()

  const { data: zonesData } = useQuery({
    queryKey: ['zones', 'all'],
    queryFn: async () => await getAllZones(),
  })

  const zonesFromBackend = useMemo(() => {
    return zonesData?.data || []
  }, [zonesData?.data])

  const cameraRef = useRef<MapboxGL.Camera | null>(null)

  const [isCheckingPermission, setIsCheckingPermission] = useState(true)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [userCoordinate, setUserCoordinate] = useState<Coordinates | null>(null)
  const [mapStyle, setMapStyle] = useState<string>(
    MapboxGL.StyleURL.SatelliteStreet
  )
  const [zones, setZones] = useState<Zone[]>([])
  const [isZoneModalVisible, setZoneModalVisible] = useState(false)
  const [pendingCoordinate, setPendingCoordinate] =
    useState<Coordinates | null>(null)
  const [zoneDescription, setZoneDescription] = useState('')
  const [zoneReports, setZoneReports] = useState('0')
  const [zoneType, setZoneType] = useState<ZoneType>('SAFE')
  const [editingZoneSlug, setEditingZoneSlug] = useState<string | null>(null)
  const [selectedLocationName, setSelectedLocationName] = useState<
    string | null
  >(null)
  const [isZonesSheetOpen, setZonesSheetOpen] = useState(false)
  const toggleMapStyle = useCallback(() => {
    setMapStyle((current) =>
      current === MapboxGL.StyleURL.SatelliteStreet
        ? MapboxGL.StyleURL.Street
        : MapboxGL.StyleURL.SatelliteStreet
    )
  }, [])

  const resetZoneForm = useCallback(() => {
    setPendingCoordinate(null)
    setZoneDescription('')
    setZoneReports('0')
    setZoneType('SAFE')
    setEditingZoneSlug(null)
    setZoneModalVisible(false)
    setSelectedLocationName(null)
  }, [])

  useEffect(() => {
    if (zonesFromBackend.length > 0) {
      const mappedZones = zonesFromBackend.map((zone: any) => ({
        slug: zone.slug || zone.id || '',
        date: zone.date,
        hour: zone.hour,
        description: zone.description,
        type: zone.type as ZoneType,
        reports: zone.reports ?? 0,
        coordinates: {
          latitude: zone.latitude,
          longitude: zone.longitude,
        },
        geom: {
          x: zone.longitude,
          y: zone.latitude,
        },
        createdBy: zone.userId,
        id: zone.id,
      }))
      setZones(mappedZones)
    }
  }, [zonesFromBackend, setZones])

  useEffect(() => {
    let isMounted = true

    const requestPermissionsAndLocation = async () => {
      try {
        if (Platform.OS === 'android') {
          await MapboxGL.requestAndroidLocationPermissions()
        }

        const { status } = await Location.requestForegroundPermissionsAsync()
        if (!isMounted) return

        const granted = status === 'granted'
        setHasPermission(granted)

        if (!granted) {
          setIsCheckingPermission(false)
          return
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        })

        if (!isMounted) return

        setUserCoordinate([
          currentLocation.coords.longitude,
          currentLocation.coords.latitude,
        ])
        setIsCheckingPermission(false)
      } catch (error) {
        console.warn('Erro a obter localização do utilizador:', error)
        if (isMounted) {
          setHasPermission(false)
          setIsCheckingPermission(false)
        }
      }
    }

    requestPermissionsAndLocation()

    return () => {
      isMounted = false
    }
  }, [])

  const cameraCoordinate = useMemo<Coordinates>(
    () => userCoordinate ?? DEFAULT_COORDINATE,
    [userCoordinate]
  )

  const zoomLevel = userCoordinate ? 15 : 4
  const isSatelliteStyle = mapStyle === MapboxGL.StyleURL.SatelliteStreet

  const zoneFeatureCollection = useMemo(() => {
    return mapZoneToFeatureCollection(zones)
  }, [zones])

  const [isCreateZoneSheetOpen, setCreateZoneSheetOpen] = useState(false)
  const [isCreateAreaVisible, setCreateAreaVisible] = useState(false)
  const [createAreaVariant, setCreateAreaVariant] = useState<'safe' | 'danger'>(
    'safe'
  )

  const handleMapLongPress = (event: {
    geometry: { coordinates: Coordinates }
  }) => {
    setZonesSheetOpen(false)
    const [longitude, latitude] = event.geometry.coordinates
    setPendingCoordinate([longitude, latitude])
    setZoneDescription('')
    setZoneReports('0')
    setZoneType('SAFE')
    setEditingZoneSlug(null)
    setSelectedLocationName(null)
    setZoneModalVisible(false)
    setCreateAreaVariant('safe')
    setCreateAreaVisible(false)
    setCreateZoneSheetOpen(true)
  }

  const handleCloseZoneModal = () => {
    resetZoneForm()
  }

  const handleSaveZone = () => {
    if (!pendingCoordinate) {
      Alert.alert(
        'Coordenadas não definidas',
        'Toque e segure no mapa para escolher a localização da zona.'
      )
      return
    }

    if (!zoneDescription.trim()) {
      Alert.alert(
        'Descrição obrigatória',
        'Adicione uma descrição para identificar a zona.'
      )
      return
    }

    const reportsValue = parseReports(zoneReports)
    const baseType: ZoneType =
      reportsValue >= 10 ? 'CRITICAL' : zoneType ?? 'SAFE'

    const now = new Date()

    if (editingZoneSlug) {
      const currentZones = zones
      const updatedZones = currentZones.map((zone) => {
        if (zone.slug !== editingZoneSlug) {
          return zone
        }

        if (zone.createdBy !== user?.id) {
          Alert.alert(
            'Ação não permitida',
            'Só é possível editar zonas que criaste.'
          )
          return zone
        }

        return {
          ...zone,
          description: zoneDescription.trim(),
          reports: reportsValue,
          type: baseType,
          date: now.toISOString().split('T')[0],
          hour: now.toTimeString().slice(0, 5),
          coordinates: {
            latitude: pendingCoordinate[1],
            longitude: pendingCoordinate[0],
          },
          geom: {
            x: pendingCoordinate[0],
            y: pendingCoordinate[1],
          },
        }
      })
      setZones(updatedZones)
      handleCloseZoneModal()
      return
    }

    const newZone = {
      slug: `zona-${now.getTime()}`,
      date: now.toISOString().split('T')[0],
      hour: now.toTimeString().slice(0, 5),
      description: zoneDescription.trim(),
      type: baseType,
      reports: reportsValue,
      coordinates: {
        latitude: pendingCoordinate[1],
        longitude: pendingCoordinate[0],
      },
      geom: {
        x: pendingCoordinate[0],
        y: pendingCoordinate[1],
      },
      createdBy: user?.id || 'unknown',
    }

    const MERGE_THRESHOLD_METERS = 200

    const currentZones = zones
    const existingIndex = currentZones.findIndex((zone) => {
      const currentCoord: Coordinates = [
        zone.geom?.x ?? zone.coordinates?.longitude,
        zone.geom?.y ?? zone.coordinates?.latitude,
      ]
      return (
        distanceInMeters(currentCoord, pendingCoordinate) <
        MERGE_THRESHOLD_METERS
      )
    })

    if (existingIndex >= 0) {
      const existing = currentZones[existingIndex]
      const mergedReports = (existing.reports ?? 0) + newZone.reports
      const mergedZone = {
        ...existing,
        description: `${existing.description || ''}\n• ${newZone.description}`,
        reports: mergedReports,
        type: mergedReports >= 10 ? 'CRITICAL' : existing.type,
      }

      const updated = [...currentZones]
      updated[existingIndex] = mergedZone
      setZones(updated)
    } else {
      setZones([...currentZones, newZone])
    }

    handleCloseZoneModal()
  }

  const handleEditZone = (zone: Zone) => {
    if (zone.createdBy !== user?.id) {
      Alert.alert('Ação não permitida', 'Só podes editar zonas que criaste.')
      return
    }

    setEditingZoneSlug(zone.slug)
    setPendingCoordinate([
      zone.geom?.x ?? zone.coordinates?.longitude,
      zone.geom?.y ?? zone.coordinates?.latitude,
    ])
    setZoneDescription(zone.description || '')
    setZoneReports(String(zone.reports ?? 0))
    setZoneType(zone.type)
    setZoneModalVisible(true)
  }

  const handleCloseCreateZoneSheet = () => {
    setCreateZoneSheetOpen(false)
    setCreateAreaVisible(false)
    setPendingCoordinate(null)
  }

  const handleSelectCreateZone = (variant: 'safe' | 'danger') => {
    if (!pendingCoordinate) {
      setCreateZoneSheetOpen(false)
      return
    }

    setCreateAreaVariant(variant)
    setZoneType(variant === 'danger' ? 'DANGER' : 'SAFE')
    setCreateZoneSheetOpen(false)
    setCreateAreaVisible(true)
  }

  const handleCloseCreateArea = () => {
    setCreateAreaVisible(false)
    setCreateZoneSheetOpen(false)
    setPendingCoordinate(null)
    setZoneDescription('')
    setZoneReports('0')
    setZoneType('SAFE')
    setEditingZoneSlug(null)
  }

  const handleSaveCreateArea = (data: SafeZoneData) => {
    if (!pendingCoordinate) {
      Alert.alert(
        'Coordenadas não definidas',
        'Toque e segure no mapa para escolher a localização da zona.'
      )
      return
    }

    const [longitude, latitude] = pendingCoordinate
    const now = new Date()
    const zoneDate = data.date || now.toISOString().split('T')[0]
    const zoneHour = data.time || now.toTimeString().slice(0, 5)
    console.log('-------------', data)
    const zoneTypeValue: ZoneType =
      createAreaVariant === 'danger' ? 'DANGER' : 'SAFE'

    const newZone = {
      slug: `zona-${now.getTime()}`,
      date: zoneDate,
      hour: zoneHour,
      description: data.description.trim(),
      type: zoneTypeValue,
      reports: zoneTypeValue === 'DANGER' ? 1 : 0,
      coordinates: {
        latitude,
        longitude,
      },
      geom: {
        x: longitude,
        y: latitude,
      },
      createdBy: user?.id || 'unknown',
    }

    const MERGE_THRESHOLD_METERS = 200

    const currentZones = zones
    const existingIndex = currentZones.findIndex((zone) => {
      const currentCoord: Coordinates = [
        zone.geom?.x ?? zone.coordinates?.longitude,
        zone.geom?.y ?? zone.coordinates?.latitude,
      ]
      return (
        distanceInMeters(currentCoord, pendingCoordinate) <
        MERGE_THRESHOLD_METERS
      )
    })

    if (existingIndex >= 0) {
      const existing = currentZones[existingIndex]
      const mergedReports = (existing.reports ?? 0) + (newZone.reports ?? 0)
      const mergedZone = {
        ...existing,
        description: `${existing.description || ''}\n• ${newZone.description}`,
        reports: mergedReports,
        type: mergedReports >= 10 ? 'CRITICAL' : existing.type,
        date: zoneDate,
        hour: zoneHour,
      }

      const updated = [...currentZones]
      updated[existingIndex] = mergedZone
      setZones(updated)
    } else {
      setZones([...currentZones, newZone])
    }

    setCreateAreaVisible(false)
    setPendingCoordinate(null)
    setZoneDescription('')
    setZoneReports('0')
    setZoneType('SAFE')
    setEditingZoneSlug(null)
    setSelectedLocationName(data.location || null)
  }

  const requestDeleteZone = (zone: Zone) => {
    if (zone.createdBy !== user?.id) {
      Alert.alert('Ação não permitida', 'Só podes eliminar zonas que criaste.')
      return
    }

    Alert.alert(
      'Eliminar zona',
      `Tens a certeza que queres eliminar ${zone.description || 'esta zona'}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const filtered = zones.filter(
              (existingZone) => existingZone.slug !== zone.slug
            )
            setZones(filtered)
          },
        },
      ]
    )
  }

  const flyToCoordinate = ([longitude, latitude]: Coordinates) => {
    cameraRef.current?.setCamera({
      centerCoordinate: [longitude, latitude],
      zoomLevel: 14,
      animationDuration: 1200,
    })
  }

  const handleCenterOnUser = () => {
    if (userCoordinate && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: userCoordinate,
        zoomLevel: 15,
        animationDuration: 1000,
      })
    }
  }

  const createAreaLocation = useMemo(() => {
    if (!pendingCoordinate) {
      return null
    }

    const [longitude, latitude] = pendingCoordinate
    return {
      name:
        selectedLocationName ??
        `Lat ${latitude.toFixed(5)}, Lng ${longitude.toFixed(5)}`,
      latitude,
      longitude,
    }
  }, [pendingCoordinate, selectedLocationName])

  useEffect(() => {
    if (pendingCoordinate) {
      setZonesSheetOpen(false)
    }
  }, [pendingCoordinate, setZonesSheetOpen])

  return (
    <View className="flex-1 bg-black">
      <MapCanvas
        mapStyle={mapStyle}
        cameraCoordinate={cameraCoordinate}
        zoomLevel={zoomLevel}
        onLongPress={handleMapLongPress}
        zoneShape={zoneFeatureCollection}
        isZonesVisible={zones.length > 0}
        userCoordinate={userCoordinate}
        cameraRef={cameraRef}
        selectedCoordinate={pendingCoordinate || null}
      />

      <View className="absolute top-8 right-6 flex-row gap-3">
        <StyleToggleButton
          isSatellite={isSatelliteStyle}
          onToggle={toggleMapStyle}
          className="rounded-full bg-black/70 px-4 py-2.5"
        />
      </View>

      <PermissionOverlay
        isChecking={isCheckingPermission}
        hasPermission={hasPermission}
      />

      <CenterOnUserButton
        onPress={handleCenterOnUser}
        isVisible={!!userCoordinate}
      />

      {!pendingCoordinate && !isZonesSheetOpen && (
        <View className="absolute left-0 right-0 bottom-0 flex-row rounded-t-3xl items-center overflow-hidden bg-white">
          <View className="flex-1 gap-1 px-5 py-3.5">
            <Text className="text-sm font-semibold text-black">
              Todas as Zonas (
              <Text className="text-xs text-black">
                {zones.length === 0
                  ? 'Sem zonas registadas'
                  : `${zones.length} zona${zones.length === 1 ? '' : 's'}`}
              </Text>
              )
            </Text>

            <Text className="text-[8px] text-gray-400">
              Clica continuamente no mapa para adicionar uma zona.
            </Text>
          </View>
          <Pressable
            onPress={() => setZonesSheetOpen(true)}
            className="items-center justify-center bg-app-primary mr-4 rounded-2xl px-5 py-3.5"
          >
            <Text className="text-sm font-semibold text-white">Ver</Text>
          </Pressable>
        </View>
      )}

      <ZonesSheet
        isOpen={isZonesSheetOpen && !pendingCoordinate}
        currentUserId={user?.id || null}
        onClose={() => setZonesSheetOpen(false)}
        onLocate={flyToCoordinate}
        onEdit={handleEditZone}
        onDelete={requestDeleteZone}
      />

      <CreateZoneSheet
        isOpen={isCreateZoneSheetOpen}
        onClose={handleCloseCreateZoneSheet}
        onSelect={handleSelectCreateZone}
        coordinate={pendingCoordinate}
      />

      <ZoneModal
        visible={isZoneModalVisible}
        pendingCoordinate={pendingCoordinate}
        zoneDescription={zoneDescription}
        zoneReports={zoneReports}
        zoneType={zoneType}
        editingZoneSlug={editingZoneSlug}
        onChangeDescription={setZoneDescription}
        onChangeReports={setZoneReports}
        onSelectType={setZoneType}
        onRequestClose={handleCloseZoneModal}
        onSave={handleSaveZone}
      />

      <CreateArea
        visible={isCreateAreaVisible}
        onClose={handleCloseCreateArea}
        onSave={handleSaveCreateArea}
        variant={createAreaVariant}
        location={createAreaLocation}
      />
    </View>
  )
}

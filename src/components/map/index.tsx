import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Platform,
  StyleSheet,
  View,
  Alert,
  Pressable,
  Text,
} from 'react-native'
import MapboxGL from '@rnmapbox/maps'
import * as Location from 'expo-location'
import { useAuthStore } from '@/contexts/auth-store'
import { env } from '@/lib/env'
import { useMapStore } from './store'
import { MapCanvas } from './components/MapCanvas'
import { StyleToggleButton } from './components/StyleToggleButton'
import { PermissionOverlay } from './components/PermissionOverlay'
import { ShowCoordinateBanner } from './components/ShowCoordinateBanner'
import { CenterOnUserButton } from './components/CenterOnUserButton'
import { ZonesSheet } from './zone-section-list'
import { ZoneModal } from './components/ZoneModal'
import { CreateZoneSheet } from './components/CreateZoneSheet'
import {
  DEFAULT_COORDINATE,
  parseReports,
  distanceInMeters,
  mapZoneToFeatureCollection,
} from './utils'
import type { Zone } from '@/@types/Zone'
import type { Coordinates, ZoneType } from './store'
import { CreateArea } from '@/components/modal/area-form'
import type { SafeZoneData } from '@/@types/area'

MapboxGL.setAccessToken(env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN)

type MapComponentProps = {
  zones?: Zone[]
}

export default function MapComponent({ zones = [] }: MapComponentProps) {
  const { user } = useAuthStore()
  const cameraRef = useRef<MapboxGL.Camera | null>(null)

  const {
    isCheckingPermission,
    hasPermission,
    userCoordinate,
    mapStyle,
    zones: storeZones,
    isZoneModalVisible,
    pendingCoordinate,
    zoneDescription,
    zoneReports,
    zoneType,
    editingZoneSlug,
    selectedLocationName,
    setCheckingPermission,
    setHasPermission,
    setUserCoordinate,
    toggleMapStyle,
    setZones,
    setZoneModalVisible,
    setPendingCoordinate,
    setZoneDescription,
    setZoneReports,
    setZoneType,
    setEditingZoneSlug,
    setLoadingLocation,
    resetZoneForm,
    setSelectedLocationName,
    isZonesSheetOpen,
    setZonesSheetOpen,
  } = useMapStore()

  // Initialize zones from props
  useEffect(() => {
    if (zones.length > 0) {
      const mappedZones = zones.map((zone) => ({
        slug: zone.slug || zone.id || '',
        date: zone.date,
        hour: zone.hour,
        description: zone.description,
        type: zone.type as ZoneType,
        reports: zone.reports ?? 0,
        coordinates: zone.coordinates,
        geom: {
          x: zone.coordinates?.longitude,
          y: zone.coordinates?.latitude,
        },
        createdBy: user?.id,
        id: zone.id,
      }))
      setZones(mappedZones)
    }
  }, [zones, user?.id, setZones])

  // Request location permissions
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
          setCheckingPermission(false)
          setLoadingLocation(false)
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
        setCheckingPermission(false)
        setLoadingLocation(false)
      } catch (error) {
        console.warn('Erro a obter localização do utilizador:', error)
        if (isMounted) {
          setHasPermission(false)
          setCheckingPermission(false)
          setLoadingLocation(false)
        }
      }
    }

    requestPermissionsAndLocation()

    return () => {
      isMounted = false
    }
  }, [
    setHasPermission,
    setUserCoordinate,
    setCheckingPermission,
    setLoadingLocation,
  ])

  const cameraCoordinate = useMemo<Coordinates>(
    () => userCoordinate ?? DEFAULT_COORDINATE,
    [userCoordinate]
  )

  const zoomLevel = userCoordinate ? 15 : 4
  const isSatelliteStyle = mapStyle === MapboxGL.StyleURL.SatelliteStreet

  const zoneFeatureCollection = useMemo(() => {
    return mapZoneToFeatureCollection(storeZones)
  }, [storeZones])

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
      const currentZones = storeZones
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

    const currentZones = storeZones
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

  const handleEditZone = (zone: (typeof storeZones)[0]) => {
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

    const currentZones = storeZones
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

  const requestDeleteZone = (zone: (typeof storeZones)[0]) => {
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
            const filtered = storeZones.filter(
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
    <View style={styles.container}>
      <MapCanvas
        mapStyle={mapStyle}
        cameraCoordinate={cameraCoordinate}
        zoomLevel={zoomLevel}
        onLongPress={handleMapLongPress}
        zoneShape={zoneFeatureCollection}
        isZonesVisible={storeZones.length > 0}
        userCoordinate={userCoordinate}
        cameraRef={cameraRef}
        selectedCoordinate={pendingCoordinate || null}
      />

      <View style={styles.topControls}>
        <ShowCoordinateBanner
          coordinates={pendingCoordinate || userCoordinate}
          locationName={selectedLocationName}
          buttonTextStyle={styles.controlButtonText}
        />

        <StyleToggleButton
          isSatellite={isSatelliteStyle}
          onToggle={toggleMapStyle}
          style={styles.controlButton}
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
        <Pressable
          onPress={() => setZonesSheetOpen(true)}
          style={styles.zonesPill}
        >
          <View style={styles.zonesPillContent}>
            <Text style={styles.zonesPillTitle}>Zonas monitorizadas</Text>
            <Text style={styles.zonesPillSubtitle}>
              {storeZones.length === 0
                ? 'Sem zonas registadas'
                : `${storeZones.length} zona${
                    storeZones.length === 1 ? '' : 's'
                  }`}
            </Text>
          </View>
          <View style={styles.zonesPillAction}>
            <Text style={styles.zonesPillActionText}>Ver</Text>
          </View>
        </Pressable>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topControls: {
    position: 'absolute',
    top: 32,
    right: 24,
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  zonesPill: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.92)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  zonesPillContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 4,
  },
  zonesPillTitle: {
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: '600',
  },
  zonesPillSubtitle: {
    color: '#E5E7EB',
    fontSize: 12,
  },
  zonesPillAction: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563EB',
  },
  zonesPillActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
})

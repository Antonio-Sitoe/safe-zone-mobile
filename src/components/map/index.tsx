import { useRouter } from 'expo-router'
import MarkerSvg from './marker.svg'
import * as MapLibreGL from '@maplibre/maplibre-react-native'
import { useRef, useState, useEffect, useId, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import type { Feature } from 'geojson'
import type { Zone } from '@/@types/Zone'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'

type LocationState = {
  lat: number
  lng: number
  name: string
} | null

type Coordinates = {
  latitude: number
  longitude: number
}

export default function MapComponent({
  variant,
  zones = [],
}: {
  variant: 'safe' | 'danger'
  zones?: Zone[]
}) {
  const userMarkerId = useId()
  const selectedMarkerId = useId()
  const mapRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const router = useRouter()

  const [selectedLocation, setSelectedLocation] = useState<LocationState>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null)
  const [draggableMarkerLocation, setDraggableMarkerLocation] =
    useState<Coordinates | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(
    null
  )

  // Request location permissions
  useEffect(() => {
    requestLocationPermission()
    return () => {
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove()
      }
    }
  }, [])

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'É necessário permitir o acesso à localização para usar este recurso.',
          [{ text: 'OK' }]
        )
        setIsLoadingLocation(false)
        return
      }

      // Get initial location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })

      const coords: Coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }

      setUserLocation(coords)
      setDraggableMarkerLocation(coords)
      setIsLoadingLocation(false)

      // Start watching location for real-time updates
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Or every 10 meters
        },
        (newLocation) => {
          const newCoords: Coordinates = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          }
          setUserLocation(newCoords)
          // Only update draggable marker if user hasn't manually moved it
          // We'll track this with a flag
        }
      )

      locationSubscriptionRef.current = subscription

      // Center camera on user location
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: [
            location.coords.longitude,
            location.coords.latitude,
          ],
          zoomLevel: 15,
          animationDuration: 1000,
        })
      }
    } catch (error) {
      console.error('Error getting location:', error)
      Alert.alert('Erro', 'Não foi possível obter sua localização.')
      setIsLoadingLocation(false)
    }
  }

  const handleMapPress = useCallback((feature: Feature) => {
    setIsLoading(true)
    const { geometry } = feature

    if (geometry.type !== 'Point') return

    const [lng, lat] = geometry.coordinates

    // Update draggable marker position
    setDraggableMarkerLocation({ latitude: lat, longitude: lng })

    // Fetch location name
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'SafeZoneMobileApp/1.0',
          Accept: 'application/json',
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        const locationName = data.display_name || 'Local Desconhecido'
        setSelectedLocation({
          lat,
          lng,
          name: locationName,
        })
      })
      .catch((error) => {
        console.error('Error fetching location name:', error)
        setSelectedLocation({
          lat,
          lng,
          name: `Local: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const handleMarkerDragEnd = useCallback((event: any) => {
    const coordinates = event.geometry.coordinates as [number, number]
    const [lng, lat] = coordinates

    setDraggableMarkerLocation({ latitude: lat, longitude: lng })
    setIsLoading(true)

    // Fetch location name for new position
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'SafeZoneMobileApp/1.0',
          Accept: 'application/json',
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        const locationName = data.display_name || 'Local Desconhecido'
        setSelectedLocation({
          lat,
          lng,
          name: locationName,
        })
      })
      .catch((error) => {
        console.error('Error fetching location name:', error)
        setSelectedLocation({
          lat,
          lng,
          name: `Local: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const handleCenterOnUser = useCallback(() => {
    if (userLocation && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [userLocation.longitude, userLocation.latitude],
        zoomLevel: 15,
        animationDuration: 1000,
      })
    }
  }, [userLocation])

  const handleCancel = () => {
    setSelectedLocation(null)
    router.back()
  }

  const handleMark = () => {
    if (!selectedLocation) return
    router.navigate({
      pathname:
        variant === 'safe' ? '/app/home/safeZone' : '/app/home/dangerousZone',
      params: {
        modalIsOpen: 'true',
        lat: selectedLocation.lat.toString(),
        lng: selectedLocation.lng.toString(),
        name: selectedLocation.name,
      },
    })
  }

  const mapStyleJSON = {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors',
      },
    },
    layers: [
      {
        id: 'osm',
        type: 'raster',
        source: 'osm',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  }

  const displayCoords = draggableMarkerLocation || userLocation

  return (
    <View className="flex-1 bg-gray-900">
      {isLoadingLocation ? (
        <View className="flex-1 justify-center items-center bg-gray-900">
          <ActivityIndicator size="large" color="#1F346C" />
          <Text className="text-white mt-4 text-base">
            Obtendo localização...
          </Text>
        </View>
      ) : (
        <>
          <MapLibreGL.MapView
            ref={mapRef}
            style={{ flex: 1 }}
            mapStyle={mapStyleJSON}
            onPress={handleMapPress}
          >
            <MapLibreGL.Camera
              ref={cameraRef}
              zoomLevel={15}
              centerCoordinate={
                userLocation
                  ? [userLocation.longitude, userLocation.latitude]
                  : [32.5892, -25.9653]
              }
              animationMode="flyTo"
              animationDuration={2000}
            />

            {/* User's current location marker (real-time) */}
            {userLocation && (
              <MapLibreGL.PointAnnotation
                id={userMarkerId}
                coordinate={[userLocation.longitude, userLocation.latitude]}
              >
                <View className="items-center justify-center">
                  {/* Outer pulsing circle */}
                  <View
                    className="absolute"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: '#10B981',
                      opacity: 0.3,
                    }}
                  />
                  {/* Inner circle */}
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: '#10B981',
                      borderWidth: 3,
                      borderColor: 'white',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
                  >
                    <Text
                      className="text-white font-bold text-xs"
                      style={{
                        textAlign: 'center',
                        lineHeight: 18,
                      }}
                    >
                      A
                    </Text>
                  </View>
                  {/* Teardrop pointer */}
                  <View
                    style={{
                      position: 'absolute',
                      top: 22,
                      width: 0,
                      height: 0,
                      borderLeftWidth: 4,
                      borderRightWidth: 4,
                      borderTopWidth: 8,
                      borderLeftColor: 'transparent',
                      borderRightColor: 'transparent',
                      borderTopColor: '#10B981',
                    }}
                  />
                </View>
              </MapLibreGL.PointAnnotation>
            )}

            {/* Draggable marker */}
            {draggableMarkerLocation && (
              <MapLibreGL.PointAnnotation
                id={selectedMarkerId}
                coordinate={[
                  draggableMarkerLocation.longitude,
                  draggableMarkerLocation.latitude,
                ]}
                draggable
                onDragEnd={handleMarkerDragEnd}
              >
                <View className="items-center justify-center">
                  <MarkerSvg width={32} height={48} />
                </View>
              </MapLibreGL.PointAnnotation>
            )}

            {/* Zone markers */}
            {zones.map((zone) => {
              const isCritical = zone.type === 'DANGER' // You can add logic to check if zone has 10+ reports
              const markerColor =
                zone.type === 'SAFE'
                  ? '#4CAF50'
                  : isCritical
                  ? '#DC2626'
                  : '#F44336'

              return (
                <MapLibreGL.PointAnnotation
                  key={zone.id}
                  id={`zone-${zone.id}`}
                  coordinate={[
                    zone.coordinates.longitude,
                    zone.coordinates.latitude,
                  ]}
                >
                  <View
                    style={{
                      width: isCritical ? 24 : 20,
                      height: isCritical ? 24 : 20,
                      borderRadius: isCritical ? 12 : 10,
                      backgroundColor: markerColor,
                      borderWidth: 3,
                      borderColor: 'white',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
                  />
                </MapLibreGL.PointAnnotation>
              )
            })}
          </MapLibreGL.MapView>

          {/* Coordinates Display Card */}
          {displayCoords && (
            <View className="absolute top-12 left-4 right-4">
              <View className="bg-gray-800/95 rounded-xl p-4 shadow-lg border border-gray-700">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-gray-400 text-xs mb-1">
                      Coordenadas
                    </Text>
                    <Text className="text-white font-mono text-sm">
                      Lat: {displayCoords.latitude.toFixed(6)}
                    </Text>
                    <Text className="text-white font-mono text-sm">
                      Lng: {displayCoords.longitude.toFixed(6)}
                    </Text>
                  </View>
                  {selectedLocation && (
                    <View className="ml-4">
                      <Text className="text-gray-400 text-xs mb-1">Local</Text>
                      <Text
                        className="text-white text-xs"
                        numberOfLines={2}
                        style={{ maxWidth: 150 }}
                      >
                        {selectedLocation.name}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Center on user button */}
          {userLocation && (
            <TouchableOpacity
              onPress={handleCenterOnUser}
              className="absolute bottom-32 right-4 bg-gray-800/90 rounded-full p-3 shadow-lg border border-gray-700"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <Ionicons name="locate" size={24} color="#10B981" />
            </TouchableOpacity>
          )}

          {/* Bottom Action Bar */}
          <View className="absolute bottom-0 left-0 right-0 bg-gray-800/95 border-t border-gray-700">
            <View className="flex-row justify-between p-4 pb-8">
              <TouchableOpacity
                className="flex-1 bg-gray-700 mx-2 py-4 rounded-lg items-center"
                onPress={handleCancel}
              >
                <Text className="text-white font-bold">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 mx-2 py-4 rounded-lg items-center flex-row justify-center"
                style={[
                  {
                    backgroundColor: selectedLocation ? '#10B981' : '#6B7280',
                  },
                ]}
                onPress={handleMark}
                disabled={!selectedLocation}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white font-bold">Marcar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  )
}

import { useRouter } from 'expo-router'
import MarkerSvg from './marker.svg'
import * as MapLibreGL from '@maplibre/maplibre-react-native'
import { useRef, useState, useEffect, useId } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import type { Feature } from 'geojson'
import { Zone } from '@/@types/Zone'

type LocationState = {
  lat: number
  lng: number
  name: string
} | null

export default function MapComponent({
  variant,
  zones = [],
  isLoading = false,
}: {
  variant: 'safe' | 'danger'
  zones?: Zone[]
  isLoading?: boolean
}) {
  const userMarkerId = useId()
  const selectedMarkerId = useId()
  const mapRef = useRef(null)
  const cameraRef = useRef(null)
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState<LocationState>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  )

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude])
        },
        (error) => {
          console.log('Error getting location:', error)
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      )
    }
  }, [])

  const handleMapPress = (feature: Feature) => {
    setIsLoading(true)
    const { geometry } = feature

    if (geometry.type !== 'Point') return

    const [lng, lat] = geometry.coordinates

    // Fetch location name asynchronously com User-Agent header
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
        // Define localização mesmo com erro, usando coordenadas
        setSelectedLocation({
          lat,
          lng,
          name: `Local: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleCancel = () => {
    setSelectedLocation(null)
    router.back()
  }

  const handleMark = () => {
    if (!selectedLocation) return
    router.navigate({
      pathname: variant === 'safe' ? '/app/safeZone' : '/app/dangerousZone',
      params: {
        modalIsOpen: 'true',
        lat: selectedLocation.lat.toString(),
        lng: selectedLocation.lng.toString(),
        name: selectedLocation.name,
      },
    })
  }

  // Estilo com tiles de rua (OpenStreetMap)
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

  return (
    <View className="flex-1">
      <MapLibreGL.MapView
        ref={mapRef}
        style={{ flex: 1 }}
        mapStyle={mapStyleJSON}
        onPress={handleMapPress}
      >
        <MapLibreGL.Camera
          ref={cameraRef}
          zoomLevel={14}
          centerCoordinate={userLocation || [32.5892, -25.9653]}
          animationMode="flyTo"
          animationDuration={2000}
        />

        {userLocation && (
          <MapLibreGL.PointAnnotation
            id={userMarkerId}
            coordinate={userLocation}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: '#4285F4',
                borderWidth: 3,
                borderColor: 'white',
              }}
            />
          </MapLibreGL.PointAnnotation>
        )}

        {selectedLocation && (
          <MapLibreGL.PointAnnotation
            id={selectedMarkerId}
            coordinate={[selectedLocation.lng, selectedLocation.lat]}
          >
            <MarkerSvg width={24} height={36} />
          </MapLibreGL.PointAnnotation>
        )}

        {/* Render existing zones */}
        {zones.map((zone) => (
          <MapLibreGL.PointAnnotation
            key={zone.id}
            id={`zone-${zone.id}`}
            coordinate={[zone.coordinates.longitude, zone.coordinates.latitude]}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: zone.type === 'SAFE' ? '#4CAF50' : '#F44336',
                borderWidth: 2,
                borderColor: 'white',
              }}
            />
          </MapLibreGL.PointAnnotation>
        ))}
      </MapLibreGL.MapView>

      <View className="flex-row justify-between p-3 pb-12 bg-white">
        <TouchableOpacity
          className="flex-1 bg-app-primary mx-2 py-4 rounded-lg items-center"
          onPress={handleCancel}
        >
          <Text className="text-white font-bold">Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 mx-2 py-4 rounded-lg items-center flex-row justify-center"
          style={[
            {
              backgroundColor: selectedLocation ? '#4CAF50' : 'gray',
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
  )
}

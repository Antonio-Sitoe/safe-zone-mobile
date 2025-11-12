import { useEffect, useMemo, useState } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type TextStyle,
} from 'react-native'
import type { Coordinates } from '../store'

type ShowCoordinateBannerProps = {
  coordinates?: Coordinates | null
  locationName?: string | null
  buttonTextStyle?: StyleProp<TextStyle>
}

export const ShowCoordinateBanner = ({
  coordinates,
  locationName,
  buttonTextStyle,
}: ShowCoordinateBannerProps) => {
  const [isVisible, setIsVisible] = useState(false)

  const [longitude, latitude] = useMemo(() => {
    if (!coordinates) return [undefined, undefined]
    return [coordinates[0], coordinates[1]]
  }, [coordinates])

  const hasCoordinates =
    typeof latitude === 'number' &&
    Number.isFinite(latitude) &&
    typeof longitude === 'number' &&
    Number.isFinite(longitude)

  useEffect(() => {
    if (!hasCoordinates) {
      setIsVisible(false)
    }
  }, [hasCoordinates])

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          {
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 24,
            backgroundColor: 'rgba(0, 0, 0, 0.72)',
          },
        ]}
        onPress={() => setIsVisible((prev) => !prev)}
      >
        <Text style={buttonTextStyle}>
          {isVisible ? 'Ocultar coords' : 'Mostrar coords'}
        </Text>
      </TouchableOpacity>

      {isVisible && hasCoordinates ? (
        <View className="absolute top-12 left-4 right-4">
          <View className="bg-gray-800/90 rounded-2xl p-4 flex-row justify-between border border-gray-500/40 gap-4">
            <View className="flex-1">
              <Text className="text-gray-400 text-xs mb-1">Coordenadas</Text>
              <Text className="text-gray-100 text-sm font-mono">
                Lat: {latitude?.toFixed(6)}
              </Text>
              <Text className="text-gray-100 text-sm font-mono">
                Lng: {longitude?.toFixed(6)}
              </Text>
            </View>
            {locationName ? (
              <View className="flex-1">
                <Text className="text-gray-400 text-xs mb-1">Local</Text>
                <Text className="text-gray-100 text-xs" numberOfLines={2}>
                  {locationName}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      ) : null}
    </>
  )
}

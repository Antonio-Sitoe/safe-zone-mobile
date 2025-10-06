import MapComponent from '@/components/map'
import { useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'

export default function MapScreen() {
  const params = useLocalSearchParams()
  return (
    <View className="flex-1">
      <MapComponent variant={params.variant as 'safe' | 'danger'} />
    </View>
  )
}

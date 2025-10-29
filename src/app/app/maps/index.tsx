import MapComponent from '@/components/map'
import { useLocalSearchParams } from 'expo-router'
import { useGetAllZonesQuery } from '@/react-query/zone/zoneQuery'

export default function MapScreen() {
  const params = useLocalSearchParams()
  const { data: zonesData } = useGetAllZonesQuery()
  const allZones = zonesData?.data || []

  return (
    <MapComponent
      variant={params.variant as 'safe' | 'danger'}
      zones={allZones}
    />
  )
}

import MapComponent from '@/components/map'
import { useGetAllZonesQuery } from '@/react-query/zone/zoneQuery'

export default function MapScreen() {
  const { data: zonesData } = useGetAllZonesQuery()
  const allZones = zonesData?.data || []

  return <MapComponent variant={'danger'} zones={allZones} />
}

import { getAllZones } from '@/actions/zone'
import MapComponent from '@/components/map'
import { useQuery } from '@tanstack/react-query'

export default function MapScreen() {
  const { data: zonesData } = useQuery({
    queryKey: ['zones', 'all'],
    queryFn: () => getAllZones(),
  })
  const allZones = zonesData?.data || []
  console.log('[all zones from query]', allZones)

  return <MapComponent zones={[]} />
}

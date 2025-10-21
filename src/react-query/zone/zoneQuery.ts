import { getAllZones, getZonesByType } from '@/actions/zone'
import { useQuery } from '@tanstack/react-query'

export const useGetAllZonesQuery = () => {
  return useQuery({
    queryKey: ['zones', 'all'],
    queryFn: () => getAllZones(),
    refetchOnWindowFocus: false,
  })
}

export const useGetZonesByTypeQuery = (type: 'SAFE' | 'DANGER') => {
  return useQuery({
    queryKey: ['zones', 'type', type],
    queryFn: () => getZonesByType(type),
  })
}

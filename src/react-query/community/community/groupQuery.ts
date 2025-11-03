import { useQuery } from '@tanstack/react-query'
import { getGroups, getGroupsByUser } from '@/actions/community'

export const useGetGroupsQuery = (userId: string) => {
  return useQuery({
    queryKey: ['groups', userId],
    queryFn: () => getGroups(userId),
    refetchOnWindowFocus: false,
  })
}
export const useGetGroupsDataQuery = (userId: string) => {
  return useQuery({
    queryKey: ['groups-data', userId],
    queryFn: () => getGroupsByUser(userId),
    refetchOnWindowFocus: false,
  })
}

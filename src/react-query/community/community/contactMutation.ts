import { CreateContact } from '@/actions/contact'
import { deleteContact } from '@/actions/community'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateContactMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      groupId,
      name,
      phone,
    }: {
      groupId: string
      name: string
      phone: string
    }) => {
      const payload = {
        name,
        phone,
      }
      return CreateContact(payload, groupId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      queryClient.invalidateQueries({ queryKey: ['groups-data'] })
      queryClient.invalidateQueries({ queryKey: ['all-contacts'] })
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      queryClient.invalidateQueries({ queryKey: ['group'] })
    },
    onError: (error) => {
      console.error('Error creating contact:', error)
    },
  })
}

export const useDeleteContactMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ contactId }: { contactId: string }) => {
      return deleteContact(contactId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      queryClient.invalidateQueries({ queryKey: ['groups-data'] })
      queryClient.invalidateQueries({ queryKey: ['all-contacts'] })
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      queryClient.invalidateQueries({ queryKey: ['group'] })
    },
    onError: (error) => {
      console.error('Error deleting contact:', error)
    },
  })
}

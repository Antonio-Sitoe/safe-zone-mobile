import { CreateContact } from '@/actions/contact'
import { useMutation } from '@tanstack/react-query'

export const useCreateContactMutation = () => {
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
  })
}

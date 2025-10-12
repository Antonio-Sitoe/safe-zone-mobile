import { Contact } from '@/@types/Contact'
import {
  createGroup,
  deleteGroup,
  getGroupById,
  updateGroup,
} from '@/actions/community'
import { useMutation } from '@tanstack/react-query'

export const useCreateGroupMutation = () => {
  return useMutation({
    mutationFn: ({
      userId,
      name,
      members,
    }: {
      userId: string
      name: string
      members: Contact[]
    }) => {
      const payload = {
        name,
        contacts: members.map((m) => ({ name: m.name, phone: m.phone })),
      }
      return createGroup(userId, payload)
    },
  })
}
export const useUpdateGroupMutation = () => {
  return useMutation({
    mutationFn: ({
      groupId,
      name,
      members,
    }: {
      groupId: string
      name: string
      members: Contact[]
    }) => {
      const payload = {
        name,
        contacts: members.map((m) => ({ name: m.name, phone: m.phone })),
      }
      return updateGroup(payload, groupId)
    },
  })
}
export const useDeleteGroupMutation = () => {
  return useMutation({
    mutationFn: ({ groupId }: { groupId: string }) => {
      return deleteGroup(groupId)
    },
  })
}
export const useGetGroupsMutation = () => {
  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => {
      return getGroupById(userId)
    },
  })
}

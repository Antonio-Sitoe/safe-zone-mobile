import { Contact } from '@/@types/Contact'
import { api } from '@/lib/axios'

export const CreateContact = async (data: Contact, groupId: string) => {
  try {
    const response = api.post(`/groups/contact/${groupId}`, data)

    return { data: response, error: false }
  } catch (error: any) {
    return { message: error.request.message, error: true }
  }
}
export const deleteContact = async (id: string) => {
  try {
    const response = api.delete(`/group/contact/${id}`)

    return { data: response, error: false }
  } catch (error: any) {
    return { message: error.request.message, error: true }
  }
}

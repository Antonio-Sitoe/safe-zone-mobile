export interface AddContactModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: (name: string, phone: string, groupId: string) => Promise<void>
  data: any
}
export interface Contact {
  name: string
  phone: string
}

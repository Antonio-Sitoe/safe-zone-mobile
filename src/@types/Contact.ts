export interface AddContactModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: (name: string, phone: string, category: string) => Promise<void>
}

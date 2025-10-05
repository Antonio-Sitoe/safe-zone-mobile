export interface CreateModalProps {
  visible: boolean
  onClose: () => void
  onSave: (data: SafeZoneData) => void
  variant: 'safe' | 'danger'
  location: any
}

export interface SafeZoneData {
  location: string
  date: string
  time: string
  description: string
  characteristics: {
    goodLighting: boolean
    policePresence: boolean
    publicTransport: boolean
  }
  media: { uri: string; name: string; type: string }[]
}

export interface SuccessModalProps {
  visible: boolean
  onClose: () => void
  title?: string
  message?: string
}

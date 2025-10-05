export interface SafeLocation {
  name: string
  safetyLevel: number
}

export interface SafeZoneHeaderProps {
  onBackPress?: () => void
  onMenuPress?: () => void
  title: string
}

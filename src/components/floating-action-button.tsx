import { TouchableOpacity } from 'react-native'
import { Plus } from 'lucide-react-native'

interface FloatingActionButtonProps {
  onPress?: () => void
}

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute bottom-24 right-6 bg-app-primary w-14 h-14 rounded-full items-center justify-center shadow-lg elevation-8"
      activeOpacity={0.8}
    >
      <Plus size={28} color="white" strokeWidth={2.5} />
    </TouchableOpacity>
  )
}

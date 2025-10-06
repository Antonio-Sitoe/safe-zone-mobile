import { View, TouchableOpacity } from 'react-native'
import { Menu } from 'lucide-react-native'
import BackgroundLogoSvgBlue from '@/assets/logo-blue.svg'

export function Header() {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white shadow-sm">
      <View className="flex-row items-center">
        <BackgroundLogoSvgBlue width={160} height={48} />
      </View>

      <TouchableOpacity className="p-2">
        <Menu size={24} color="#1e293b" />
      </TouchableOpacity>
    </View>
  )
}

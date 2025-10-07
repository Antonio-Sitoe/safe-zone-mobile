import { TouchableOpacity, Text, View } from 'react-native'
import { SafetyCardProps } from '@/@types/SafetyCard'

export function SafetyCard({ title, icon: Icon, onPress }: SafetyCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-app-primary rounded-xl px-4 py-3 flex-1 min-h-[140px] justify-between m-1"
      activeOpacity={0.7}
    >
      <View className="items-end  flex-1">
        <Icon size={32} color="white" strokeWidth={1.5} />
      </View>

      <Text className="text-white font-medium text-base  mt-4">{title}</Text>
    </TouchableOpacity>
  )
}

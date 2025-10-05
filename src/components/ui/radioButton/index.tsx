import { View, Text, Pressable } from 'react-native'

interface RadioButtonProps {
  label: string
  selected: boolean
  onPress: () => void
}

export const RadioButton = ({ label, selected, onPress }: RadioButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center py-3 active:opacity-70"
    >
      <View className="w-5 h-5 rounded-full border-2 border-gray-400 items-center justify-center mr-3">
        {selected && <View className="w-3 h-3 rounded-full bg-primary" />}
      </View>
      <Text className="text-base text-gray-900">{label}</Text>
    </Pressable>
  )
}

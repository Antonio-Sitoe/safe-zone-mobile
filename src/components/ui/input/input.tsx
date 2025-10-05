import { View, Text, TextInput, TextInputProps } from 'react-native'

interface InputProps extends TextInputProps {
  label: string
}

export const InputSecondary = ({ label, ...props }: InputProps) => {
  return (
    <View className="mb-4">
      <Text className="text-base font-medium text-gray-900 mb-2">{label}</Text>
      <TextInput
        {...props}
        className="border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
        placeholderTextColor="#9CA3AF"
      />
    </View>
  )
}

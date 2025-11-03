import { View, Text, Modal } from 'react-native'
import { Check } from 'lucide-react-native'
import { Button } from '../ui/button'
import type { SuccessModalProps } from '@/@types/area'

export const SuccessModal = ({
  visible,
  onClose,
  title = 'Contato Adicionado Com Sucesso.',
  message = 'O Novo Contato Foi Incluído Em Sua Lista Com Êxito',
}: SuccessModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <View className="bg-white rounded-3xl p-8 w-full max-w-sm items-center">
          <View className="w-20 h-20 rounded-full bg-green-500 items-center justify-center mb-6">
            <Check size={40} color="#FFFFFF" strokeWidth={3} />
          </View>

          <Text className="text-xl font-bold text-gray-900 text-center mb-2">
            {title}
          </Text>

          <Text className="text-base text-gray-600 text-center mb-6">
            {message}
          </Text>

          <View className="w-full">
            <Button size="lg" onPress={onClose}>
              <Text className="text-white font-semibold">Fechar</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}

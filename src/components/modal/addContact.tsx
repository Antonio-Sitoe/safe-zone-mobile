import { useState } from 'react'
import {
  View,
  Text,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { InputSecondary } from '../ui/input/input'
import { RadioButton } from '../ui/radioButton'
import { ButtonSecondary } from '../ui/button/button'
import { AddContactModalProps } from '@/@types/Contact'

export const AddContactModal = ({
  visible,
  onClose,
  onSubmit,
  data,
}: AddContactModalProps) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<string>('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit(name.trim(), phone.trim(), selectedGroup)
      setName('')
      setPhone('')
      setSelectedGroup('Família')
      onClose()
    } catch (error) {
      console.error('Error adding contact:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setName('')
    setPhone('')
    setSelectedGroup('Família')
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View className="bg-white rounded-t-3xl pt-6 pb-8 px-6">
            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />

            <Text className="text-2xl font-bold text-gray-900 text-center mb-6">
              Adicionar Contacto
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <InputSecondary
                label="Nome"
                placeholder="Introduza O Nome"
                value={name}
                onChangeText={setName}
              />

              <InputSecondary
                label="Número De Celular"
                placeholder="+258"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              <Text className="text-base font-medium text-gray-900 mb-2">
                Tipo De Contacto
              </Text>
              {data?.data.map((group: any) => (
                <RadioButton
                  key={group.id}
                  label={group.name}
                  selected={selectedGroup === group.id}
                  onPress={() => setSelectedGroup(group.id)}
                />
              ))}

              <View className="mt-6 space-y-3">
                <ButtonSecondary
                  variant="secondary"
                  onPress={handleSubmit}
                  disabled={!name.trim() || !phone.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Adicionando...' : 'Adicionar'}
                </ButtonSecondary>

                <ButtonSecondary onPress={handleClose} variant="secondary">
                  Cancelar
                </ButtonSecondary>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  )
}

import { useEffect, useState } from 'react'
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { InputSecondary } from '../ui/input/input'
import { Button } from '../ui/button'
import type { CreateGroupModalProps } from '@/@types/Group'
import type { Contact } from '@/@types/Contact'
import { UserPlus2, X } from 'lucide-react-native'
import { ContactPickerModal } from '../contacts'
import * as Contacts from 'expo-contacts'

type ManualContact = Contact & { id: string }

export const CreateGroupModal = ({
  visible,
  onClose,
  onSubmit,
  groupId,
  initialData,
  mode = 'create',
}: CreateGroupModalProps) => {
  const [groupName, setGroupName] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<ManualContact[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactModalVisible, setContactModalVisible] = useState(false)
  const [allContacts, setAllContacts] = useState<Contacts.Contact[]>([])

  useEffect(() => {
    const loadContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync()
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        })
        setAllContacts(data)
      }
    }
    loadContacts()
  }, [])

  useEffect(() => {
    if (visible && mode === 'edit' && initialData) {
      setGroupName(initialData.name)
      setSelectedMembers(
        initialData.members.map((m) => ({
          id: m.id ?? Date.now().toString(),
          name: m.name,
          phone: m.phone,
          isManual: !m.id,
        }))
      )
    } else if (visible && mode === 'create') {
      setGroupName('')
      setSelectedMembers([])
      setPhoneInput('')
      setNameInput('')
    }
  }, [visible, mode, initialData])

  const handleAddMember = () => {
    if (!nameInput.trim() || !phoneInput.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha o nome e o número.')
      return
    }

    const alreadyExists = selectedMembers.some(
      (m) => m.phone === phoneInput.trim()
    )
    if (alreadyExists) {
      Alert.alert('Atenção', 'Este número já foi adicionado.')
      return
    }

    const newMember: ManualContact = {
      id: Date.now().toString(),
      name: nameInput.trim(),
      phone: phoneInput.trim(),
      isManual: true,
    }

    setSelectedMembers((prev) => [...prev, newMember])
    setNameInput('')
    setPhoneInput('')
  }

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== memberId))
  }

  const handleContactsSelected = (contactIds: string[]) => {
    const selected = allContacts
      .filter((c: any) => contactIds.includes(c.id))
      .map((c: any) => ({
        id: c.id,
        name: c.name ?? 'Sem nome',
        phone: c.phoneNumbers?.[0]?.number ?? 'Sem número',
        isManual: true,
      }))

    setSelectedMembers((prev) => {
      const all = [...prev]
      selected.forEach((c) => {
        if (!all.some((m) => m.id === c.id)) {
          all.push(c)
        }
      })
      return all
    })
  }

  const handleSubmit = async () => {
    if (!groupName.trim()) {
      Alert.alert('Erro', 'Introduza o nome do grupo.')
      return
    }

    if (selectedMembers.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um participante.')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(groupName.trim(), selectedMembers)
      setGroupName('')
      setSelectedMembers([])
      onClose()
    } catch {
      Alert.alert('Erro', 'Ocorreu um problema ao criar o grupo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setGroupName('')
    setPhoneInput('')
    setNameInput('')
    setSelectedMembers([])
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="bg-white rounded-t-3xl max-h-[90%]">
              <View className="w-12 h-1 bg-gray-300 rounded-full self-center mt-3 mb-6" />

              <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={20}
                keyboardOpeningTime={0}
                contentContainerStyle={{
                  paddingHorizontal: 24,
                  paddingTop: 6,
                  paddingBottom: 32,
                }}
              >
                <Text className="text-2xl font-bold text-gray-900 text-center mb-6 font-montserrat-bold">
                  {mode === 'edit' ? 'Editar Grupo' : 'Criar Grupo'}
                </Text>

                <InputSecondary
                  label="Nome do Grupo"
                  placeholder="Introduza o nome"
                  value={groupName}
                  onChangeText={setGroupName}
                />

                <Text className="text-base font-medium text-gray-900 mb-2 mt-4 font-body">
                  Adicionar Participantes
                </Text>

                <View className="flex-row space-x-2 gap-4 mb-4 items-center">
                  <TextInput
                    placeholder="Nome"
                    value={nameInput}
                    onChangeText={setNameInput}
                    className="border-2 border-gray-200 rounded-xl px-4 py-3 text-base flex-1"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TextInput
                    placeholder="Número"
                    value={phoneInput}
                    onChangeText={setPhoneInput}
                    keyboardType="phone-pad"
                    className="border-2 border-gray-200 rounded-xl px-4 py-3 text-base flex-1"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View className="flex-row justify-between mb-4">
                  <Pressable
                    onPress={() => setContactModalVisible(true)}
                    className="bg-gray-100 rounded-xl px-4 py-3 flex-row items-center space-x-2 active:opacity-70"
                  >
                    <UserPlus2 size={22} color="#2563EB" />
                    <Text className="text-blue-700 font-medium font-body">
                      Escolher Contactos
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleAddMember}
                    className="bg-app-primary rounded-xl px-5 py-3 active:opacity-80"
                  >
                    <Text className="text-white font-semibold font-body">
                      Adicionar
                    </Text>
                  </Pressable>
                </View>

                {selectedMembers.length > 0 && (
                  <>
                    <Text className="text-base font-medium text-gray-900 mb-2 font-body">
                      Participantes adicionados
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className="mb-4 flex-row space-x-2"
                    >
                      {selectedMembers.map((member) => (
                        <View
                          key={member.id}
                          className="flex-row items-center bg-blue-100 rounded-full px-4 py-2"
                        >
                          <Text className="text-blue-800 mr-2">
                            {member.name} ({member.phone})
                          </Text>
                          <Pressable
                            onPress={() => handleRemoveMember(member.id)}
                          >
                            <X size={18} color="#DC2626" />
                          </Pressable>
                        </View>
                      ))}
                    </ScrollView>
                  </>
                )}

                <View className="mb-6 flex-row justify-between gap-3 space-y-3">
                  <Button
                    variant="default"
                    size="lg"
                    className="flex-1"
                    onPress={handleSubmit}
                    disabled={!groupName.trim() || isSubmitting}
                  >
                    <Text className="text-white font-semibold font-body">
                      {isSubmitting
                        ? mode === 'edit'
                          ? 'Salvando...'
                          : 'Criando...'
                        : mode === 'edit'
                        ? 'Guardar'
                        : 'Criar Grupo'}
                    </Text>
                  </Button>

                  <Button
                    variant="gray"
                    size="lg"
                    onPress={handleClose}
                    className="flex-1"
                  >
                    <Text className="text-gray-900 font-semibold">Fechar</Text>
                  </Button>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      <ContactPickerModal
        visible={contactModalVisible}
        onClose={() => setContactModalVisible(false)}
        onSelectContacts={handleContactsSelected}
        initialSelectedContacts={selectedMembers.map((m) => m.id)}
        availableContacts={allContacts}
      />
    </Modal>
  )
}

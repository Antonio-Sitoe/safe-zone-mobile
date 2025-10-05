import { useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import { ChevronLeft, UserPlus, Users } from 'lucide-react-native'
import { CategoryCard } from '@/components/categoryCard'
import { ButtonSecondary } from '@/components/ui/button/button'
import { AddContactModal } from '@/components/modal/addContact'
import { CreateGroupModal } from '@/components/modal/addGroup'
import { SuccessModal } from '@/components/modal/notification'
import { SecondaryHeader } from '@/components/secondary-header'
import { useRouter } from 'expo-router'

export default function SupportCommunityScreen() {
  const router = useRouter()
  const [showAddContactModal, setShowAddContactModal] = useState(false)
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState({
    title: '',
    message: '',
  })

  const familyCount = 3
  const friendCount = 3
  const workCount = 3
  const groupCount = 3

  const hasGroups = groupCount > 0

  const handleAddContact = async (
    name: string,
    phone: string,
    category: string
  ) => {
    try {
      setSuccessMessage({
        title: 'Contato Adicionado Com Sucesso.',
        message: 'O Novo Contato Foi Incluído Em Sua Lista Com Êxito',
      })
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Failed to add contact:', error)
    }
  }

  const handleCreateGroup = async (name: string, memberIds: string[]) => {
    try {
      setSuccessMessage({
        title: 'Grupo Criado Com Sucesso.',
        message: 'O Novo Grupo Foi Criado Em Sua Lista Com Êxito',
      })
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Failed to create group:', error)
    }
  }

  // if (loading) {
  //   return (
  //     <View className="flex-1 bg-gray-50 items-center justify-center">
  //       <ActivityIndicator size="large" color="#2B4170" />
  //     </View>
  //   );
  // }

  // if (error) {
  //   return (
  //     <View className="flex-1 bg-gray-50 items-center justify-center px-6">
  //       <Text className="text-red-500 text-center">{error}</Text>
  //     </View>
  //   );
  // }

  return (
    <View className="flex-1 pt-6 bg-gray-50">
      <View className="flex-1">
        <View>
          <SecondaryHeader
            title="Comunidade"
            onBackPress={() => router.back()}
            onMenuPress={() => {}}
          />
        </View>

        <ScrollView className="flex-1 px-6 pt-6">
          <CategoryCard name="Família" count={familyCount} />

          <CategoryCard name="Amigo" count={friendCount} />

          <CategoryCard name="Trabalho" count={workCount} />

          <CategoryCard name="Grupo" count={groupCount} />
        </ScrollView>

        <View className="px-6 pb-6 space-y-3">
          {false ? (
            <View className="py-8">
              <Text className="text-center text-gray-500 text-base">
                Sem grupo
              </Text>
            </View>
          ) : (
            <ButtonSecondary
              variant="secondary"
              onPress={() => setShowAddContactModal(true)}
              icon={<UserPlus size={20} color="#FFFFFF" />}
            >
              Adicionar contacto
            </ButtonSecondary>
          )}

          <ButtonSecondary
            variant="secondary"
            onPress={() => setShowCreateGroupModal(true)}
            icon={<Users size={20} color="#FFFFFF" />}
          >
            Criar grupo
          </ButtonSecondary>
        </View>
      </View>

      <AddContactModal
        visible={showAddContactModal}
        onClose={() => setShowAddContactModal(false)}
        onSubmit={handleAddContact}
      />

      <CreateGroupModal
        visible={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        onSubmit={handleCreateGroup}
        availableContacts={null}
      />

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successMessage.title}
        message={successMessage.message}
      />
    </View>
  )
}

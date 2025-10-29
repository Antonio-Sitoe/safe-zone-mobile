import { useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { UserPlus, Users } from 'lucide-react-native'
import { CategoryCard } from '@/components/categoryCard'
import { ButtonSecondary } from '@/components/ui/button/button'
import { AddContactModal } from '@/components/modal/addContact'
import { CreateGroupModal } from '@/components/modal/addGroup'
import { SuccessModal } from '@/components/modal/notification'
import { SecondaryHeader } from '@/components/secondary-header'
import { useRouter } from 'expo-router'
import { useCreateGroupMutation } from '@/react-query/community/community/groupMutations'
import type { Contact } from '@/@types/Contact'
import {
  useGetGroupsDataQuery,
  useGetGroupsQuery,
} from '@/react-query/community/community/groupQuery'
import { useCreateContactMutation } from '@/react-query/community/community/contactMutation'

export default function SupportCommunityScreen() {
  const router = useRouter()
  const [showAddContactModal, setShowAddContactModal] = useState(false)
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState({
    title: '',
    message: '',
  })

  const userId = '507cf8bc-b637-4a8f-a8d1-38d58244f0c5'
  const { data: groupsData, isLoading: groupsLoading } =
    useGetGroupsQuery(userId)
  const { data: groups } = useGetGroupsDataQuery(userId)

  const createGroupMutation = useCreateGroupMutation()
  const createContactMutation = useCreateContactMutation()

  const handleAddContact = async (
    name: string,
    phone: string,
    groupId: string
  ) => {
    createContactMutation.mutate(
      {
        groupId,
        name,
        phone,
      },
      {
        onSuccess: () => {
          setSuccessMessage({
            title: 'Contato Adicionado Com Sucesso.',
            message: 'O Novo Contato Foi Incluído Em Sua Lista Com Êxito',
          })
          setShowSuccessModal(true)
        },
        onError: (error: any) => {
          setSuccessMessage({
            title: 'Erro',
            message: error?.message || 'Erro ao conatcto grupo',
          })
          setShowSuccessModal(true)
        },
      }
    )
  }

  const handleCreateGroup = (name: string, members: Contact[]) => {
    createGroupMutation.mutate(
      { userId, name, members },
      {
        onSuccess: () => {
          setSuccessMessage({
            title: 'Grupo Criado!',
            message: 'O novo grupo foi criado com sucesso.',
          })
          setShowSuccessModal(true)
        },
        onError: (error: any) => {
          setSuccessMessage({
            title: 'Erro',
            message: error?.message || 'Erro ao criar grupo',
          })
          setShowSuccessModal(true)
        },
      }
    )
  }

  return (
    <View className="flex-1 pt-6 pb-5 bg-gray-50">
      <SecondaryHeader
        title="Comunidade"
        onBackPress={() => router.back()}
        onMenuPress={() => {}}
      />

      <ScrollView className="flex-1 px-6 pt-6">
        {groupsLoading ? (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" color="#2B4170" />
          </View>
        ) : groupsData?.data.length === 0 ? (
          <Text className="text-center text-gray-500 text-base">
            Sem grupos
          </Text>
        ) : (
          groupsData?.data.map((group: any) => (
            <CategoryCard
              key={group.id}
              name={group.name}
              count={group.contactsTotal}
            />
          ))
        )}
      </ScrollView>

      <View className="px-6 pb-6 space-y-3">
        <ButtonSecondary
          variant="secondary"
          onPress={() => setShowAddContactModal(true)}
          icon={<UserPlus size={20} color="#FFFFFF" />}
        >
          Adicionar contacto
        </ButtonSecondary>

        <ButtonSecondary
          variant="secondary"
          onPress={() => setShowCreateGroupModal(true)}
          icon={<Users size={20} color="#FFFFFF" />}
        >
          Criar grupo
        </ButtonSecondary>
      </View>

      <AddContactModal
        visible={showAddContactModal}
        onClose={() => setShowAddContactModal(false)}
        data={groups}
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

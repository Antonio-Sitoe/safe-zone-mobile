import { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { CategoryCard } from '@/components/categoryCard'
import { useGetGroupsQuery } from '@/react-query/community/community/groupQuery'
import { useAuthStore } from '@/contexts/auth-store'
import { useRouter } from 'expo-router'
import {
  useCreateGroupMutation,
  useUpdateGroupMutation,
} from '@/react-query/community/community/groupMutations'
import type { Contact } from '@/@types/Contact'
import { getGroupWithContacts } from '@/actions/community'
import { CreateGroupModal } from '@/components/modal/addGroup'
import { SuccessModal } from '@/components/modal/notification'
import { Plus } from 'lucide-react-native'

export const GroupsTab = () => {
  const router = useRouter()
  const { user } = useAuthStore()
  const userId = user?.id || ''

  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [editingGroup, setEditingGroup] = useState<{
    id: string
    name: string
    members: Contact[]
  } | null>(null)
  const [successMessage, setSuccessMessage] = useState({
    title: '',
    message: '',
  })

  const { data: groupsData, isLoading: groupsLoading } =
    useGetGroupsQuery(userId)
  const createGroupMutation = useCreateGroupMutation()
  const updateGroupMutation = useUpdateGroupMutation()

  const handleGroupPress = (groupId: string) => {
    router.push({
      pathname: '/app/home/community/[groupId]',
      params: { groupId },
    })
  }

  const handleEditGroup = async (groupId: string) => {
    try {
      const result = await getGroupWithContacts(groupId)
      if (result.data?.data) {
        const groupData = result.data.data
        setEditingGroup({
          id: groupId,
          name: groupData.name,
          members:
            groupData.contacts?.map((c: any) => ({
              id: c.id,
              name: c.name,
              phone: c.phone,
            })) || [],
        })
        setShowCreateGroupModal(true)
      }
    } catch (error) {
      console.error('Error loading group for edit:', error)
    }
  }

  const handleCreateGroup = (name: string, members: Contact[]) => {
    createGroupMutation.mutate(
      { userId, name, members },
      {
        onSuccess: () => {
          setSuccessMessage({
            title: 'Grupo Criado Com Sucesso.',
            message: 'O Novo Grupo Foi Incluído Em Sua Lista Com Éxito',
          })
          setShowSuccessModal(true)
          setShowCreateGroupModal(false)
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

  const handleUpdateGroup = (name: string, members: Contact[]) => {
    if (!editingGroup) return

    updateGroupMutation.mutate(
      { groupId: editingGroup.id, name, members },
      {
        onSuccess: () => {
          setSuccessMessage({
            title: 'Grupo Atualizado Com Sucesso.',
            message: 'O Grupo Foi Atualizado Em Sua Lista Com Éxito',
          })
          setShowSuccessModal(true)
          setShowCreateGroupModal(false)
          setEditingGroup(null)
        },
        onError: (error: any) => {
          setSuccessMessage({
            title: 'Erro',
            message: error?.message || 'Erro ao atualizar grupo',
          })
          setShowSuccessModal(true)
        },
      }
    )
  }

  const handleCloseModal = () => {
    setShowCreateGroupModal(false)
    setEditingGroup(null)
  }

  if (groupsLoading) {
    return (
      <View className="flex-1 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#2B4170" />
      </View>
    )
  }

  return (
    <View className="flex-1">
      {groupsData?.data.length === 0 ? (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-center text-gray-500 text-base font-body">
            Sem grupos
          </Text>
        </View>
      ) : (
        <ScrollView
          className="px-6 pt-6"
          contentContainerStyle={{
            gap: 16,
            paddingBottom: 100, // Espaço extra para o botão flutuante
          }}
          showsVerticalScrollIndicator={false}
        >
          {groupsData?.data.map((group: any) => (
            <CategoryCard
              key={group.id}
              name={group.name}
              count={Number(group.contactsTotal) || 0}
              onPress={() => handleGroupPress(group.id)}
              onEdit={() => handleEditGroup(group.id)}
            />
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={() => {
          setEditingGroup(null)
          setShowCreateGroupModal(true)
        }}
        className="absolute bottom-6 right-6 w-20 h-20 bg-app-primary rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <CreateGroupModal
        visible={showCreateGroupModal}
        onClose={handleCloseModal}
        onSubmit={editingGroup ? handleUpdateGroup : handleCreateGroup}
        availableContacts={null}
        groupId={editingGroup?.id}
        initialData={
          editingGroup
            ? {
                name: editingGroup.name,
                members: editingGroup.members,
              }
            : undefined
        }
        mode={editingGroup ? 'edit' : 'create'}
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

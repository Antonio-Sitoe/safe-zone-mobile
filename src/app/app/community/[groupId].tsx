import { getContactsByGroupId, getGroupWithContacts } from '@/actions/community'
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router'
import { SecondaryHeader } from '@/components/secondary-header'
import { Phone, User, Trash2 } from 'lucide-react-native'
import { useQuery } from '@tanstack/react-query'
import { useDeleteContactMutation } from '@/react-query/community/community/contactMutation'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function GroupContactsScreen() {
  const router = useRouter()
  const { isFocused } = useNavigation()
  const params = useLocalSearchParams<{ groupId: string }>()
  const groupId = params.groupId || ''

  const { data: groupData, isLoading: groupLoading } = useQuery({
    queryKey: ['group', groupId, isFocused],
    queryFn: () => getGroupWithContacts(groupId),
  })

  const { data: contactsData, isLoading: contactsLoading } = useQuery({
    queryKey: ['contacts', groupId, isFocused],
    queryFn: () => getContactsByGroupId(groupId),
  })

  const deleteContactMutation = useDeleteContactMutation()

  const group = groupData?.data?.data
  const contacts = contactsData?.data?.data || []

  const handleDeleteContact = (contactId: string, contactName: string) => {
    Alert.alert(
      'Remover Contato',
      `Tem certeza que deseja remover ${contactName}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            deleteContactMutation.mutate(
              { contactId },
              {
                onSuccess: () => {
                  // Query será invalidada automaticamente pela mutation
                },
                onError: (error: any) => {
                  Alert.alert(
                    'Erro',
                    error?.message || 'Erro ao remover contato'
                  )
                },
              }
            )
          },
        },
      ]
    )
  }

  if (groupLoading || contactsLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 pt-6 pb-5">
          <SecondaryHeader
            title={group?.name || 'Grupo'}
            onBackPress={() => router.back()}
          />
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" color="#2B4170" />
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 pt-6 pb-5">
        <SecondaryHeader
          title={group?.name || 'Grupo'}
          onBackPress={() => router.back()}
        />

        <View className="px-6 pt-4 pb-2">
          <Text className="text-sm text-gray-600 mb-2 font-body">
            {contacts.length} {contacts.length === 1 ? 'Contato' : 'Contatos'}
          </Text>
        </View>

        <ScrollView className="flex-1 px-6">
          {contacts.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <User size={48} color="#9CA3AF" />
              <Text className="text-gray-500 text-base mt-4 text-center font-body">
                Nenhum contato neste grupo
              </Text>
            </View>
          ) : (
            <View className="space-y-3 gap-4">
              {contacts.map((contact: any) => (
                <View
                  key={contact.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row items-center"
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-4">
                      <User size={24} color="#2B4170" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900 mb-1 font-body">
                        {contact.name}
                      </Text>
                      <View className="flex-row items-center">
                        <Phone size={14} color="#6B7280" />
                        <Text className="text-sm text-gray-600 ml-2 font-body">
                          {contact.phone}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteContact(contact.id, contact.name)}
                    className="ml-3 p-2 bg-red-50 rounded-lg active:opacity-70"
                  >
                    <Trash2 size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

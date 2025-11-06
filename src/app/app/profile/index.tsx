import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import {
  User,
  MapPin,
  Tag,
  Users,
  MessageSquare,
  LogOut,
  Edit2,
  Trash2,
} from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '@/contexts/auth-store'
import { deactivateAccount } from '@/actions/auth'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { router } from 'expo-router'

const MenuItem = ({
  icon,
  text,
  onPress,
  touchableOpacityClassName,
  textClassName,
}: {
  onPress?: () => void
  icon: React.ReactNode
  text: string
  touchableOpacityClassName?: string
  textClassName?: string
}) => (
  <TouchableOpacity
    onPress={() => onPress?.()}
    className={`flex-row items-center gap-4 px-3 ${
      touchableOpacityClassName || ''
    }`}
  >
    <View className="w-6 h-6 items-center justify-center">{icon}</View>
    <Text className={`text-black text-base font-roboto ${textClassName || ''}`}>
      {text}
    </Text>
  </TouchableOpacity>
)

export default function ProfileScreen() {
  const { logout, user } = useAuthStore()

  const deactivateAccountMutation = useMutation({
    mutationFn: () => deactivateAccount(),
    onSuccess: () => {
      Alert.alert(
        'Conta Desativada',
        'Sua conta foi desativada com sucesso. Você será desconectado.',
        [
          {
            text: 'OK',
            onPress: () => {
              logout()
            },
          },
        ]
      )
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || 'Erro ao desativar conta'
          : 'Erro ao desativar conta'
      Alert.alert('Erro', message)
    },
  })

  const handleDeactivateAccount = () => {
    Alert.alert(
      'Desativar Conta',
      'Tem certeza que deseja desativar sua conta? Esta ação não pode ser desfeita e você precisará entrar em contato com o suporte para reativar sua conta.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Desativar',
          style: 'destructive',
          onPress: () => {
            deactivateAccountMutation.mutate()
          },
        },
      ]
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="pb-10">
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <View style={{ width: 32 }} />
          <Text className="text-lg font-semibold text-black">Perfil</Text>
          <TouchableOpacity
            onPress={() => router.push('/app/profile/edit')}
            className="p-2 rounded-full bg-blue-50"
          >
            <Edit2 size={20} color="#1D2C5E" />
          </TouchableOpacity>
        </View>

        <View className="items-center mt-6">
          <View className="w-24 h-24 rounded-full bg-[#1D2C5E] items-center justify-center">
            <User size={50} color="white" />
          </View>
          <Text className="mt-3 text-base font-medium font-roboto text-black">
            {user?.name || 'Não informado'}
          </Text>
          <Text className="mt-1 text-sm text-gray-600">
            {user?.email || 'Não informado'}
          </Text>
        </View>

        <View className="mt-8 flex-1 space-y-8 flex-col gap-8 px-6">
          <MenuItem
            icon={<User size={22} color="#1D2C5E" />}
            text="Editar Perfil"
            onPress={() => router.push('/app/profile/edit')}
          />
          <MenuItem
            icon={<MapPin size={22} color="#1D2C5E" />}
            text="Configurações De Alerta"
          />
          <MenuItem
            icon={<Tag size={22} color="#1D2C5E" />}
            text="Dicas De Segurança"
          />
          <MenuItem
            icon={<Users size={22} color="#1D2C5E" />}
            text="Contatos De Segurança"
          />
          <MenuItem
            icon={<MessageSquare size={22} color="#1D2C5E" />}
            text="Sobre Nos"
          />
          <MenuItem
            onPress={handleDeactivateAccount}
            touchableOpacityClassName="bg-[#fefefe] rounded-lg"
            textClassName="text-orange-600"
            icon={<Trash2 size={22} color="#EA580C" />}
            text="Desativar Conta"
          />
          <MenuItem
            onPress={logout}
            touchableOpacityClassName="bg-[#fefefe] rounded-lg"
            textClassName="text-red-500"
            icon={<LogOut size={22} color="red" />}
            text="Sair"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

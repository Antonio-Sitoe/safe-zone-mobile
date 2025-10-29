import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import {
  User,
  MapPin,
  Tag,
  Users,
  MessageSquare,
  LogOut,
} from 'lucide-react-native'
import { authClient } from '@/lib/auth'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '@/contexts/auth-store'

const { useSession } = authClient

export default function ProfileScreen() {
  const session = useSession()
  const { logout } = useAuthStore()

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="flex-row items-center justify-center py-4 border-b border-gray-200 relative">
          <Text className="text-lg font-semibold text-black">Perfil</Text>
        </View>

        {/* User Info */}
        <View className="items-center mt-6">
          <View className="w-24 h-24 rounded-full bg-[#1D2C5E] items-center justify-center">
            <User size={50} color="white" />
          </View>
          <Text className="mt-3 text-base font-medium font-roboto text-black">
            {session.data?.user.name}
          </Text>
        </View>

        {/* Menu Items */}
        <View className="mt-8 space-y-8 flex-col gap-8 px-6">
          <MenuItem
            icon={<User size={22} color="#1D2C5E" />}
            text="Perfil Do Usuário"
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
    className={`flex-row items-center gap-4 px-3 ${touchableOpacityClassName}`}
  >
    <View className="w-6 h-6 items-center justify-center">{icon}</View>
    <Text className={`text-black text-base font-roboto ${textClassName}`}>
      {text}
    </Text>
  </TouchableOpacity>
)

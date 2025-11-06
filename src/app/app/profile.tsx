import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native'
import {
  User,
  MapPin,
  Tag,
  Users,
  MessageSquare,
  LogOut,
  Edit2,
  Save,
  X,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '@/contexts/auth-store'
import {
  updateUser,
  changePassword,
  deactivateAccount,
  type UpdateUserData,
  type ChangePasswordData,
} from '@/actions/auth'
import { useMutation } from '@tanstack/react-query'
import { Input, InputField } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AxiosError } from 'axios'

export default function ProfileScreen() {
  const { logout, updateUser: updateUserStore, user } = useAuthStore()
  const [isEditMode, setIsEditMode] = useState(false)
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    image: user?.image || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || '',
        image: user?.image || '',
      })
    }
  }, [user])

  const updateUserMutation = useMutation({
    mutationFn: (data: UpdateUserData) => updateUser(data),
    onSuccess: (response) => {
      if (response.data) {
        const updatedUser = response.data
        console.log('response', updatedUser)

        updateUserStore({
          name: updatedUser.name,
          image: updatedUser.image || undefined,
        })
        setIsEditMode(false)
      }
    },
    onError: (error) => {
      console.log(JSON.stringify(error, null, 2))
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || 'Erro ao atualizar perfil'
          : 'Erro ao atualizar perfil'
      Alert.alert('Erro', message)
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordData) => changePassword(data),
    onSuccess: () => {
      Alert.alert('Sucesso', 'Senha alterada com sucesso!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setShowPasswordSection(false)
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || 'Erro ao alterar senha'
          : 'Erro ao alterar senha'
      Alert.alert('Erro', message)
    },
  })

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

  const handleSave = () => {
    const updates: UpdateUserData = {}
    if (formData.name !== user?.name) {
      updates.name = formData.name
    }
    if (formData.image !== (user?.image || '')) {
      updates.image = formData.image
    }

    if (Object.keys(updates).length === 0) {
      Alert.alert('Aviso', 'Nenhuma alteração foi feita')
      return
    }

    updateUserMutation.mutate(updates)
  }

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem')
      return
    }

    if (passwordData.newPassword.length < 8) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 8 caracteres')
      return
    }

    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    })
  }

  if (isEditMode) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
                <TouchableOpacity
                  onPress={() => {
                    setFormData({
                      name: user?.name || '',
                      image: user?.image || '',
                    })
                    setIsEditMode(false)
                  }}
                >
                  <X size={24} color="#1D2C5E" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold text-black">
                  Editar Perfil
                </Text>
                <View style={{ width: 32 }} />
              </View>

              {/* Profile Picture */}
              <View className="items-center mt-8 mb-6">
                <View className="relative">
                  <View className="w-32 h-32 rounded-full bg-[#1D2C5E] items-center justify-center overflow-hidden">
                    <Text className="text-white text-4xl font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  </View>
                  <TouchableOpacity className="absolute bottom-0 right-0 bg-[#1D2C5E] p-3 rounded-full border-4 border-white">
                    <Camera size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* User Info Form */}
              <View className="px-6 space-y-6 gap-3">
                {/* Name */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </Text>
                  <Input
                    variant="outline"
                    size="lg"
                    isDisabled={false}
                    isInvalid={false}
                    className="bg-white"
                  >
                    <InputField
                      placeholder="Seu nome"
                      value={formData.name}
                      onChangeText={(text) =>
                        setFormData({ ...formData, name: text })
                      }
                      className="text-gray-800"
                    />
                  </Input>
                </View>

                {/* Email (Read-only) */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Email
                  </Text>
                  <View className="bg-gray-100 px-4 py-3 rounded-lg border border-gray-200">
                    <Text className="text-base text-gray-600">
                      {user?.email || 'Não informado'}
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500 mt-1">
                    O email não pode ser alterado
                  </Text>
                </View>

                {/* Image URL */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    URL da Imagem (Opcional)
                  </Text>
                  <Input
                    variant="outline"
                    size="lg"
                    isDisabled={false}
                    className="bg-white"
                  >
                    <InputField
                      placeholder="https://exemplo.com/foto.jpg"
                      value={formData.image}
                      onChangeText={(text) =>
                        setFormData({ ...formData, image: text })
                      }
                      keyboardType="url"
                      autoCapitalize="none"
                      className="text-gray-800"
                    />
                  </Input>
                </View>

                {/* Save Button */}
                <Button
                  onPress={handleSave}
                  disabled={updateUserMutation.isPending}
                  className="bg-[#1D2C5E] rounded-lg h-14"
                >
                  {updateUserMutation.isPending ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <View className="flex-row items-center gap-2">
                      <Save size={20} color="white" />
                      <Text className="text-white font-semibold text-base">
                        Salvar Alterações
                      </Text>
                    </View>
                  )}
                </Button>

                {/* Cancel Button */}
                <Button
                  onPress={() => {
                    setFormData({
                      name: user?.name || '',
                      image: user?.image || '',
                    })
                    setIsEditMode(false)
                  }}
                  disabled={updateUserMutation.isPending}
                  className="bg-gray-100 rounded-lg h-14"
                >
                  <Text className="text-gray-700 font-semibold text-base">
                    Cancelar
                  </Text>
                </Button>

                {/* Password Section */}
                <View className="mt-8 pt-8 border-t border-gray-200">
                  <TouchableOpacity
                    onPress={() => setShowPasswordSection(!showPasswordSection)}
                    className="flex-row items-center justify-between mb-4"
                  >
                    <View className="flex-row items-center gap-3">
                      <Lock size={22} color="#1D2C5E" />
                      <Text className="text-base font-semibold text-gray-800">
                        Alterar Senha
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-500">
                      {showPasswordSection ? 'Ocultar' : 'Mostrar'}
                    </Text>
                  </TouchableOpacity>

                  {showPasswordSection && (
                    <View className="space-y-4 gap-4">
                      {/* Current Password */}
                      <View>
                        <Text className="text-sm font-medium text-gray-700 mb-2">
                          Senha Atual
                        </Text>
                        <Input
                          variant="outline"
                          size="lg"
                          isDisabled={false}
                          className="bg-white"
                        >
                          <InputField
                            placeholder="Digite sua senha atual"
                            value={passwordData.currentPassword}
                            onChangeText={(text) =>
                              setPasswordData({
                                ...passwordData,
                                currentPassword: text,
                              })
                            }
                            secureTextEntry={!showCurrentPassword}
                            className="text-gray-800"
                          />
                          <TouchableOpacity
                            onPress={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="pr-3"
                          >
                            {showCurrentPassword ? (
                              <EyeOff size={20} color="#6B7280" />
                            ) : (
                              <Eye size={20} color="#6B7280" />
                            )}
                          </TouchableOpacity>
                        </Input>
                      </View>

                      {/* New Password */}
                      <View>
                        <Text className="text-sm font-medium text-gray-700 mb-2">
                          Nova Senha
                        </Text>
                        <Input
                          variant="outline"
                          size="lg"
                          isDisabled={false}
                          className="bg-white"
                        >
                          <InputField
                            placeholder="Digite sua nova senha"
                            value={passwordData.newPassword}
                            onChangeText={(text) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: text,
                              })
                            }
                            secureTextEntry={!showNewPassword}
                            className="text-gray-800"
                          />
                          <TouchableOpacity
                            onPress={() => setShowNewPassword(!showNewPassword)}
                            className="pr-3"
                          >
                            {showNewPassword ? (
                              <EyeOff size={20} color="#6B7280" />
                            ) : (
                              <Eye size={20} color="#6B7280" />
                            )}
                          </TouchableOpacity>
                        </Input>
                      </View>

                      {/* Confirm Password */}
                      <View>
                        <Text className="text-sm font-medium text-gray-700 mb-2">
                          Confirmar Nova Senha
                        </Text>
                        <Input
                          variant="outline"
                          size="lg"
                          isDisabled={false}
                          className="bg-white"
                        >
                          <InputField
                            placeholder="Confirme sua nova senha"
                            value={passwordData.confirmPassword}
                            onChangeText={(text) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: text,
                              })
                            }
                            secureTextEntry={!showConfirmPassword}
                            className="text-gray-800"
                          />
                          <TouchableOpacity
                            onPress={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="pr-3"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={20} color="#6B7280" />
                            ) : (
                              <Eye size={20} color="#6B7280" />
                            )}
                          </TouchableOpacity>
                        </Input>
                      </View>

                      {/* Change Password Button */}
                      <Button
                        onPress={handleChangePassword}
                        disabled={changePasswordMutation.isPending}
                        className="bg-[#1D2C5E] rounded-lg h-14"
                      >
                        {changePasswordMutation.isPending ? (
                          <ActivityIndicator color="white" />
                        ) : (
                          <Text className="text-white font-semibold text-base">
                            Alterar Senha
                          </Text>
                        )}
                      </Button>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="pb-10">
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <View style={{ width: 32 }} />
          <Text className="text-lg font-semibold text-black">Perfil</Text>
          <TouchableOpacity
            onPress={() => setIsEditMode(true)}
            className="p-2 rounded-full bg-blue-50"
          >
            <Edit2 size={20} color="#1D2C5E" />
          </TouchableOpacity>
        </View>

        {/* User Info */}
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

        {/* Menu Items */}
        <View className="mt-8 flex-1 space-y-8 flex-col gap-8 px-6">
          <MenuItem
            icon={<User size={22} color="#1D2C5E" />}
            text="Editar Perfil"
            onPress={() => setIsEditMode(true)}
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

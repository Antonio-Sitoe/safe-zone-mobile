import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Pressable,
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { X, Camera, Lock, Save } from 'lucide-react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '@/contexts/auth-store'
import { updateUser, changePassword, type UpdateUserData } from '@/actions/auth'
import { useMutation } from '@tanstack/react-query'
import { Input, InputField } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AxiosError } from 'axios'
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileFormData,
  type ChangePasswordFormData,
} from '@/utils/schemas/profile-schema'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function EditProfileScreen() {
  const { user, updateUser: updateUserStore } = useAuthStore()
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    reset: resetProfile,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || '',
      image: user?.image || '',
    },
  })

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPassword,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name || '',
        image: user.image || '',
      })
    }
  }, [user, resetProfile])

  const updateUserMutation = useMutation({
    mutationFn: (data: UpdateUserData) => updateUser(data),
    onSuccess: (response) => {
      if (response.data) {
        const updatedUser = response.data
        updateUserStore({
          name: updatedUser.name,
          image: updatedUser.image || undefined,
        })
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!')
        router.back()
      }
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || 'Erro ao atualizar perfil'
          : 'Erro ao atualizar perfil'
      Alert.alert('Erro', message)
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      changePassword(data),
    onSuccess: () => {
      Alert.alert('Sucesso', 'Senha alterada com sucesso!')
      resetPassword()
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

  const onProfileSubmit = (data: UpdateProfileFormData) => {
    const updates: UpdateUserData = {}
    if (data.name !== user?.name) {
      updates.name = data.name
    }
    if (data.image !== (user?.image || '')) {
      updates.image = data.image || undefined
    }

    if (Object.keys(updates).length === 0) {
      Alert.alert('Aviso', 'Nenhuma alteração foi feita')
      return
    }

    updateUserMutation.mutate(updates)
  }

  const onPasswordSubmit = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAwareScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
              <TouchableOpacity onPress={() => router.back()}>
                <X size={24} color="#1D2C5E" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-black">
                Editar Perfil
              </Text>
              <View style={{ width: 32 }} />
            </View>

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

            <View className="px-6 space-y-6 gap-3">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Nome
                </Text>
                <Controller
                  control={profileControl}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      variant="outline"
                      size="lg"
                      isDisabled={false}
                      isInvalid={!!profileErrors.name}
                      className="bg-white"
                    >
                      <InputField
                        placeholder="Seu nome"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        className="text-gray-800"
                      />
                    </Input>
                  )}
                />
                {profileErrors.name && (
                  <Text className="text-red-500 text-sm mt-1">
                    {profileErrors.name.message}
                  </Text>
                )}
              </View>

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

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  URL da Imagem (Opcional)
                </Text>
                <Controller
                  control={profileControl}
                  name="image"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      variant="outline"
                      size="lg"
                      isDisabled={false}
                      isInvalid={!!profileErrors.image}
                      className="bg-white"
                    >
                      <InputField
                        placeholder="https://exemplo.com/foto.jpg"
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="url"
                        autoCapitalize="none"
                        className="text-gray-800"
                      />
                    </Input>
                  )}
                />
                {profileErrors.image && (
                  <Text className="text-red-500 text-sm mt-1">
                    {profileErrors.image.message}
                  </Text>
                )}
              </View>

              <Button
                onPress={handleProfileSubmit(onProfileSubmit)}
                disabled={isProfileSubmitting || updateUserMutation.isPending}
                className="bg-[#1D2C5E] rounded-lg h-14"
              >
                {updateUserMutation.isPending || isProfileSubmitting ? (
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

              <Button
                onPress={() => router.back()}
                disabled={isProfileSubmitting || updateUserMutation.isPending}
                className="bg-gray-100 rounded-lg h-14"
              >
                <Text className="text-gray-700 font-semibold text-base">
                  Cancelar
                </Text>
              </Button>

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
                    <View>
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        Senha Atual
                      </Text>
                      <Controller
                        control={passwordControl}
                        name="currentPassword"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            variant="outline"
                            size="lg"
                            isDisabled={false}
                            isInvalid={!!passwordErrors.currentPassword}
                            className="bg-white"
                          >
                            <InputField
                              placeholder="Digite sua senha atual"
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              secureTextEntry={!showCurrentPassword}
                              className="text-gray-800"
                            />
                            <Pressable
                              onPress={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                              className="pr-3"
                            >
                              <Ionicons
                                name={showCurrentPassword ? 'eye-off' : 'eye'}
                                size={20}
                                color="#6B7280"
                              />
                            </Pressable>
                          </Input>
                        )}
                      />
                      {passwordErrors.currentPassword && (
                        <Text className="text-red-500 text-sm mt-1">
                          {passwordErrors.currentPassword.message}
                        </Text>
                      )}
                    </View>

                    <View>
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        Nova Senha
                      </Text>
                      <Controller
                        control={passwordControl}
                        name="newPassword"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            variant="outline"
                            size="lg"
                            isDisabled={false}
                            isInvalid={!!passwordErrors.newPassword}
                            className="bg-white"
                          >
                            <InputField
                              placeholder="Digite sua nova senha"
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              secureTextEntry={!showNewPassword}
                              className="text-gray-800"
                            />
                            <Pressable
                              onPress={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              className="pr-3"
                            >
                              <Ionicons
                                name={showNewPassword ? 'eye-off' : 'eye'}
                                size={20}
                                color="#6B7280"
                              />
                            </Pressable>
                          </Input>
                        )}
                      />
                      {passwordErrors.newPassword && (
                        <Text className="text-red-500 text-sm mt-1">
                          {passwordErrors.newPassword.message}
                        </Text>
                      )}
                    </View>

                    <View>
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nova Senha
                      </Text>
                      <Controller
                        control={passwordControl}
                        name="confirmPassword"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            variant="outline"
                            size="lg"
                            isDisabled={false}
                            isInvalid={!!passwordErrors.confirmPassword}
                            className="bg-white"
                          >
                            <InputField
                              placeholder="Confirme sua nova senha"
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              secureTextEntry={!showConfirmPassword}
                              className="text-gray-800"
                            />
                            <Pressable
                              onPress={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="pr-3"
                            >
                              <Ionicons
                                name={showConfirmPassword ? 'eye-off' : 'eye'}
                                size={20}
                                color="#6B7280"
                              />
                            </Pressable>
                          </Input>
                        )}
                      />
                      {passwordErrors.confirmPassword && (
                        <Text className="text-red-500 text-sm mt-1">
                          {passwordErrors.confirmPassword.message}
                        </Text>
                      )}
                    </View>

                    <Button
                      onPress={handlePasswordSubmit(onPasswordSubmit)}
                      disabled={
                        isPasswordSubmitting || changePasswordMutation.isPending
                      }
                      className="bg-[#1D2C5E] rounded-lg h-14"
                    >
                      {changePasswordMutation.isPending ||
                      isPasswordSubmitting ? (
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
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

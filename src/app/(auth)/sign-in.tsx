import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, router } from 'expo-router'
import { Entypo, Ionicons } from '@expo/vector-icons'
import { Input, InputField } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { SignInFormData } from '@/utils/schemas/sign-in-schema'
import { signInSchema } from '@/utils/schemas/sign-in-schema'
import BackgroundLogoSvgBlue from '@/assets/logo-blue.svg'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

import Shape1 from '@/assets/shapes1.svg'
import Shape2 from '@/assets/shapes2.svg'
import { signIn } from '@/actions/auth'
import { AxiosError } from 'axios'
import { useAuth } from '@/contexts/auth-store'

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const { login } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (_data: SignInFormData) => {
    setApiError(null)
    try {
      const response = await signIn({
        email: _data.email,
        password: _data.password,
      })

      console.log(response)

      // Extract user and session data from response
      const { user, session } = response.data.data

      // Store auth data in Zustand store
      login(user, session)
    } catch (error) {
      console.log(error)
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Não foi possível fazer login. Tente novamente.'

      setApiError(message || 'Não foi possível fazer login. Tente novamente.')
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        className="relative"
      >
        <KeyboardAvoidingView
          behavior="padding"
          className="bg-white flex-1 relative"
          enabled
        >
          <Shape1 style={{ position: 'absolute', bottom: 0, right: 0 }} />
          <Shape2 style={{ position: 'absolute', bottom: 120, left: 0 }} />

          <StatusBar style="auto" backgroundColor="#fff" animated={true} />
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}
          >
            <View className="flex-1 flex-col justify-between px-6 pt-12 pb-8 space-y-8">
              <View className="mb-8 w-full">
                <View className=" mb-8">
                  <Pressable
                    onPress={() => router.back()}
                    className="mr-4 p-2 flex-row items-center"
                  >
                    <Entypo name="chevron-left" size={24} color="black" />
                    <Text className="text-sm font-montserrat text-gray-700">
                      Voltar
                    </Text>
                  </Pressable>
                </View>
                <View className="flex-row items-center mx-auto">
                  <BackgroundLogoSvgBlue width={249} height={48} />
                </View>
              </View>

              <View className="space-y-4 mt-10 flex-1 flex-col gap-4">
                <Text className="text-xl font-montserrat font-bold text-gray-700 mb-1">
                  Entrar
                </Text>

                <View>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        variant="outline"
                        size="lg"
                        isDisabled={false}
                        isInvalid={!!errors.email}
                        isReadOnly={false}
                      >
                        <InputField
                          placeholder="Email"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          className="text-gray-800 font-montserrat"
                        />
                      </Input>
                    )}
                  />
                  {errors.email && (
                    <Text className="text-red-500 text-sm mt-1 font-montserrat">
                      {errors.email.message}
                    </Text>
                  )}
                </View>

                <View>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        variant="outline"
                        size="lg"
                        isDisabled={false}
                        isInvalid={!!errors.password}
                        isReadOnly={false}
                      >
                        <InputField
                          placeholder="Senha"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          secureTextEntry={!showPassword}
                          className="text-gray-800 font-montserrat"
                        />
                        <Pressable
                          onPress={() => setShowPassword(!showPassword)}
                          className="pr-3"
                        >
                          <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={20}
                            color="#6B7280"
                          />
                        </Pressable>
                      </Input>
                    )}
                  />
                  {errors.password && (
                    <Text className="text-red-500 text-sm mt-1 font-montserrat">
                      {errors.password.message}
                    </Text>
                  )}
                </View>

                {apiError && (
                  <View className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <Text className="text-red-600 text-sm font-montserrat text-center">
                      {apiError}
                    </Text>
                  </View>
                )}

                <View>
                  <Link href="/(auth)/forgot-password" asChild>
                    <TouchableOpacity>
                      <Text className="text-sm font-montserrat text-app-red text-right">
                        Esqueceu sua senha?
                      </Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
              <View className="mt-8 flex-1 justify-between">
                <Button
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="bg-app-primary rounded-lg h-16 mx-auto w-48"
                >
                  <Text className="text-white font-montserrat font-semibold text-xs">
                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                  </Text>
                </Button>

                <Link href="/home" asChild>
                  <TouchableOpacity className="flex-row gap-2 items-start justify-center">
                    <Text className="text-sm font-montserrat text-gray-700 text-center mb-2">
                      Não Tem Conta?
                    </Text>
                    <Text className="text-sm font-montserrat text-app-primary underline text-center font-semibold">
                      Criar uma Conta
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default SignIn

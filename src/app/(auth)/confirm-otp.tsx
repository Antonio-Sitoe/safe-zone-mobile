import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native'

import { router, useLocalSearchParams } from 'expo-router'
import { Entypo } from '@expo/vector-icons'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { OtpInput } from 'react-native-otp-entry'
import ConfirmOtpSvg from '@/assets/otpBg.svg'
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal'

import Image1 from '@/assets/Ellipse11.svg'
import Image2 from '@/assets/Ellipse12.svg'
import Image3 from '@/assets/Ellipse13.svg'
import { Image } from 'expo-image'
import { sendEmail, verifyEmail } from '@/actions/auth'
import { AxiosError } from 'axios'

const OTP_LENGTH = 4

const ConfirmOTP = () => {
  const params = useLocalSearchParams()
  const email = params.email as string
  const [isOpen, setIsOpen] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpKey, setOtpKey] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const onClose = () => {
    setIsOpen(false)
    router.push('/(auth)/sign-in')
  }

  const onResetOtp = () => {
    setOtp('')
    setIsOpen(false)
    setIsVerifying(false)
    setIsResending(false)
    setOtpKey((prev) => prev + 1)
  }

  const handleSubmit = async () => {
    setIsVerifying(true)
    try {
      const response = await sendEmail(email, otp)
      console.log({ response })
      setIsOpen(true)
      setIsVerifying(false)
    } catch (error) {
      console.log(error)
      const message =
        error instanceof AxiosError
          ? error.response?.data.message
          : 'Código inválido. Tente novamente.'

      Alert.alert('Erro', message || 'Código inválido. Tente novamente.', [
        {
          text: 'OK',
          onPress: () => {
            onResetOtp()
          },
        },
      ])
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)

    const response = await verifyEmail(email)
    console.log(response)
    onResetOtp()
    setIsResending(false)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        className="relative"
      >
        <KeyboardAvoidingView
          behavior="padding"
          className="bg-white flex-1 relative"
          enabled
        >
          <Image1 style={{ position: 'absolute', top: 100, left: 0 }} />
          <Image2 style={{ position: 'absolute', bottom: 10, left: 0 }} />
          <Image3 style={{ position: 'absolute', bottom: 0, right: 0 }} />

          <StatusBar style="dark" backgroundColor="#fff" animated={true} />
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          >
            <View className="flex-1 flex-col justify-between px-6 pt-8 pb-8 space-y-8">
              <View className="w-full mb-10">
                <Pressable
                  onPress={() => router.back()}
                  className="mr-4 p-2 flex-row items-center"
                >
                  <Entypo name="chevron-left" size={24} color="#374151" />
                  <Text className="text-sm font-montserrat text-gray-700 ml-2">
                    Voltar
                  </Text>
                </Pressable>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-lg font-medium font-montserrat text-gray-800 text-center mb-4">
                  Verifique Seu Celular
                </Text>

                <View className="items-center justify-center">
                  <ConfirmOtpSvg width={157} height={167} />
                </View>

                <View className="w-full items-center mb-2">
                  <OtpInput
                    key={otpKey}
                    onTextChange={setOtp}
                    numberOfDigits={OTP_LENGTH}
                    focusColor="#1F346C"
                    focusStickBlinkingDuration={500}
                    textInputProps={{
                      accessibilityLabel: 'One-Time Password',
                    }}
                    theme={{
                      containerStyle: {
                        marginVertical: 20,
                      },
                      pinCodeContainerStyle: {
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: '#1F346C',
                        marginHorizontal: 8,
                      },
                      pinCodeTextStyle: {
                        color: 'white',
                        fontSize: 22,
                        fontWeight: 'bold',
                      },
                      focusStickStyle: {
                        backgroundColor: '#1F346C',
                      },
                      focusedPinCodeContainerStyle: {
                        backgroundColor: '#1F346C',
                        borderWidth: 2,
                        borderColor: '#1F346C',
                      },
                    }}
                    autoFocus
                    type="numeric"
                  />
                </View>

                <Text className="text-base font-montserrat text-gray-600 text-center mb-8 px-4">
                  Por favor insira o código que você recebeu via SMS
                </Text>

                <View className="w-full mb-6">
                  <Button
                    onPress={handleSubmit}
                    disabled={otp.length !== OTP_LENGTH}
                    className="bg-app-primary disabled:bg-app-primary/50 rounded-xl h-16 w-full"
                  >
                    <Text className="text-white font-montserrat text-sm">
                      {isVerifying ? 'Verificando...' : 'Continuar'}
                    </Text>
                  </Button>
                </View>

                <TouchableOpacity
                  onPress={handleResendCode}
                  disabled={isResending}
                  className="flex-row items-center"
                >
                  <Text className="text-base font-montserrat text-gray-600">
                    Não Recebeu Seu Código?{' '}
                  </Text>
                  <Text className="text-base font-montserrat text-app-primary underline">
                    {isResending ? 'Enviando...' : 'Envie-o Novamente'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalBackdrop />
            <ModalContent size="lg">
              <ModalHeader className="mx-auto">
                <Image
                  source={require('@/assets/done-circle.png')}
                  style={{ width: 72, height: 72 }}
                />
              </ModalHeader>
              <ModalBody>
                <Text className="font-montserrat leading-7 text-gray-700 text-center text-base">
                  Parabéns! Sua conta foi criada com sucesso em{' '}
                  <Text className="font-bold font-montserrat text-app-primary">
                    Mapa Seguro.
                  </Text>{' '}
                  {'\n'}
                  Estamos animados por tê-lo(a) conosco.
                </Text>
              </ModalBody>
              <ModalFooter className="items-center mt- justify-center">
                <Button
                  onPress={onClose}
                  className="bg-app-primary rounded-xl h-14 w-2/3"
                >
                  <Text className="text-white font-montserrat text-sm ">
                    Fechar
                  </Text>
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default ConfirmOTP

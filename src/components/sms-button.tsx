import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'
import { useAuthStore } from '@/contexts/auth-store'
import { getContactsByUserId, sendAlert } from '@/actions/community'
import { StatusModal } from '@/components/modal/notification'
import * as Location from 'expo-location'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const BUTTON_SIZE = 53
const RING_SIZE = BUTTON_SIZE + 19
const STROKE_WIDTH = 6
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const HOLD_DURATION = 2500

export function SmsButton() {
  const { user } = useAuthStore()
  const [modalState, setModalState] = useState({
    visible: false,
    status: 'success' as 'success' | 'error',
    title: '',
    message: '',
  })
  const [isSendingAlert, setIsSendingAlert] = useState(false)
  const progress = useSharedValue(0)

  const showModal = (
    status: 'success' | 'error',
    title: string,
    message: string
  ) => {
    setModalState({
      visible: true,
      status,
      title,
      message,
    })
  }

  const hideModal = () => {
    setModalState((prev) => ({
      ...prev,
      visible: false,
    }))
  }

  const handleSendAlert = async () => {
    if (!user?.id || isSendingAlert) return

    setIsSendingAlert(true)

    try {
      const contactsResult = await getContactsByUserId(user.id)

      if (contactsResult.error || !contactsResult.data) {
        showModal(
          'error',
          'Não foi possível carregar os contactos',
          'Verifique a sua conexão e tente novamente.'
        )
        return
      }

      const contactsByGroup = contactsResult.data.data || []

      const contactIds = contactsByGroup
        .flatMap((group: any) => group.contacts || [])
        .map((contact: any) => contact.id)
        .filter((id: string) => id)

      if (contactIds.length === 0) {
        showModal(
          'error',
          'Nenhum contacto configurado',
          'Adicione contactos na comunidade para enviar alertas.'
        )
        return
      }
      const loc = await Location.getCurrentPositionAsync({})
      const alertResult = await sendAlert(
        contactIds,
        loc.coords.latitude,
        loc.coords.longitude
      )

      if (alertResult.error) {
        showModal(
          'error',
          'Não foi possível enviar o alerta',
          'Ocorreu um problema ao notificar os contactos. Tente novamente.'
        )
        return
      }

      showModal(
        'success',
        'Alerta Enviado Com Sucesso',
        'Os seus contactos foram notificados sobre a situação de risco.'
      )
    } catch (error) {
      console.error('Error sending alert:', error)
      showModal(
        'error',
        'Erro inesperado',
        'Não conseguimos completar o alerta. Por favor, tente novamente.'
      )
    } finally {
      setIsSendingAlert(false)
      progress.value = 0
    }
  }

  const handlePressIn = () => {
    if (isSendingAlert) return

    progress.value = withTiming(
      1,
      {
        duration: HOLD_DURATION,
        easing: Easing.linear,
      },
      (finished) => {
        if (finished) {
          runOnJS(handleSendAlert)()
        }
      }
    )
  }

  const handlePressOut = () => {
    cancelAnimation(progress)
    progress.value = withTiming(0, { duration: 200 })
  }

  const animatedCircleProps = useAnimatedProps(() => {
    const strokeDashoffset = CIRCUMFERENCE * (1 - progress.value)
    return {
      strokeDashoffset,
    }
  })

  return (
    <>
      <Pressable
        style={styles.wrapper}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isSendingAlert}
      >
        <View style={styles.container}>
          <Svg width={RING_SIZE} height={RING_SIZE} style={styles.progressSvg}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke="rgba(239, 68, 68, 0.2)"
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeLinecap="round"
            />
            <AnimatedCircle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke="#ef4444"
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              animatedProps={animatedCircleProps}
              strokeLinecap="round"
            />
          </Svg>

          <View style={styles.sosButton}>
            <Text style={styles.sosLabel}>SOS</Text>
          </View>
        </View>
      </Pressable>

      <StatusModal
        visible={modalState.visible}
        status={modalState.status}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
      />
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: RING_SIZE,
    height: RING_SIZE,
  },
  progressSvg: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
  },
  sosButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  sosLabel: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
})

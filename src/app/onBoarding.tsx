// OnboardingScreen.tsx
import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  Platform,
  AccessibilityInfo,
} from 'react-native'
import PagerView from 'react-native-pager-view'
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  interpolate,
} from 'react-native-reanimated'
import { RFValue } from 'react-native-responsive-fontsize'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

// Substitua pelos seus assets importados
import Onboard1 from '@/assets/slide/slide-1.svg'
import Onboard2 from '@/assets/slide/slide-2.svg'
import Onboard3 from '@/assets/slide/slide-3.svg'

const ONBOARDING_KEY = '@has_completed_onboarding'

const onboardingData = [
  {
    id: 1,
    title: 'Aqui estão algumas dicas essenciais para aproveitar ao máximo',
    subtitle:
      'Personalize quem pode ver sua localização para garantir sua privacidade.',
    icon: Onboard1,
  },
  {
    id: 2,
    title: 'Navegação Consciente',
    subtitle:
      'Antes de sair, confira as áreas de risco e escolha rotas seguras.',
    icon: Onboard2,
  },
  {
    id: 3,
    title: 'Botão de Emergência Rápida',
    subtitle:
      'Configure o botão de emergência para ligar rapidamente para contatos específicos ou a polícia.',
    icon: Onboard3,
  },
]

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity)

export default function OnboardingScreen() {
  const { width, height } = useWindowDimensions()
  const pagerRef = useRef<PagerView | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<
    boolean | null
  >(null)

  // shared value used as page progress (0..n-1 with fractional offsets)
  const progress = useSharedValue(0)

  // read onboarding flag on mount
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY)
        if (!mounted) return
        setHasCompletedOnboarding(value === 'true')
        // accessibility focus when screen loads
        if (Platform.OS === 'android') {
          AccessibilityInfo.setAccessibilityFocus?.(0)
        }
      } catch (err) {
        console.warn('Erro ao ler onboarding flag', err)
        setHasCompletedOnboarding(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  // helper to mark onboarding completed
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true')
      setHasCompletedOnboarding(true)
    } catch (err) {
      console.warn('Erro ao salvar flag onboarding', err)
    }
  }

  // Next button pressed
  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      const next = currentPage + 1
      pagerRef.current?.setPage(next)
      // update local state and progress
      setCurrentPage(next)
      progress.value = withSpring(next, { damping: 18, stiffness: 150 })
    } else {
      handleFinish()
    }
  }

  const handleFinish = async () => {
    await completeOnboarding()
    // navega para a homepage (ajuste se precisar)
    router.replace('/')
  }

  const handleCreateCompany = async () => {
    await completeOnboarding()
    router.push('/(auth)/sign-up')
  }

  const handleJoinCompany = async () => {
    await completeOnboarding()
    router.push('/')
  }

  // Pager callbacks
  const onPageScroll = (e: any) => {
    const { position, offset } = e.nativeEvent
    // position + offset representa o índice com fração
    progress.value = withSpring(position + offset, {
      damping: 18,
      stiffness: 150,
    })
  }

  const onPageSelected = (e: any) => {
    const page = e.nativeEvent.position
    setCurrentPage(page)
    progress.value = withSpring(page, { damping: 18, stiffness: 150 })
  }

  // If we've determined the user already finished onboarding, redirect immediately
  if (hasCompletedOnboarding === true) {
    // se já completou, redirecionamos (replace) imediatamente
    router.replace('/')
    return null
  }

  // Still loading the flag
  if (hasCompletedOnboarding === null) {
    // pode retornar um loader simples
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <Text>Carregando...</Text>
      </View>
    )
  }

  // Animated title component (adapta opacidade/translate/scale baseado no progresso)
  const AnimatedTitle = ({ index }: { index: number }) => {
    const distance = useDerivedValue(() => {
      return Math.abs(progress.value - index)
    })
    const style = useAnimatedStyle(() => {
      const opacity = interpolate(distance.value, [0, 1], [1, 0.45])
      const translateY = interpolate(distance.value, [0, 1], [0, 18])
      const scale = interpolate(distance.value, [0, 1], [1, 0.97])
      return {
        opacity,
        transform: [{ translateY }, { scale }],
      }
    })
    return (
      <Animated.Text
        style={[
          style,
          {
            fontSize: RFValue(22, height),
            color: '#0f172a',
            lineHeight: RFValue(30, height),
          },
        ]}
        accessibilityRole="header"
      >
        {onboardingData[index].title}
      </Animated.Text>
    )
  }

  const AnimatedSubtitle = ({ index }: { index: number }) => {
    const distance = useDerivedValue(() => Math.abs(progress.value - index))
    const style = useAnimatedStyle(() => {
      const opacity = interpolate(distance.value, [0, 1], [1, 0.5])
      const translateY = interpolate(distance.value, [0, 1], [0, 10])
      return {
        opacity,
        transform: [{ translateY }],
      }
    })
    return (
      <Animated.Text
        style={[
          style,
          {
            fontSize: RFValue(14, height),
            color: '#0f172a',
            marginTop: 12,
            lineHeight: RFValue(20, height),
          },
        ]}
      >
        {onboardingData[index].subtitle}
      </Animated.Text>
    )
  }

  // Illustration component: escala animada ao entrar
  const IllustrationComponent = ({ index }: { index: number }) => {
    const Icon = onboardingData[index].icon
    const scale = useSharedValue(0)
    useEffect(() => {
      scale.value = 0
      scale.value = withDelay(
        250,
        withSpring(1, { damping: 9, stiffness: 120 })
      )
    }, [index])

    const style = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      }
    })

    // dimensiona o SVG conforme largura da tela
    const iconSize = Math.min(width * 0.52, 320)

    return (
      <Animated.View
        style={[style, { alignItems: 'center', justifyContent: 'center' }]}
      >
        <View
          style={{
            width: iconSize,
            height: iconSize,
            borderRadius: iconSize / 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          {/* Ajuste width/height do SVG conforme necessário */}
          <Icon width={iconSize * 0.9} height={iconSize * 0.9} />
        </View>
      </Animated.View>
    )
  }

  // Indicator dot: fica preenchido azul quando ativo e com contorno quando inativo
  const Indicator = ({ index }: { index: number }) => {
    const derived = useDerivedValue(() => {
      const d = Math.abs(progress.value - index)
      return d
    })
    const style = useAnimatedStyle(() => {
      const d = derived.value
      // quanto menor distance -> mais "ativo"
      const scale = interpolate(d, [0, 1.2], [1.15, 0.88])
      const opacity = interpolate(d, [0, 1.2], [1, 0.5])
      const isActive = d < 0.4
      return {
        transform: [{ scale }],
        opacity,
        width: 16,
        height: 16,
        borderRadius: 8,
        marginHorizontal: 6,
        backgroundColor: isActive ? '#12224a' : 'transparent',
        borderWidth: 2,
        borderColor: '#12224a',
      }
    }, [])
    return <Animated.View style={style} />
  }

  const PageIndicator = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 6,
      }}
    >
      {onboardingData.map((_, i) => (
        <Indicator key={i} index={i} />
      ))}
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageScroll={onPageScroll}
        onPageSelected={onPageSelected}
      >
        {onboardingData.map((item, index) => (
          <View key={item.id} style={styles.page}>
            {/* top colored card */}
            <View
              style={[
                styles.topCard,
                {
                  minHeight: height * 0.32,
                  paddingHorizontal: 24,
                  paddingTop: 28,
                  paddingBottom: 20,
                },
              ]}
            >
              <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <AnimatedTitle index={index} />
                <AnimatedSubtitle index={index} />
              </View>
            </View>

            {/* main content */}
            <View
              style={{
                flex: 1,
                paddingHorizontal: 20,
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: height * 0.03,
                }}
              >
                <IllustrationComponent index={index} />
              </View>

              <PageIndicator />

              <View
                style={{
                  paddingBottom: height * 0.04,
                  width: width * 0.9,
                  alignSelf: 'center',
                }}
              >
                {index === onboardingData.length - 1 ? (
                  <>
                    <AnimatedTouchableOpacity
                      onPress={handleCreateCompany}
                      style={[
                        styles.primaryButton,
                        { paddingVertical: height * 0.018 },
                      ]}
                    >
                      <Text
                        style={[
                          styles.primaryButtonText,
                          { fontSize: RFValue(16, height) },
                        ]}
                      >
                        Crie a sua Empresa
                      </Text>
                    </AnimatedTouchableOpacity>

                    <TouchableOpacity
                      onPress={handleJoinCompany}
                      style={{ paddingVertical: height * 0.014 }}
                    >
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#0f172a',
                          fontWeight: '700',
                        }}
                      >
                        Entrar numa Empresa existente
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <AnimatedTouchableOpacity
                      onPress={handleNext}
                      style={[
                        styles.nextButton,
                        { paddingVertical: height * 0.018 },
                      ]}
                    >
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: RFValue(15, height),
                        }}
                      >
                        Continuar
                      </Text>
                    </AnimatedTouchableOpacity>
                    <View style={{ height: height * 0.02 }} />
                  </>
                )}
              </View>
            </View>
          </View>
        ))}
      </PagerView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  page: { flex: 1 },
  topCard: {
    backgroundColor: '#E6FDF0', // card claro (ajuste conforme design)
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 8,
  },
  primaryButton: {
    backgroundColor: '#F5E0A0',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  primaryButtonText: {
    color: '#0f172a',
    fontWeight: '800',
  },
  nextButton: {
    backgroundColor: '#12224a',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
})

/** biome-ignore-all lint/correctness/noNestedComponentDefinitions: ESLint */
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Easing,
  Extrapolation,
} from 'react-native-reanimated'
import { useCallback, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  Platform,
} from 'react-native'
import PagerView from 'react-native-pager-view'
import { LinearGradient } from 'expo-linear-gradient'
import { RFValue } from 'react-native-responsive-fontsize'
import { StatusBar } from 'expo-status-bar'
import { useAuthStore } from '@/contexts/auth-store'
import * as Haptics from 'expo-haptics'

import Onboard1 from '@/assets/slide/slide-1.svg'
import Onboard2 from '@/assets/slide/slide-2.svg'
import Onboard3 from '@/assets/slide/slide-3.svg'
import { SafeAreaView } from 'react-native-safe-area-context'

const AUTO_PLAY_INTERVAL = 4500

const onboardingData = [
  {
    id: 1,
    title: 'Aqui Estão Algumas Dicas Essenciais Para Aproveitar Ao Máximo',
    subtitle:
      'Personalize Quem Pode Ver Sua Localização Para Garantir Sua Privacidade.',
    icon: Onboard1,
    gradient: ['#667eea', '#764ba2'],
  },
  {
    id: 2,
    title: 'Navegação Consciente',
    subtitle:
      'Antes De Sair, Confira As Áreas De Risco E Escolha Rotas Seguras.',
    icon: Onboard2,
    gradient: ['#f093fb', '#f5576c'],
  },
  {
    id: 3,
    title: 'Botão De Emergência Rápida',
    subtitle:
      'Configure O Botão De Emergência Para Ligar Rapidamente Para Contatos Específicos Ou A Polícia.',
    icon: Onboard3,
    gradient: ['#4facfe', '#00f2fe'],
  },
]

export default function OnboardingScreen() {
  const { width, height } = useWindowDimensions()
  const pagerRef = useRef<PagerView | null>(null)
  const { hasCompletedOnboarding, completeOnboarding } = useAuthStore()

  const progress = useSharedValue(0)
  const buttonScale = useSharedValue(1)
  const autoplayRef = useRef<number | null>(null)

  const clearAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
  }, [])

  const startAutoplay = () => {
    clearAutoplay()
    let currentIndex = 0
    autoplayRef.current = setInterval(() => {
      const next =
        currentIndex < onboardingData.length - 1
          ? currentIndex + 1
          : currentIndex
      if (next !== currentIndex) {
        pagerRef.current?.setPage(next)
        progress.value = withTiming(next, {
          duration: 500,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        })
        currentIndex = next
      } else {
        clearAutoplay()
      }
    }, AUTO_PLAY_INTERVAL)
  }

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      startAutoplay()
    }
    return () => {
      clearAutoplay()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCompletedOnboarding])

  const handleCreateAccount = () => {
    clearAutoplay()
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
    completeOnboarding()
  }

  useEffect(() => {
    return () => {
      clearAutoplay()
      progress.value = 0
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearAutoplay])

  const onPageScroll = (e: any) => {
    const { position, offset } = e.nativeEvent
    progress.value = position + offset
  }

  const onPageSelected = (e: any) => {
    const page = e.nativeEvent.position
    progress.value = withTiming(page, {
      duration: 500,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    })
    if (page < onboardingData.length - 1) {
      startAutoplay()
    } else {
      clearAutoplay()
    }
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }

  const AnimatedTitle = ({ index }: { index: number }) => {
    const distance = useDerivedValue(() => Math.abs(progress.value - index))
    const style = useAnimatedStyle(() => {
      const opacity = interpolate(
        distance.value,
        [0, 0.5],
        [1, 0],
        Extrapolation.CLAMP
      )
      const translateY = interpolate(
        distance.value,
        [0, 0.5],
        [0, -30],
        Extrapolation.CLAMP
      )
      const scale = interpolate(
        distance.value,
        [0, 0.5],
        [1, 0.9],
        Extrapolation.CLAMP
      )
      return {
        opacity,
        transform: [{ translateY }, { scale }],
      }
    })
    return (
      <Animated.View style={style}>
        <Text
          style={[
            styles.title,
            {
              fontSize: RFValue(28, height),
              lineHeight: RFValue(36, height),
            },
          ]}
          accessibilityRole="header"
        >
          {onboardingData[index].title}
        </Text>
      </Animated.View>
    )
  }

  const AnimatedSubtitle = ({ index }: { index: number }) => {
    const distance = useDerivedValue(() => Math.abs(progress.value - index))
    const style = useAnimatedStyle(() => {
      const opacity = interpolate(
        distance.value,
        [0, 0.5],
        [1, 0],
        Extrapolation.CLAMP
      )
      const translateY = interpolate(
        distance.value,
        [0, 0.5],
        [0, 20],
        Extrapolation.CLAMP
      )
      return {
        opacity,
        transform: [{ translateY }],
      }
    })
    return (
      <Animated.View style={style}>
        <Text
          style={[
            styles.subtitle,
            {
              fontSize: RFValue(16, height),
              lineHeight: RFValue(24, height),
            },
          ]}
        >
          {onboardingData[index].subtitle}
        </Text>
      </Animated.View>
    )
  }

  const IllustrationComponent = ({ index }: { index: number }) => {
    const Icon = onboardingData[index].icon
    const distance = useDerivedValue(() => Math.abs(progress.value - index))

    const style = useAnimatedStyle(() => {
      const opacity = interpolate(
        distance.value,
        [0, 0.7],
        [1, 0.2],
        Extrapolation.CLAMP
      )
      const scale = interpolate(
        distance.value,
        [0, 0.7],
        [1, 0.85],
        Extrapolation.CLAMP
      )
      const translateY = interpolate(
        distance.value,
        [0, 0.7],
        [0, -40],
        Extrapolation.CLAMP
      )
      const rotate = interpolate(
        distance.value,
        [0, 0.7],
        [0, 5],
        Extrapolation.CLAMP
      )

      return {
        opacity,
        transform: [{ scale }, { translateY }, { rotate: `${rotate}deg` }],
      }
    })

    const iconSize = Math.min(width * 0.7, 400)

    return (
      <Animated.View
        style={[style, { alignItems: 'center', justifyContent: 'center' }]}
      >
        <View
          style={{
            width: iconSize,
            height: iconSize,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon width={iconSize * 0.9} height={iconSize * 0.9} />
        </View>
      </Animated.View>
    )
  }

  const BackgroundGradient = ({ index }: { index: number }) => {
    const distance = useDerivedValue(() => Math.abs(progress.value - index))
    const style = useAnimatedStyle(() => {
      const opacity = interpolate(
        distance.value,
        [0, 0.8],
        [0.15, 0],
        Extrapolation.CLAMP
      )
      return { opacity }
    })

    return (
      <Animated.View style={[StyleSheet.absoluteFill, style]}>
        <LinearGradient
          colors={['#1F346C', '#2B4170']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    )
  }

  const Indicator = ({ index }: { index: number }) => {
    const derived = useDerivedValue(() => Math.abs(progress.value - index))
    const style = useAnimatedStyle(() => {
      const isActive = derived.value < 0.5
      const width = interpolate(
        derived.value,
        [0, 0.5, 1],
        [32, 32, 8],
        Extrapolation.CLAMP
      )
      const opacity = interpolate(
        derived.value,
        [0, 0.5, 1],
        [1, 1, 0.4],
        Extrapolation.CLAMP
      )

      return {
        width: withSpring(width, {
          damping: 15,
          stiffness: 150,
        }),
        height: 8,
        borderRadius: 4,
        backgroundColor: isActive ? '#1F346C' : '#E2E8F0',
        opacity,
      }
    })
    return <Animated.View style={style} />
  }

  const PageIndicator = () => (
    <View style={styles.indicatorContainer}>
      {onboardingData.map((_, i) => (
        <Indicator key={i} index={i} />
      ))}
    </View>
  )

  const AnimatedButton = () => {
    const buttonStyle = useAnimatedStyle(() => ({
      transform: [{ scale: buttonScale.value }],
    }))

    const handlePressIn = () => {
      buttonScale.value = withSpring(0.95, {
        damping: 15,
        stiffness: 300,
      })
    }

    const handlePressOut = () => {
      buttonScale.value = withSpring(1, {
        damping: 15,
        stiffness: 300,
      })
    }

    return (
      <Animated.View style={buttonStyle}>
        <TouchableOpacity
          className="bg-app-primary"
          onPress={handleCreateAccount}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          style={[
            styles.primaryButton,
            styles.buttonGradient,
            { paddingVertical: Math.max(16, height * 0.02) },
          ]}
        >
          <Text
            style={[
              styles.primaryButtonText,
              { fontSize: RFValue(17, height) },
            ]}
          >
            Começar
          </Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <SafeAreaView className="flex-1">
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor="#ffffff" />

        {onboardingData.map((_, index) => (
          <BackgroundGradient key={`bg-${index}`} index={index} />
        ))}

        <PagerView
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={0}
          onPageScroll={onPageScroll}
          onPageSelected={onPageSelected}
          offscreenPageLimit={2}
        >
          {onboardingData.map((item, index) => (
            <View key={item.id} style={styles.page}>
              <View style={styles.topSection}>
                <AnimatedTitle index={index} />
              </View>

              <View style={styles.illustrationSection}>
                <IllustrationComponent index={index} />
              </View>

              <View style={styles.bottomSection}>
                <AnimatedSubtitle index={index} />
                <PageIndicator />

                {index === onboardingData.length - 1 && (
                  <View style={styles.buttonContainer}>
                    <AnimatedButton />
                  </View>
                )}
              </View>
            </View>
          ))}
        </PagerView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  page: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  topSection: {
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
  },
  illustrationSection: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 16,
  },
  title: {
    color: '#0f172a',
    textAlign: 'center',
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 32,
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#1F346C',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  buttonGradient: {
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
})

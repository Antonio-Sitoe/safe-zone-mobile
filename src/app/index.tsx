import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native'
import { useRouter } from 'expo-router'
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import { ChevronRight } from 'lucide-react-native'
import { ONBOARDING_SLIDES } from '@/constants/onBoarding'
import { OnboardingSlide } from '@/components/onBoarding/OnBoardingSlide'
import { PaginationDots } from '@/components/onBoarding/PaginationDot'

const { width } = Dimensions.get('window')

export default function OnboardingScreen() {
  const router = useRouter()
  const scrollX = useSharedValue(0)
  const scrollViewRef = useSharedValue<any>(null)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x
    },
  })

  const currentIndex = Math.round(scrollX.value / width)
  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (ONBOARDING_SLIDES.length - 2) * width,
      (ONBOARDING_SLIDES.length - 1) * width,
    ]

    const backgroundColor = interpolate(
      scrollX.value,
      inputRange,
      [0x1e40af, 0x16a34a],
      Extrapolation.CLAMP
    )

    return {
      backgroundColor: `#${Math.floor(backgroundColor)
        .toString(16)
        .padStart(6, '0')}`,
    }
  })

  const handleNext = () => {
    if (isLastSlide) {
      router.replace('/')
    } else {
      scrollViewRef.value?.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      })
    }
  }

  const handleSkip = () => {
    router.replace('/')
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        ref={(ref) => (scrollViewRef.value = ref)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {ONBOARDING_SLIDES.map((slide) => (
          <OnboardingSlide key={slide.id} item={slide} />
        ))}
      </Animated.ScrollView>

      <View style={styles.footer}>
        <PaginationDots data={ONBOARDING_SLIDES} scrollX={scrollX} />

        <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
          <TouchableOpacity
            onPress={handleNext}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isLastSlide ? 'Começar' : 'Próximo'}
            </Text>
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    alignItems: 'flex-end',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 32,
  },
  buttonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
})

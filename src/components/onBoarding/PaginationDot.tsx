import { View, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'

interface PaginationDotsProps {
  data: any[]
  scrollX: Animated.SharedValue<number>
  dotSize?: number
  activeDotSize?: number
  activeColor?: string
  inactiveColor?: string
}

export function PaginationDots({
  data,
  scrollX,
  dotSize = 8,
  activeDotSize = 10,
  activeColor = '#1E40AF',
  inactiveColor = '#E5E7EB',
}: PaginationDotsProps) {
  return (
    <View style={styles.container}>
      {data.map((_, index) => {
        const inputRange = [(index - 1) * 300, index * 300, (index + 1) * 300]

        const animatedDotStyle = useAnimatedStyle(() => {
          const width = interpolate(
            scrollX.value,
            inputRange,
            [dotSize, activeDotSize, dotSize],
            Extrapolation.CLAMP
          )

          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.5, 1, 0.5],
            Extrapolation.CLAMP
          )

          return {
            width,
            height: width,
            opacity,
          }
        })

        const animatedColorStyle = useAnimatedStyle(() => {
          const backgroundColor =
            interpolate(
              scrollX.value,
              inputRange,
              [0, 1, 0],
              Extrapolation.CLAMP
            ) > 0.5
              ? activeColor
              : inactiveColor

          return {
            backgroundColor,
          }
        })

        return (
          <Animated.View
            key={index}
            style={[styles.dot, animatedDotStyle, animatedColorStyle]}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    borderRadius: 50,
  },
})

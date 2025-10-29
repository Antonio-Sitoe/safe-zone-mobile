import React from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated'

interface PaginationDotsProps {
  data: any[]
  scrollX: SharedValue<number>
  dotSize?: number
  activeDotSize?: number
  activeColor?: string
  inactiveColor?: string
}

interface DotProps {
  index: number
  scrollX: SharedValue<number>
  dotSize: number
  activeDotSize: number
  activeColor: string
  inactiveColor: string
}

function Dot({
  index,
  scrollX,
  dotSize,
  activeDotSize,
  activeColor,
  inactiveColor,
}: DotProps) {
  const inputRange = [(index - 1) * 300, index * 300, (index + 1) * 300]

  const animatedStyle = useAnimatedStyle(() => {
    const size = interpolate(
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

    const backgroundColor =
      interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP) >
      0.5
        ? activeColor
        : inactiveColor

    return {
      width: size,
      height: size,
      opacity,
      backgroundColor,
    }
  })

  return <Animated.View style={[styles.dot, animatedStyle]} />
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
      {data.map((_, index) => (
        <Dot
          key={index}
          index={index}
          scrollX={scrollX}
          dotSize={dotSize}
          activeDotSize={activeDotSize}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
        />
      ))}
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

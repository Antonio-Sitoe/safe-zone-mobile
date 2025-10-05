import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import { OnboardingSlide as SlideType } from '@/@types/onBoard'

const { width } = Dimensions.get('window')

interface OnboardingSlideProps {
  item: SlideType
}

export function OnboardingSlide({ item }: OnboardingSlideProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 32,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
})

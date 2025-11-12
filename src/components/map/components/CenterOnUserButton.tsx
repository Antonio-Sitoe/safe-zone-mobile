import { memo } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type CenterOnUserButtonProps = {
  onPress: () => void
  isVisible: boolean
}

const CenterOnUserButtonComponent = ({
  onPress,
  isVisible,
}: CenterOnUserButtonProps) => {
  if (!isVisible) {
    return null
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.85}
    >
      <Ionicons name="locate" size={24} color="#10B981" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120,
    right: 16,
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
    borderRadius: 28,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})

export const CenterOnUserButton = memo(CenterOnUserButtonComponent)



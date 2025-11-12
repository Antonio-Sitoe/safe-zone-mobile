import { memo } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

type StyleToggleButtonProps = {
  isSatellite: boolean
  onToggle: () => void
  style?: StyleProp<ViewStyle>
}

const StyleToggleButtonComponent = ({
  isSatellite,
  onToggle,
  style,
}: StyleToggleButtonProps) => (
  <TouchableOpacity
    activeOpacity={0.85}
    style={[styles.container, style]}
    onPress={onToggle}
  >
    <Text style={styles.text}>{isSatellite ? 'Mapa' : 'Satélite'}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
})

export const StyleToggleButton = memo(StyleToggleButtonComponent)

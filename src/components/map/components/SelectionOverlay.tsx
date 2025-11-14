import { memo } from 'react'
import { View, StyleSheet, Text } from 'react-native'

interface SelectionOverlayProps {
  isSelectionMode: boolean
  zoneType: 'safe' | 'danger' | null
}

const SelectionOverlayComponent = ({
  isSelectionMode,
  zoneType,
}: SelectionOverlayProps) => {
  if (!isSelectionMode) {
    return null
  }

  const markerColor = zoneType === 'safe' ? '#2D9CDB' : '#F2994A'

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View style={styles.centerMarker}>
        <View
          style={[
            styles.markerPin,
            {
              backgroundColor: markerColor,
              borderColor: markerColor,
            },
          ]}
        >
          <View style={styles.markerInnerCircle} />
          <View style={styles.markerDot} />
        </View>
        <View style={styles.markerShadow} />
      </View>
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          Toque no mapa para selecionar a localização
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -24,
    marginLeft: -20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 48,
    zIndex: 1000,
  },
  markerPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerInnerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
  },
  markerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  markerShadow: {
    width: 20,
    height: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    marginTop: -5,
    opacity: 0.6,
  },
  instructionContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 100,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
})

export const SelectionOverlay = memo(SelectionOverlayComponent)

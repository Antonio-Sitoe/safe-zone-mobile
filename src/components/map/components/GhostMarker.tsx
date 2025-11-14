import { memo } from 'react'
import { View, StyleSheet } from 'react-native'
import MapboxGL from '@rnmapbox/maps'
import type { Coordinates } from '../types'

interface GhostMarkerProps {
  coordinate: Coordinates | null
  zoneType: 'safe' | 'danger' | null
}

const GhostMarkerComponent = ({ coordinate, zoneType }: GhostMarkerProps) => {
  if (!coordinate || !zoneType) {
    return null
  }

  const markerColor = zoneType === 'safe' ? '#2D9CDB' : '#F2994A'
  const markerBorderColor = zoneType === 'safe' ? '#1E7FA8' : '#C77A3D'

  return (
    <MapboxGL.PointAnnotation
      id="ghost-marker"
      coordinate={coordinate}
      anchor={{ x: 0.5, y: 1 }}
    >
      <View style={styles.markerContainer}>
        <View
          style={[
            styles.markerPin,
            {
              backgroundColor: markerColor,
              borderColor: markerBorderColor,
            },
          ]}
        >
          <View style={styles.markerInnerCircle} />
          <View style={[styles.markerDot, { backgroundColor: '#FFFFFF' }]} />
        </View>
        <View style={styles.markerShadow} />
      </View>
    </MapboxGL.PointAnnotation>
  )
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 48,
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
})

export const GhostMarker = memo(GhostMarkerComponent)


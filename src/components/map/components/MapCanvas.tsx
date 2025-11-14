import MapboxGL from '@rnmapbox/maps'
import { memo, forwardRef, useRef } from 'react'
import type { RefObject } from 'react'
import { StyleSheet, View } from 'react-native'
import type { FeatureCollection } from 'geojson'
import type { Coordinates } from '../types'
import MarkerSvg from '../marker.svg'
import { SelectionOverlay } from './SelectionOverlay'

type MapCanvasProps = {
  mapStyle: string
  cameraCoordinate: Coordinates
  zoomLevel: number
  onPress?: (event: { geometry: { coordinates: Coordinates } }) => void
  onLongPress: (event: { geometry: { coordinates: Coordinates } }) => void
  zoneShape?: FeatureCollection
  isZonesVisible: boolean
  userCoordinate: Coordinates | null
  cameraRef: RefObject<MapboxGL.Camera>
  selectedCoordinate: Coordinates | null
  ghostMarkerType: 'safe' | 'danger' | null
  isSelectionMode: boolean
  onGhostMarkerConfirm: (coordinate: Coordinates) => void
}

const MapCanvasComponent = forwardRef<MapboxGL.MapView, MapCanvasProps>(
  (
    {
      mapStyle,
      cameraCoordinate,
      zoomLevel,
      onPress,
      onLongPress,
      zoneShape,
      isZonesVisible,
      userCoordinate,
      cameraRef,
      selectedCoordinate,
      ghostMarkerType,
      isSelectionMode,
      onGhostMarkerConfirm,
    },
    ref
  ) => {
    const shapeSourceRef = useRef<MapboxGL.ShapeSource>(null)

    return (
      <View style={styles.container}>
        <MapboxGL.MapView
          ref={ref}
          style={styles.map}
          styleURL={mapStyle}
          attributionEnabled={false}
          logoEnabled={false}
          onPress={(feature) => {
            if (isSelectionMode) {
              if (feature.geometry.type === 'Point') {
                const coordinates = feature.geometry.coordinates as Coordinates
                onGhostMarkerConfirm(coordinates)
              }
              return
            }

            if (feature.geometry.type === 'Point' && onPress) {
              onPress({
                geometry: {
                  coordinates: feature.geometry.coordinates as Coordinates,
                },
              })
            }
          }}
          onLongPress={(feature) => {
            if (isSelectionMode) return
            if (feature.geometry.type === 'Point') {
              onLongPress({
                geometry: {
                  coordinates: feature.geometry.coordinates as Coordinates,
                },
              })
            }
          }}
        >
          <MapboxGL.Camera
            ref={cameraRef}
            centerCoordinate={cameraCoordinate}
            animationMode="flyTo"
            animationDuration={1200}
            zoomLevel={zoomLevel}
          />

          <MapboxGL.UserLocation visible androidRenderMode="gps" />

          {isZonesVisible && zoneShape && (
            <MapboxGL.ShapeSource
              ref={shapeSourceRef}
              id="zones"
              shape={zoneShape}
              cluster
              clusterRadius={50}
              clusterMaxZoomLevel={14}
              onPress={(feature) => {
                if (isSelectionMode) return

                // Type assertion to access properties
                const event = feature as unknown as {
                  properties?: {
                    cluster?: boolean
                    cluster_id?: number
                    point_count?: number
                  }
                  geometry?: {
                    type: string
                    coordinates: Coordinates
                  }
                }

                // Handle cluster click - zoom in
                if (event.properties?.cluster === true && event.geometry) {
                  const coordinates = event.geometry.coordinates

                  // Zoom in when clicking on a cluster
                  if (cameraRef.current) {
                    cameraRef.current.setCamera({
                      centerCoordinate: coordinates,
                      zoomLevel: Math.min(zoomLevel + 2, 18),
                      animationDuration: 500,
                    })
                  }
                  return
                }

                // Handle individual point click
                if (
                  onPress &&
                  event.geometry?.type === 'Point' &&
                  event.geometry.coordinates
                ) {
                  onPress({
                    geometry: {
                      coordinates: event.geometry.coordinates,
                    },
                  })
                }
              }}
            >
              {/* Cluster circles */}
              <MapboxGL.CircleLayer
                id="cluster-circles"
                belowLayerID="zone-circles"
                filter={['has', 'point_count']}
                style={clusterCircleStyle}
              />

              {/* Cluster labels */}
              <MapboxGL.SymbolLayer
                id="cluster-labels"
                belowLayerID="zone-labels"
                filter={['has', 'point_count']}
                style={clusterLabelStyle}
              />

              {/* Individual zone circles */}
              <MapboxGL.CircleLayer
                id="zone-circles"
                filter={['!', ['has', 'point_count']]}
                style={circleLayerStyle}
              />

              {/* Individual zone labels */}
              <MapboxGL.SymbolLayer
                id="zone-labels"
                filter={['!', ['has', 'point_count']]}
                style={symbolLayerStyle}
              />
            </MapboxGL.ShapeSource>
          )}

          {userCoordinate && (
            <MapboxGL.PointAnnotation
              id="user-location"
              coordinate={userCoordinate}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <MapboxGL.Callout title="Você está aqui!" />
            </MapboxGL.PointAnnotation>
          )}

          {selectedCoordinate && !isSelectionMode && (
            <MapboxGL.PointAnnotation
              id="selected-location"
              coordinate={selectedCoordinate}
              anchor={{ x: 0.5, y: 1 }}
            >
              <MarkerSvg width={32} height={48} />
            </MapboxGL.PointAnnotation>
          )}
        </MapboxGL.MapView>

        <SelectionOverlay
          isSelectionMode={isSelectionMode}
          zoneType={ghostMarkerType}
        />
      </View>
    )
  }
)

MapCanvasComponent.displayName = 'MapCanvas'

const circleLayerStyle: MapboxGL.CircleLayerStyle = {
  circleRadius: ['interpolate', ['linear'], ['zoom'], 5, 12, 10, 45, 14, 80],
  circleColor: [
    'match',
    ['get', 'displayType'],
    'SAFE',
    '#2D9CDB',
    'DANGER',
    '#F2994A',
    'CRITICAL',
    '#EB5757',
    '#BDBDBD',
  ],
  circleOpacity: [
    'match',
    ['get', 'displayType'],
    'SAFE',
    0.28,
    'DANGER',
    0.32,
    'CRITICAL',
    0.38,
    0.25,
  ],
  circleStrokeWidth: 1.2,
  circleStrokeColor: [
    'match',
    ['get', 'displayType'],
    'SAFE',
    '#2D9CDB',
    'DANGER',
    '#F2994A',
    'CRITICAL',
    '#EB5757',
    '#757575',
  ],
  circleStrokeOpacity: 0.9,
}

const symbolLayerStyle: MapboxGL.SymbolLayerStyle = {
  textField: ['get', 'slug'],
  textSize: 12,
  textColor: '#ffffff',
  textHaloColor: '#1c1c1c',
  textHaloWidth: 1,
  textAllowOverlap: true,
}

const clusterCircleStyle: MapboxGL.CircleLayerStyle = {
  circleRadius: [
    'step',
    ['get', 'point_count'],
    20, // Default radius for small clusters
    10, // If point_count >= 10
    30,
    50, // If point_count >= 50
    40,
    100, // If point_count >= 100
    50,
  ],
  circleColor: [
    'step',
    ['get', 'point_count'],
    '#2D9CDB', // Default color (blue)
    10,
    '#F2994A', // Orange for 10-49 points
    50,
    '#EB5757', // Red for 50+ points
  ],
  circleOpacity: 0.6,
  circleStrokeWidth: 2,
  circleStrokeColor: '#ffffff',
  circleStrokeOpacity: 0.9,
}

const clusterLabelStyle: MapboxGL.SymbolLayerStyle = {
  textField: ['get', 'point_count_abbreviated'],
  textSize: [
    'step',
    ['get', 'point_count'],
    12, // Default size
    10,
    14, // Larger for 10-49 points
    50,
    16, // Even larger for 50+ points
  ],
  textColor: '#ffffff',
  textHaloColor: '#1c1c1c',
  textHaloWidth: 2,
  textAllowOverlap: true,
  textIgnorePlacement: true,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
})

export const MapCanvas = memo(MapCanvasComponent)

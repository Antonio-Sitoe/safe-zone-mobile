import MapboxGL from "@rnmapbox/maps";
import { memo, forwardRef } from "react";
import type { RefObject } from "react";
import { StyleSheet, View } from "react-native";
import type { FeatureCollection } from "geojson";
import type { Coordinates } from "../types";
import MarkerSvg from "../marker.svg";
import { SelectionOverlay } from "./SelectionOverlay";

type MapCanvasProps = {
	mapStyle: string;
	cameraCoordinate: Coordinates;
	zoomLevel: number;
	onPress?: (event: { geometry: { coordinates: Coordinates } }) => void;
	onLongPress: (event: { geometry: { coordinates: Coordinates } }) => void;
	zoneShape?: FeatureCollection;
	isZonesVisible: boolean;
	userCoordinate: Coordinates | null;
	cameraRef: RefObject<any>;
	selectedCoordinate: Coordinates | null;
	ghostMarkerType: "safe" | "danger" | null;
	isSelectionMode: boolean;
	onGhostMarkerConfirm: (coordinate: Coordinates) => void;
};

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
	) => (
		<View style={styles.container}>
			<MapboxGL.MapView
				ref={ref}
				style={styles.map}
				styleURL={mapStyle}
				attributionEnabled={false}
				logoEnabled={false}
				onPress={(feature) => {
					if (isSelectionMode) {
						if (feature.geometry.type === "Point") {
							const coordinates = feature.geometry.coordinates as Coordinates;
							onGhostMarkerConfirm(coordinates);
						}
						return;
					}
					if (feature.geometry.type === "Point" && onPress) {
						onPress({
							geometry: {
								coordinates: feature.geometry.coordinates as Coordinates,
							},
						});
					}
				}}
				onLongPress={(feature) => {
					if (isSelectionMode) return;
					if (feature.geometry.type === "Point") {
						onLongPress({
							geometry: {
								coordinates: feature.geometry.coordinates as Coordinates,
							},
						});
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
					<MapboxGL.ShapeSource id="zones" shape={zoneShape}>
						<MapboxGL.CircleLayer id="zone-circles" style={circleLayerStyle} />
						<MapboxGL.SymbolLayer id="zone-labels" style={symbolLayerStyle} />
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
);

MapCanvasComponent.displayName = "MapCanvas";

const circleLayerStyle: MapboxGL.CircleLayerStyle = {
	circleRadius: ["interpolate", ["linear"], ["zoom"], 5, 12, 10, 45, 14, 80],
	circleColor: [
		"match",
		["get", "displayType"],
		"SAFE",
		"#2D9CDB",
		"DANGER",
		"#F2994A",
		"CRITICAL",
		"#EB5757",
		"#BDBDBD",
	],
	circleOpacity: [
		"match",
		["get", "displayType"],
		"SAFE",
		0.28,
		"DANGER",
		0.32,
		"CRITICAL",
		0.38,
		0.25,
	],
	circleStrokeWidth: 1.2,
	circleStrokeColor: [
		"match",
		["get", "displayType"],
		"SAFE",
		"#2D9CDB",
		"DANGER",
		"#F2994A",
		"CRITICAL",
		"#EB5757",
		"#757575",
	],
	circleStrokeOpacity: 0.9,
};

const symbolLayerStyle: MapboxGL.SymbolLayerStyle = {
	textField: ["get", "slug"],
	textSize: 12,
	textColor: "#ffffff",
	textHaloColor: "#1c1c1c",
	textHaloWidth: 1,
	textAllowOverlap: true,
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		flex: 1,
	},
});

export const MapCanvas = memo(MapCanvasComponent);

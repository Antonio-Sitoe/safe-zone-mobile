import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform, View, Alert } from "react-native";

import { DEFAULT_COORDINATE, parseReports, mapZoneToFeatureCollection } from "./utils";

import MapboxGL from "@rnmapbox/maps";
import * as Location from "expo-location";
import { useAuthStore } from "@/contexts/auth-store";
import { env } from "@/lib/env";
import { MapCanvas } from "./components/MapCanvas";
import { ZoneModal } from "./components/ZoneModal";
import { ZonesSheet } from "./components/zone-list-section";
import { CreateZoneSheet } from "./components/CreateZoneSheet";
import { PermissionOverlay } from "./components/PermissionOverlay";
import { StyleToggleButton } from "./components/StyleToggleButton";
import { CenterOnUserButton } from "./components/CenterOnUserButton";
import type { SafeZoneData } from "@/@types/area";
import { getAllZones } from "@/actions/zone";
import { useQuery } from "@tanstack/react-query";
import type { Coordinates, Zone, ZoneType } from "./types";
import {
	useCreateZoneMutation,
	useUpdateZoneMutation,
	useDeleteZoneMutation,
} from "@/react-query/zone/zoneMutations";
import type { CreateZoneSchema } from "@/@types/Zone";
import { CreateAndEditArea } from "../modal/create-and-edit-area";
import slugify from "slugify";
import { MapTabBarContainer } from "./components/map-tab-bar-container";

MapboxGL.setAccessToken(env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN);

export default function MapComponent() {
	const { user } = useAuthStore();

	const { data: zonesData, refetch: refetchZones } = useQuery({
		queryKey: ["zones", "all"],
		queryFn: async () => await getAllZones(),
	});

	const createZoneMutation = useCreateZoneMutation();
	const updateZoneMutation = useUpdateZoneMutation();
	const deleteZoneMutation = useDeleteZoneMutation();

	const zonesFromBackend = useMemo(() => {
		return zonesData?.data || [];
	}, [zonesData?.data]);

	console.log(zonesFromBackend);

	const cameraRef = useRef<MapboxGL.Camera | null>(null);
	const mapViewRef = useRef<MapboxGL.MapView | null>(null);

	const [isCheckingPermission, setIsCheckingPermission] = useState(true);
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [userCoordinate, setUserCoordinate] = useState<Coordinates | null>(null);
	const [mapStyle, setMapStyle] = useState<string>(MapboxGL.StyleURL.SatelliteStreet);
	const [zones, setZones] = useState<Zone[]>([]);
	const [isZoneModalVisible, setZoneModalVisible] = useState(false);
	const [pendingCoordinate, setPendingCoordinate] = useState<Coordinates | null>(null);
	const [zoneDescription, setZoneDescription] = useState("");
	const [zoneReports, setZoneReports] = useState("0");
	const [zoneType, setZoneType] = useState<ZoneType>("SAFE");
	const [editingZoneSlug, setEditingZoneSlug] = useState<string | null>(null);
	const [selectedLocationName, setSelectedLocationName] = useState<string | null>(null);
	const [isZonesSheetOpen, setZonesSheetOpen] = useState(false);
	const [isCreateZoneSheetOpen, setCreateZoneSheetOpen] = useState(false);
	const [isCreateAreaVisible, setCreateAreaVisible] = useState(false);
	const [createAreaVariant, setCreateAreaVariant] = useState<"safe" | "danger">("safe");
	const [isSelectionMode, setIsSelectionMode] = useState(false);
	const [ghostMarkerCoordinate, setGhostMarkerCoordinate] = useState<Coordinates | null>(null);
	const [ghostMarkerType, setGhostMarkerType] = useState<"safe" | "danger" | null>(null);

	const toggleMapStyle = useCallback(() => {
		setMapStyle((current) =>
			current === MapboxGL.StyleURL.SatelliteStreet
				? MapboxGL.StyleURL.Street
				: MapboxGL.StyleURL.SatelliteStreet
		);
	}, []);

	const resetZoneForm = useCallback(() => {
		setPendingCoordinate(null);
		setZoneDescription("");
		setZoneReports("0");
		setZoneType("SAFE");
		setEditingZoneSlug(null);
		setZoneModalVisible(false);
		setSelectedLocationName(null);
		setIsSelectionMode(false);
		setGhostMarkerCoordinate(null);
		setGhostMarkerType(null);
	}, []);

	useEffect(() => {
		if (zonesFromBackend.length > 0) {
			const mappedZones = zonesFromBackend.map((zone: any) => ({
				slug: zone.slug || zone.id || "",
				date: zone.date,
				hour: zone.hour,
				description: zone.description,
				type: zone.type as ZoneType,
				reports: zone.reports ?? 0,
				coordinates: {
					latitude: zone.latitude,
					longitude: zone.longitude,
				},
				geom: {
					x: zone.longitude,
					y: zone.latitude,
				},
				createdBy: zone.userId,
				id: zone.id,
			}));
			setZones(mappedZones);
		}
	}, [zonesFromBackend, setZones]);

	useEffect(() => {
		let isMounted = true;

		const requestPermissionsAndLocation = async () => {
			try {
				if (Platform.OS === "android") {
					await MapboxGL.requestAndroidLocationPermissions();
				}

				const { status } = await Location.requestForegroundPermissionsAsync();
				if (!isMounted) return;

				const granted = status === "granted";
				setHasPermission(granted);

				if (!granted) {
					setIsCheckingPermission(false);
					return;
				}

				const currentLocation = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.High,
				});

				if (!isMounted) return;

				setUserCoordinate([currentLocation.coords.longitude, currentLocation.coords.latitude]);
				setIsCheckingPermission(false);
			} catch (error) {
				console.warn("Erro a obter localização do utilizador:", error);
				if (isMounted) {
					setHasPermission(false);
					setIsCheckingPermission(false);
				}
			}
		};

		requestPermissionsAndLocation();

		return () => {
			isMounted = false;
		};
	}, []);

	const cameraCoordinate = useMemo<Coordinates>(
		() => userCoordinate ?? DEFAULT_COORDINATE,
		[userCoordinate]
	);

	const zoomLevel = userCoordinate ? 15 : 4;
	const isSatelliteStyle = mapStyle === MapboxGL.StyleURL.SatelliteStreet;

	const zoneFeatureCollection = useMemo(() => {
		return mapZoneToFeatureCollection(zones);
	}, [zones]);

	const handleMapLongPress = (event: { geometry: { coordinates: Coordinates } }) => {
		setZonesSheetOpen(false);
		const [longitude, latitude] = event.geometry.coordinates;
		setPendingCoordinate([longitude, latitude]);
		setZoneDescription("");
		setZoneReports("0");
		setZoneType("SAFE");
		setEditingZoneSlug(null);
		setSelectedLocationName(null);
		setZoneModalVisible(false);
		setCreateAreaVariant("safe");
		setCreateAreaVisible(false);
		setCreateZoneSheetOpen(true);
	};

	const handleCloseZoneModal = () => {
		resetZoneForm();
	};

	const handleSaveZone = async () => {
		if (!pendingCoordinate) {
			Alert.alert(
				"Coordenadas não definidas",
				"Toque e segure no mapa para escolher a localização da zona."
			);
			return;
		}

		if (!zoneDescription.trim()) {
			Alert.alert("Descrição obrigatória", "Adicione uma descrição para identificar a zona.");
			return;
		}

		const reportsValue = parseReports(zoneReports);
		const baseType: ZoneType = reportsValue >= 10 ? "CRITICAL" : (zoneType ?? "SAFE");

		const now = new Date();

		if (editingZoneSlug) {
			const zoneToEdit = zones.find((z) => z.slug === editingZoneSlug);

			if (!zoneToEdit) {
				Alert.alert("Erro", "Zona não encontrada.");
				return;
			}

			if (!zoneToEdit.id) {
				Alert.alert("Erro", "Zona não possui ID válido.");
				return;
			}

			if (zoneToEdit.createdBy !== user?.id) {
				Alert.alert("Ação não permitida", "Só é possível editar zonas que criaste.");
				return;
			}

			const backendType: "SAFE" | "DANGER" =
				baseType === "CRITICAL" ? "DANGER" : baseType === "DANGER" ? "DANGER" : "SAFE";

			const updatedZones = zones.map((zone) =>
				zone.id === zoneToEdit.id
					? {
							...zone,
							description: zoneDescription.trim(),
							type: baseType,
							date: now.toISOString().split("T")[0],
							hour: now.toTimeString().slice(0, 5),
							coordinates: {
								latitude: pendingCoordinate[1],
								longitude: pendingCoordinate[0],
							},
							geom: {
								x: pendingCoordinate[0],
								y: pendingCoordinate[1],
							},
						}
					: zone
			);
			setZones(updatedZones);
			handleCloseZoneModal();

			const updatePayload: Partial<CreateZoneSchema> = {
				description: zoneDescription.trim(),
				type: backendType,
				date: now.toISOString().split("T")[0],
				hour: now.toTimeString().slice(0, 5),
				coordinates: {
					latitude: pendingCoordinate[1],
					longitude: pendingCoordinate[0],
				},
				geom: {
					x: pendingCoordinate[0],
					y: pendingCoordinate[1],
				},
			};

			updateZoneMutation
				.mutateAsync({
					id: zoneToEdit.id,
					data: updatePayload,
				})
				.then(() => {
					refetchZones();
				})
				.catch((error) => {
					console.error("❌ Erro ao atualizar zona no backend:", error);
					setZones(zones);
				});
			return;
		}

		const backendType: "SAFE" | "DANGER" =
			baseType === "CRITICAL" ? "DANGER" : baseType === "DANGER" ? "DANGER" : "SAFE";

		const tempId = `temp-${now.getTime()}`;
		const slug =
			slugify(zoneDescription || "zona", {
				lower: true,
				strict: true,
				trim: true,
				locale: "pt",
			}) || `zona-${now.getTime()}`;
		const optimisticZone: Zone = {
			id: tempId,
			slug,
			date: now.toISOString().split("T")[0],
			hour: now.toTimeString().slice(0, 5),
			description: zoneDescription.trim(),
			type: baseType,
			reports: reportsValue,
			coordinates: {
				latitude: pendingCoordinate[1],
				longitude: pendingCoordinate[0],
			},
			geom: {
				x: pendingCoordinate[0],
				y: pendingCoordinate[1],
			},
			createdBy: user?.id || "unknown",
		};

		setZones([...zones, optimisticZone]);
		handleCloseZoneModal();

		const zonePayload: CreateZoneSchema = {
			slug,
			date: optimisticZone.date!,
			hour: optimisticZone.hour!,
			description: optimisticZone.description!,
			type: backendType,
			coordinates: {
				latitude: pendingCoordinate[1],
				longitude: pendingCoordinate[0],
			},
			geom: {
				x: pendingCoordinate[0],
				y: pendingCoordinate[1],
			},
			featureDetails: {
				goodLighting: false,
				policePresence: false,
				publicTransport: false,
				insufficientLighting: backendType === "DANGER",
				lackOfPolicing: backendType === "DANGER",
				abandonedHouses: false,
			},
		};

		createZoneMutation
			.mutateAsync(zonePayload)
			.then(() => {
				refetchZones();
			})
			.catch((error: any) => {
				console.error("❌ Erro ao criar zona no backend:", error);
				setZones((prev) => prev.filter((z) => z.id !== tempId));
			});
	};

	const handleEditZone = (zone: Zone) => {
		if (zone.createdBy !== user?.id) {
			Alert.alert("Ação não permitida", "Só podes editar zonas que criaste.");
			return;
		}

		setEditingZoneSlug(zone.slug);
		setPendingCoordinate([
			zone.geom?.x ?? zone.coordinates?.longitude,
			zone.geom?.y ?? zone.coordinates?.latitude,
		]);
		setZoneDescription(zone.description || "");
		setZoneReports(String(zone.reports ?? 0));
		setZoneType(zone.type);
		setZoneModalVisible(true);
	};

	const handleCloseCreateZoneSheet = () => {
		setCreateZoneSheetOpen(false);
		setCreateAreaVisible(false);
		setPendingCoordinate(null);
	};

	const handleSelectCreateZone = (variant: "safe" | "danger") => {
		if (!pendingCoordinate) {
			setCreateZoneSheetOpen(false);
			return;
		}

		setCreateAreaVariant(variant);
		setZoneType(variant === "danger" ? "DANGER" : "SAFE");
		setCreateZoneSheetOpen(false);
		setCreateAreaVisible(true);
	};

	const handleCloseCreateArea = () => {
		setCreateAreaVisible(false);
		setCreateZoneSheetOpen(false);
		setPendingCoordinate(null);
		setZoneDescription("");
		setZoneReports("0");
		setZoneType("SAFE");
		setEditingZoneSlug(null);
		setIsSelectionMode(false);
		setGhostMarkerCoordinate(null);
		setGhostMarkerType(null);
	};

	const handleCreateSafeZone = useCallback(() => {
		setZonesSheetOpen(false);
		setIsSelectionMode(true);
		setGhostMarkerType("safe");
		setCreateAreaVariant("safe");
		setZoneType("SAFE");
		setGhostMarkerCoordinate(cameraCoordinate);
	}, [cameraCoordinate]);

	const handleCreateDangerZone = useCallback(() => {
		setZonesSheetOpen(false);
		setIsSelectionMode(true);
		setGhostMarkerType("danger");
		setCreateAreaVariant("danger");
		setZoneType("DANGER");
		setGhostMarkerCoordinate(cameraCoordinate);
	}, [cameraCoordinate]);

	const handleGhostMarkerConfirm = useCallback((coordinate: Coordinates) => {
		setPendingCoordinate(coordinate);
		setGhostMarkerCoordinate(null);
		setIsSelectionMode(false);
		setCreateAreaVisible(true);
		setSelectedLocationName(null);
	}, []);

	const handleSaveCreateArea = (data: SafeZoneData) => {
		if (!pendingCoordinate) {
			Alert.alert(
				"Coordenadas não definidas",
				"Toque e segure no mapa para escolher a localização da zona."
			);
			return;
		}

		const [longitude, latitude] = pendingCoordinate;
		const now = new Date();
		const zoneDate = data.date || now.toISOString().split("T")[0];
		const zoneHour = data.time || now.toTimeString().slice(0, 5);
		const zoneTypeValue: "SAFE" | "DANGER" = createAreaVariant === "danger" ? "DANGER" : "SAFE";
		const zoneTypeLocal: ZoneType = zoneTypeValue;

		const tempId = `temp-${now.getTime()}`;
		const optimisticZone: Zone = {
			id: tempId,
			slug: data.slug || `zona-${now.getTime()}`,
			date: zoneDate,
			hour: zoneHour,
			description: data.description.trim(),
			type: zoneTypeLocal,
			reports: zoneTypeValue === "DANGER" ? 1 : 0,
			coordinates: {
				latitude,
				longitude,
			},
			geom: {
				x: longitude,
				y: latitude,
			},
			createdBy: user?.id || "unknown",
		};

		setZones([...zones, optimisticZone]);
		setCreateAreaVisible(false);
		setPendingCoordinate(null);
		setZoneDescription("");
		setZoneReports("0");
		setZoneType("SAFE");
		setEditingZoneSlug(null);
		setSelectedLocationName(data.location || null);

		const zonePayload: CreateZoneSchema = {
			slug: optimisticZone.slug,
			date: zoneDate,
			hour: zoneHour,
			description: data.description.trim(),
			type: zoneTypeValue,
			coordinates: {
				latitude,
				longitude,
			},
			geom: {
				x: longitude,
				y: latitude,
			},
			featureDetails: {
				goodLighting: data.characteristics?.goodLighting || false,
				policePresence: data.characteristics?.policePresence || false,
				publicTransport: data.characteristics?.publicTransport || false,
				insufficientLighting: !data.characteristics?.goodLighting || false,
				lackOfPolicing: !data.characteristics?.policePresence || false,
				abandonedHouses: false,
			},
		};

		createZoneMutation
			.mutateAsync(zonePayload)
			.then(() => {
				refetchZones();
			})
			.catch((error: any) => {
				console.error("❌ Erro ao criar zona no backend:", error);
				setZones((prev) => prev.filter((z) => z.id !== tempId));
			});
	};

	const requestDeleteZone = (zone: Zone) => {
		if (zone.createdBy !== user?.id) {
			Alert.alert("Ação não permitida", "Só podes eliminar zonas que criaste.");
			return;
		}

		if (!zone.id) {
			Alert.alert("Erro", "Zona não possui ID válido.");
			return;
		}

		Alert.alert(
			"Eliminar zona",
			`Tens a certeza que queres eliminar ${zone.description || "esta zona"}?`,
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Eliminar",
					style: "destructive",
					onPress: () => {
						const filteredZones = zones.filter((z) => z.id !== zone.id);
						setZones(filteredZones);

						deleteZoneMutation
							.mutateAsync(zone.id!)
							.then(() => {
								refetchZones();
							})
							.catch((error) => {
								console.error("❌ Erro ao eliminar zona no backend:", error);
								setZones(zones);
							});
					},
				},
			]
		);
	};

	const flyToCoordinate = ([longitude, latitude]: Coordinates) => {
		cameraRef.current?.setCamera({
			centerCoordinate: [longitude, latitude],
			zoomLevel: 14,
			animationDuration: 1200,
		});
	};

	const handleCenterOnUser = () => {
		if (userCoordinate && cameraRef.current) {
			cameraRef.current.setCamera({
				centerCoordinate: userCoordinate,
				zoomLevel: 15,
				animationDuration: 1000,
			});
		}
	};

	const createAreaLocation = useMemo(() => {
		if (!pendingCoordinate) {
			return null;
		}

		const [longitude, latitude] = pendingCoordinate;
		return {
			name: selectedLocationName ?? `Lat ${latitude.toFixed(5)}, Lng ${longitude.toFixed(5)}`,
			latitude,
			longitude,
		};
	}, [pendingCoordinate, selectedLocationName]);

	useEffect(() => {
		if (pendingCoordinate) {
			setZonesSheetOpen(false);
		}
	}, [pendingCoordinate, setZonesSheetOpen]);

	useEffect(() => {
		if (!isSelectionMode) {
			setGhostMarkerCoordinate(null);
			setGhostMarkerType(null);
		} else if (isSelectionMode && !ghostMarkerCoordinate) {
			setGhostMarkerCoordinate(cameraCoordinate);
		}
	}, [isSelectionMode, cameraCoordinate, ghostMarkerCoordinate]);

	return (
		<View className="flex-1 bg-black">
			<MapCanvas
				ref={mapViewRef}
				mapStyle={mapStyle}
				zoomLevel={zoomLevel}
				cameraRef={cameraRef}
				userCoordinate={userCoordinate}
				onLongPress={handleMapLongPress}
				zoneShape={zoneFeatureCollection}
				isZonesVisible={zones.length > 0}
				cameraCoordinate={cameraCoordinate}
				selectedCoordinate={pendingCoordinate || null}
				ghostMarkerType={ghostMarkerType}
				isSelectionMode={isSelectionMode}
				onGhostMarkerConfirm={handleGhostMarkerConfirm}
			/>

			<View className="absolute top-8 right-6 flex-row gap-3">
				<StyleToggleButton
					isSatellite={isSatelliteStyle}
					onToggle={toggleMapStyle}
					className="rounded-full bg-black/70 px-4 py-2.5"
				/>
			</View>

			<PermissionOverlay isChecking={isCheckingPermission} hasPermission={hasPermission} />

			<CenterOnUserButton onPress={handleCenterOnUser} isVisible={!!userCoordinate} />
			{!pendingCoordinate && !isZonesSheetOpen && !isSelectionMode && (
				<MapTabBarContainer
					totalZones={zones.length}
					handleShowList={() => setZonesSheetOpen(true)}
					onCreateSafeZone={handleCreateSafeZone}
					onCreateDangerZone={handleCreateDangerZone}
				/>
			)}

			<ZonesSheet
				isOpen={isZonesSheetOpen && !pendingCoordinate}
				currentUserId={user?.id || null}
				onClose={() => setZonesSheetOpen(false)}
				onLocate={flyToCoordinate}
				onEdit={handleEditZone}
				onDelete={requestDeleteZone}
			/>

			<CreateZoneSheet
				isOpen={isCreateZoneSheetOpen}
				onClose={handleCloseCreateZoneSheet}
				onSelect={handleSelectCreateZone}
				coordinate={pendingCoordinate}
			/>

			<ZoneModal
				visible={isZoneModalVisible}
				pendingCoordinate={pendingCoordinate}
				zoneDescription={zoneDescription}
				zoneReports={zoneReports}
				zoneType={zoneType}
				editingZoneSlug={editingZoneSlug}
				onChangeDescription={setZoneDescription}
				onChangeReports={setZoneReports}
				onSelectType={setZoneType}
				onRequestClose={handleCloseZoneModal}
				onSave={handleSaveZone}
			/>

			<CreateAndEditArea
				variant={createAreaVariant}
				visible={isCreateAreaVisible}
				onClose={handleCloseCreateArea}
				location={createAreaLocation || { name: "" }}
				// @ts-ignore
				onSave={handleSaveCreateArea}
			/>
		</View>
	);
}

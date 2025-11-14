import "dotenv/config";

export default {
	expo: {
		name: "Mapa Seguro",
		slug: "safe-zone",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./src/assets/images/icon.png",
		scheme: "safezone",
		userInterfaceStyle: "automatic",
		newArchEnabled: true,
		ios: {
			supportsTablet: true,
			bundleIdentifier: "com.antoniositoe533.safezone",
		},
		android: {
			adaptiveIcon: {
				backgroundColor: "#E6F4FE",
				foregroundImage: "./src/assets/images/android-icon-foreground.png",
				backgroundImage: "./src/assets/images/android-icon-background.png",
				monochromeImage: "./src/assets/images/android-icon-monochrome.png",
			},
			edgeToEdgeEnabled: true,
			predictiveBackGestureEnabled: false,
			package: "com.antoniositoe533.safezone",
			permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
		},
		web: {
			output: "static",
			favicon: "./src/assets/images/favicon.png",
		},
		plugins: [
			"expo-router",
			"expo-web-browser",
			[
				"@rnmapbox/maps",
				{
					android: {
						accessToken:
							"sk.eyJ1IjoidWJpbW96IiwiYSI6ImNtMHV5dnU3ajE2bjYycXMwcGEycWU1dDEifQ.-Jz3Qd2fwJeaz0L4o8Km7A",
					},
				},
			],
			[
				"expo-location",
				{
					locationAlwaysAndWhenInUsePermission:
						"Permitir $(PRODUCT_NAME) usar sua localização para mostrar sua posição no mapa e zonas seguras/perigosas próximas.",
					locationAlwaysPermission:
						"Permitir $(PRODUCT_NAME) usar sua localização em segundo plano para alertas de segurança.",
					locationWhenInUsePermission:
						"Permitir $(PRODUCT_NAME) usar sua localização para mostrar sua posição no mapa.",
				},
			],
			[
				"expo-splash-screen",
				{
					image: "./src/assets/images/splash-icon.png",
					imageWidth: 200,
					resizeMode: "contain",
					backgroundColor: "#1F346C",
					dark: {
						backgroundColor: "#1F346C",
					},
				},
			],
			"expo-font",
		],
		experiments: {
			typedRoutes: true,
			reactCompiler: true,
		},
	},
};

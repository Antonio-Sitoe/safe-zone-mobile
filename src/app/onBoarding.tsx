/** biome-ignore-all lint/correctness/noNestedComponentDefinitions: ESLint */
import Animated, {
	useSharedValue,
	useDerivedValue,
	useAnimatedStyle,
	withTiming,
	interpolate,
	Easing,
} from "react-native-reanimated";
import { useCallback, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, useWindowDimensions, StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";
import Shape2 from "@/assets/shapes2.svg";
import { RFValue } from "react-native-responsive-fontsize";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "@/contexts/auth-store";

import Onboard1 from "@/assets/slide/slide-1.svg";
import Onboard2 from "@/assets/slide/slide-2.svg";
import Onboard3 from "@/assets/slide/slide-3.svg";

const AUTO_PLAY_INTERVAL = 4000;

const onboardingData = [
	{
		id: 1,
		title: "Aqui Estão Algumas Dicas Essenciais Para Aproveitar Ao Máximo",
		subtitle: "Personalize Quem Pode Ver Sua Localização Para Garantir Sua Privacidade.",
		icon: Onboard1,
	},
	{
		id: 2,
		title: "Navegação Consciente",
		subtitle: "Antes De Sair, Confira As Áreas De Risco E Escolha Rotas Seguras.",
		icon: Onboard2,
	},
	{
		id: 3,
		title: "Botão De Emergência Rápida",
		subtitle:
			"Configure O Botão De Emergência Para Ligar Rapidamente Para Contatos Específicos Ou A Polícia.",
		icon: Onboard3,
	},
];

export default function OnboardingScreen() {
	const { width, height } = useWindowDimensions();
	const pagerRef = useRef<PagerView | null>(null);
	const { hasCompletedOnboarding, completeOnboarding } = useAuthStore();

	const progress = useSharedValue(0);

	const autoplayRef = useRef<number | null>(null);

	const clearAutoplay = useCallback(() => {
		if (autoplayRef.current) {
			clearInterval(autoplayRef.current);
			autoplayRef.current = null;
		}
	}, []);

	const startAutoplay = () => {
		clearAutoplay();
		let currentIndex = 0;
		autoplayRef.current = setInterval(() => {
			const next = currentIndex < onboardingData.length - 1 ? currentIndex + 1 : currentIndex;
			if (next !== currentIndex) {
				pagerRef.current?.setPage(next);
				progress.value = withTiming(next, {
					duration: 400,
					easing: Easing.out(Easing.cubic),
				});
				currentIndex = next;
			} else {
				clearAutoplay();
			}
		}, AUTO_PLAY_INTERVAL);
	};

	useEffect(() => {
		if (!hasCompletedOnboarding) {
			startAutoplay();
		}
		return () => {
			clearAutoplay();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasCompletedOnboarding]);

	const handleCreateAccount = () => {
		clearAutoplay();
		completeOnboarding();
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:linting
	useEffect(() => {
		return () => {
			clearAutoplay();
			progress.value = 0;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clearAutoplay]);

	const onPageScroll = (e: any) => {
		const { position, offset } = e.nativeEvent;
		progress.value = position + offset;
	};

	const onPageSelected = (e: any) => {
		const page = e.nativeEvent.position;
		progress.value = withTiming(page, {
			duration: 400,
			easing: Easing.out(Easing.cubic),
		});
		if (page < onboardingData.length - 1) {
			startAutoplay();
		} else {
			clearAutoplay();
		}
	};

	const AnimatedTitle = ({ index }: { index: number }) => {
		const distance = useDerivedValue(() => Math.abs(progress.value - index));
		const style = useAnimatedStyle(() => {
			const opacity = interpolate(distance.value, [0, 0.8], [1, 0]);
			return { opacity };
		});
		return (
			<Animated.Text
				style={[
					style,
					{
						fontSize: RFValue(20, height),
						color: "#0f172a",
						lineHeight: RFValue(28, height),
						textAlign: "center",
						fontWeight: "700",
						paddingHorizontal: 16,
					},
				]}
				accessibilityRole="header"
			>
				{onboardingData[index].title}
			</Animated.Text>
		);
	};

	const AnimatedSubtitle = ({ index }: { index: number }) => {
		const distance = useDerivedValue(() => Math.abs(progress.value - index));
		const style = useAnimatedStyle(() => {
			const opacity = interpolate(distance.value, [0, 0.8], [1, 0]);
			return { opacity };
		});
		return (
			<Animated.Text
				style={[
					style,
					{
						fontSize: RFValue(14, height),
						color: "#64748b",
						marginBottom: 15,
						lineHeight: RFValue(20, height),
						textAlign: "center",
						paddingHorizontal: 24,
					},
				]}
			>
				{onboardingData[index].subtitle}
			</Animated.Text>
		);
	};

	const IllustrationComponent = ({ index }: { index: number }) => {
		const Icon = onboardingData[index].icon;
		const distance = useDerivedValue(() => Math.abs(progress.value - index));

		const style = useAnimatedStyle(() => {
			const opacity = interpolate(distance.value, [0, 0.5], [1, 0.3]);
			return { opacity };
		});

		const iconSize = Math.min(width * 0.65, 360);

		return (
			<Animated.View style={[style, { alignItems: "center", justifyContent: "center" }]}>
				<View
					className="items-center justify-center"
					style={{
						width: iconSize,
						height: iconSize,
						backgroundColor: "transparent",
					}}
				>
					<Icon width={iconSize * 0.96} height={iconSize * 0.96} />
				</View>
			</Animated.View>
		);
	};

	const Indicator = ({ index }: { index: number }) => {
		const derived = useDerivedValue(() => Math.abs(progress.value - index));
		const style = useAnimatedStyle(() => {
			const d = derived.value;
			const isActive = d < 0.5;
			return {
				width: isActive ? 24 : 8,
				height: 8,
				borderRadius: 4,
				marginHorizontal: 4,
				marginBottom: 14,
				backgroundColor: isActive ? "#12224a" : "#cbd5e1",
				opacity: interpolate(d, [0, 1], [1, 0.6]),
			};
		});
		return <Animated.View style={style} />;
	};

	const PageIndicator = () => (
		<View className="flex-row items-center justify-center" style={styles.indicatorContainer}>
			{onboardingData.map((_, i) => (
				<Indicator key={i} index={i} />
			))}
		</View>
	);

	return (
		<View style={styles.container}>
			<StatusBar style="dark" backgroundColor="#ffffff" />

			<PagerView
				ref={pagerRef}
				style={{ flex: 1 }}
				initialPage={0}
				onPageScroll={onPageScroll}
				onPageSelected={onPageSelected}
				offscreenPageLimit={2}
			>
				{onboardingData.map((item, index) => (
					<View key={item.id} style={styles.page}>
						<View style={styles.topTextWrap}>
							<AnimatedTitle index={index} />
						</View>

						<View style={styles.illustrationWrap}>
							<IllustrationComponent index={index} />
						</View>
						<View>
							<Shape2
								style={{
									position: "absolute",
									bottom: 0,
									left: 153,
									transform: [{ rotate: "180deg" }],
								}}
							/>
							<Shape2 style={{ position: "absolute", bottom: 300, right: 155 }} />
							<Shape2 style={{ position: "absolute", bottom: -300, right: 155 }} />
						</View>
						<View style={styles.bottomWrap}>
							<AnimatedSubtitle index={index} />

							<PageIndicator />

							{index === onboardingData.length - 1 && (
								<View style={styles.lastButtonsWrap}>
									<TouchableOpacity
										onPress={handleCreateAccount}
										className="rounded-full items-center justify-center"
										style={[
											styles.primaryButton,
											{ paddingVertical: Math.max(14, height * 0.018) },
										]}
									>
										<Text style={[styles.primaryButtonText, { fontSize: RFValue(16, height) }]}>
											Começar
										</Text>
									</TouchableOpacity>
								</View>
							)}
						</View>
					</View>
				))}
			</PagerView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#ffffff" },
	loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
	page: {
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	topTextWrap: {
		width: "100%",
		paddingTop: 40,
		alignItems: "center",
		justifyContent: "flex-start",
	},
	illustrationWrap: {
		flex: 1,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	bottomWrap: {
		width: "100%",
		alignItems: "center",
		paddingBottom: 40,
	},
	indicatorContainer: {
		marginTop: 24,
	},
	primaryButton: {
		backgroundColor: "#1F346C",
		borderRadius: 999,
		paddingHorizontal: 32,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		marginBottom: 12,
		width: "85%",
		alignSelf: "center",
	},
	primaryButtonText: {
		color: "#fff",
		fontWeight: "800",
		textAlign: "center",
	},
	secondaryText: {
		textAlign: "center",
		color: "#475569",
		fontWeight: "600",
		fontSize: RFValue(14, 800),
	},
	lastButtonsWrap: {
		marginTop: 24,
		width: "100%",
		alignItems: "center",
	},
});

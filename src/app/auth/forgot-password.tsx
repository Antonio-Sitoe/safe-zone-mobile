import {
	View,
	Text,
	ScrollView,
	Pressable,
	Alert,
	TouchableWithoutFeedback,
	Keyboard,
	KeyboardAvoidingView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { Input, InputField } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import BackgroundLogoSvgBlue from "@/assets/logo-blue.svg";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { authClient } from "@/lib/auth";
import { AxiosError } from "axios";

const forgotPasswordSchema = z.object({
	email: z.email({ error: "Email inválido" }).min(1, "Email é obrigatório"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

		const onSubmit = async (_data: ForgotPasswordFormData) => {
		try {
			if (authClient) {
				const { data, error } = await authClient.requestPasswordReset({
					email: _data.email,
					redirectTo: "safezone://auth/reset-password?token={token}",
				});

				if (error) {
					throw new Error(error.message);
				}

				if (data) {
					Alert.alert("Sucesso!", "Email de recuperação enviado! Verifique sua caixa de entrada.", [
						{
							text: "OK",
							onPress: () => router.back(),
						},
					]);
				}
			}
		} catch (error) {
			console.log("Forgot password error:", error);
			const message =
				error instanceof AxiosError
					? error.response?.data?.message
					: error instanceof Error
						? error.message
						: "Não foi possível enviar o email. Tente novamente.";

			Alert.alert("Erro", message || "Não foi possível enviar o email. Tente novamente.");
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} className="relative">
				<KeyboardAvoidingView behavior="padding" className="bg-white flex-1 relative" enabled>
					<StatusBar style="auto" backgroundColor="#fff" animated={true} />
					<ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}>
						<View className="flex-1 flex-col justify-between px-6 pt-12 pb-8 space-y-8">
							<View className="mb-8 w-full">
								<View className=" mb-8">
									<Pressable
										onPress={() => router.back()}
										className="mr-4 p-2 flex-row items-center"
									>
										<Entypo name="chevron-left" size={24} color="black" />
										<Text className="text-sm font-montserrat text-gray-700">Voltar</Text>
									</Pressable>
								</View>
								<View className="flex-row items-center mx-auto">
									<BackgroundLogoSvgBlue width={249} height={48} />
								</View>
							</View>

							<View className="space-y-4 flex-1 flex-col gap-4">
								<Text className="text-xl font-montserrat font-bold text-gray-700 mb-1">
									Recuperar Senha
								</Text>
								<Text className="text-sm font-montserrat text-gray-600 mb-4">
									Digite seu email para receber as instruções de recuperação de senha.
								</Text>

								<View>
									<Controller
										control={control}
										name="email"
										render={({ field: { onChange, onBlur, value } }) => (
											<Input
												variant="outline"
												size="md"
												isDisabled={false}
												isInvalid={!!errors.email}
												isReadOnly={false}
											>
												<InputField
													placeholder="Email"
													value={value}
													onChangeText={onChange}
													onBlur={onBlur}
													keyboardType="email-address"
													autoCapitalize="none"
												/>
											</Input>
										)}
									/>
									{errors.email && (
										<Text className="text-red-500 text-sm mt-1 font-montserrat">
											{errors.email.message}
										</Text>
									)}
								</View>

								<View className="mt-8">
									<Button
										onPress={handleSubmit(onSubmit)}
										disabled={isSubmitting}
										className="bg-app-primary rounded-lg h-16 mx-auto w-48"
									>
										<Text className="text-white font-montserrat font-semibold text-xs">
											{isSubmitting ? "Enviando..." : "Enviar Email"}
										</Text>
									</Button>
								</View>
							</View>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>

			<Image
				source={require("@/assets/Ellipse3.png")}
				style={{
					width: 100,
					height: 100,
					position: "absolute",
					left: -45,
					bottom: 30,
					zIndex: 100,
				}}
				contentFit="contain"
			/>
			<Image
				source={require("@/assets/Ellipse4.png")}
				style={{
					width: 100,
					height: 100,
					position: "absolute",
					bottom: 40,
					right: -45,
					zIndex: 100,
				}}
				contentFit="contain"
			/>
		</SafeAreaView>
	);
};

export default ForgotPassword;

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
import { router, useLocalSearchParams } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Input, InputField } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import BackgroundLogoSvgBlue from "@/assets/logo-blue.svg";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { authClient } from "@/lib/auth";
import { AxiosError } from "axios";
import { useState } from "react";

const resetPasswordSchema = z
	.object({
		newPassword: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
		confirmPassword: z.string().min(1, "Confirme sua senha"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
	const params = useLocalSearchParams();
	const token = (params.token as string) || "";
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (_data: ResetPasswordFormData) => {
		try {
			if (authClient && token) {
				const { data, error } = await authClient.resetPassword({
					newPassword: _data.newPassword,
					token: token,
				});

				if (error) {
					throw new Error(error.message);
				}

				if (data) {
					Alert.alert("Sucesso!", "Senha redefinida com sucesso!", [
						{
							text: "OK",
							onPress: () => router.replace("/auth/sign-in"),
						},
					]);
				}
			}
		} catch (error) {
			console.log("Reset password error:", error);
			const message =
				error instanceof AxiosError
					? error.response?.data?.message
					: error instanceof Error
						? error.message
						: "Não foi possível redefinir a senha. Tente novamente.";

			Alert.alert("Erro", message || "Não foi possível redefinir a senha. Tente novamente.");
		}
	};

	if (!token) {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<View className="flex-1 justify-center items-center px-6">
					<Text className="text-xl font-montserrat font-bold text-gray-700 mb-4">
						Token inválido
					</Text>
					<Text className="text-sm font-montserrat text-gray-600 text-center mb-8">
						O link de recuperação de senha é inválido ou expirou. Por favor, solicite um novo.
					</Text>
					<Button onPress={() => router.replace("/auth/forgot-password")} className="bg-app-primary rounded-lg h-16 mx-auto w-48">
						<Text className="text-white font-montserrat font-semibold text-xs">
							Solicitar Nova Recuperação
						</Text>
					</Button>
				</View>
			</SafeAreaView>
		);
	}

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
									Redefinir Senha
								</Text>
								<Text className="text-sm font-montserrat text-gray-600 mb-4">
									Digite sua nova senha abaixo.
								</Text>

								<View>
									<Controller
										control={control}
										name="newPassword"
										render={({ field: { onChange, onBlur, value } }) => (
											<Input
												variant="outline"
												size="md"
												isDisabled={false}
												isInvalid={!!errors.newPassword}
												isReadOnly={false}
											>
												<InputField
													placeholder="Nova senha"
													value={value}
													onChangeText={onChange}
													onBlur={onBlur}
													secureTextEntry={!showPassword}
													autoCapitalize="none"
												/>
												<Pressable
													onPress={() => setShowPassword(!showPassword)}
													className="pr-3"
												>
													<Ionicons
														name={showPassword ? "eye-off" : "eye"}
														size={20}
														color="#6B7280"
													/>
												</Pressable>
											</Input>
										)}
									/>
									{errors.newPassword && (
										<Text className="text-red-500 text-sm mt-1 font-montserrat">
											{errors.newPassword.message}
										</Text>
									)}
								</View>

								<View>
									<Controller
										control={control}
										name="confirmPassword"
										render={({ field: { onChange, onBlur, value } }) => (
											<Input
												variant="outline"
												size="md"
												isDisabled={false}
												isInvalid={!!errors.confirmPassword}
												isReadOnly={false}
											>
												<InputField
													placeholder="Confirmar nova senha"
													value={value}
													onChangeText={onChange}
													onBlur={onBlur}
													secureTextEntry={!showConfirmPassword}
													autoCapitalize="none"
												/>
												<Pressable
													onPress={() => setShowConfirmPassword(!showConfirmPassword)}
													className="pr-3"
												>
													<Ionicons
														name={showConfirmPassword ? "eye-off" : "eye"}
														size={20}
														color="#6B7280"
													/>
												</Pressable>
											</Input>
										)}
									/>
									{errors.confirmPassword && (
										<Text className="text-red-500 text-sm mt-1 font-montserrat">
											{errors.confirmPassword.message}
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
											{isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
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

export default ResetPassword;


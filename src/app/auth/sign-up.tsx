import {
	View,
	Text,
	ScrollView,
	Pressable,
	TouchableWithoutFeedback,
	Keyboard,
	KeyboardAvoidingView,
	ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Input, InputField } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SignUpFormData } from "@/utils/schemas/sign-up-schema";
import { signUpSchema } from "@/utils/schemas/sign-up-schema";
import BackgroundLogoSvgBlue from "@/assets/logo-blue.svg";
import { useState } from "react";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "@/actions/auth";
import { AxiosError } from "axios";

const SignUp = () => {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { isPending, mutateAsync } = useMutation({
		mutationFn: signUp,
		onSuccess: (data) => {
			const user = data?.data?.user;
			router.push({
				pathname: "/auth/send-email",
				params: {
					user: JSON.stringify(user),
				},
			});
		},
		onError: (ee) => {
			console.log("jeeeeeeeeeeeeeeeee", JSON.stringify(ee));
			if (ee instanceof AxiosError) {
				const status = ee.response?.status;
				const responseData = ee.response?.data;

				if (status === 409 && responseData?.error === 'EMAIL_NOT_VERIFIED' && responseData?.data?.user) {
					const user = responseData.data.user;
					router.push({
						pathname: "/auth/send-email",
						params: {
							user: JSON.stringify(user),
						},
					});
					return;
				}

				console.log("ERROR", JSON.stringify(responseData?.error, null, 2));
				setError(responseData?.error || responseData?.message || "Não foi possível criar a conta. Tente novamente.");
			} else {
				console.log("ERROR", JSON.stringify(ee, null, 2));
				setError("Não foi possível criar a conta. Tente novamente.");
			}
		},
	});

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async ({ email, phone, password, name }: SignUpFormData) => {
		setError(null);
		await mutateAsync({ email, phone, password, name });
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

							<View className="space-y-4 mt-10 flex-1 flex-col gap-4">
								<Text className="text-xl font-montserrat font-bold text-gray-700 mb-1">
									Crie sua conta para utilizar o app
								</Text>
								<View>
									<Controller
										control={control}
										name="name"
										render={({ field: { onChange, onBlur, value } }) => (
											<Input
												variant="outline"
												size="lg"
												isDisabled={false}
												isInvalid={!!errors.name}
												isReadOnly={false}
											>
												<InputField
													placeholder="Nome e sobrenome"
													value={value}
													onChangeText={onChange}
													onBlur={onBlur}
												/>
											</Input>
										)}
									/>
									{errors.name && (
										<Text className="text-red-500 text-sm mt-1 font-montserrat">
											{errors.name.message}
										</Text>
									)}
								</View>

								<View>
									<Controller
										control={control}
										name="email"
										render={({ field: { onChange, onBlur, value } }) => (
											<Input
												variant="outline"
												size="lg"
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

								<View>
									<Controller
										control={control}
										name="phone"
										render={({ field: { onChange, onBlur, value } }) => (
											<Input
												variant="outline"
												size="lg"
												isDisabled={false}
												isInvalid={!!errors.phone}
												isReadOnly={false}
											>
												<InputField
													placeholder="84 527 9970"
													value={value}
													onChangeText={onChange}
													onBlur={onBlur}
													keyboardType="phone-pad"
												/>
											</Input>
										)}
									/>
									{errors.phone && (
										<Text className="text-red-500 text-sm mt-1 font-montserrat">
											{errors.phone.message}
										</Text>
									)}
								</View>

								<View>
									<Controller
										control={control}
										name="password"
										render={({ field: { onChange, onBlur, value } }) => (
											<Input
												variant="outline"
												size="lg"
												isDisabled={false}
												isInvalid={!!errors.password}
												isReadOnly={false}
											>
												<InputField
													placeholder="Senha"
													value={value}
													onChangeText={onChange}
													onBlur={onBlur}
													secureTextEntry={!showPassword}
												/>
												<Pressable onPress={() => setShowPassword(!showPassword)} className="pr-3">
													<Ionicons
														name={showPassword ? "eye-off" : "eye"}
														size={20}
														color="#6B7280"
													/>
												</Pressable>
											</Input>
										)}
									/>
									{errors.password && (
										<Text className="text-red-500 text-sm mt-1 font-montserrat">
											{errors.password.message}
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
												size="lg"
												isDisabled={false}
												isInvalid={!!errors.confirmPassword}
												isReadOnly={false}
											>
												<InputField
													placeholder="Confirme Sua Senha"
													value={value}
													onChangeText={onChange}
													onBlur={onBlur}
													secureTextEntry={!showConfirmPassword}
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
							</View>
							{error && (
								<View>
									<Text className="text-red-500 text-sm mt-1 font-montserrat">{error}</Text>
								</View>
							)}

							<View className="mt-8">
								<Button
									onPress={handleSubmit(onSubmit)}
									disabled={isSubmitting}
									className="bg-app-primary rounded-lg h-16 mx-auto w-48"
								>
									<Text className="text-white font-montserrat font-semibold text-xs">
										{isSubmitting ? "Criando conta..." : "Criar conta"}
									</Text>
									{isPending && <ActivityIndicator />}
								</Button>
							</View>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
			<Image
				source={require("@/assets/Ellipse1.png")}
				style={{
					width: 100,
					height: 100,
					position: "absolute",
					right: -50,
					top: 35,
					zIndex: 100,
				}}
				contentFit="contain"
			/>
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

export default SignUp;

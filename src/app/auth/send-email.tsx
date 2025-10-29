import {
	View,
	Text,
	ScrollView,
	Pressable,
	TouchableWithoutFeedback,
	Keyboard,
	KeyboardAvoidingView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Entypo } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { sendEmailSchema } from "@/utils/schemas/send-email";
import { Input, InputField } from "@/components/ui/input";
import type { SendEmailFormData } from "@/utils/schemas/send-email";
import { router, useLocalSearchParams } from "expo-router";
import SendEmailFormSvg from "@/assets/sen-email.svg";
import Eclips1 from "@/assets/Ellipse8.svg";
import Eclips2 from "@/assets/Ellipse9.svg";
import Eclips3 from "@/assets/Ellipse10.svg";
import { verifyEmail } from "@/actions/auth";

const SendEmail = () => {
	const params = useLocalSearchParams();
	const user = JSON.parse(params.user as string);
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SendEmailFormData>({
		resolver: zodResolver(sendEmailSchema),
		defaultValues: {
			email: user.email,
		},
	});

	const onSubmit = async (_data: SendEmailFormData) => {
		await verifyEmail(user.email);
		router.push({
			pathname: "/(auth)/confirm-otp",
			params: {
				email: user.email,
			},
		});
	};

	return (
		<SafeAreaView className="flex-1 bg-app-primary">
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} className="relative">
				<KeyboardAvoidingView behavior="padding" className="flex-1 relative" enabled>
					<Eclips1 style={{ position: "absolute", bottom: 0, left: 0 }} />
					<Eclips2 style={{ position: "absolute", top: 0, right: 0 }} />
					<Eclips3 style={{ position: "absolute", bottom: 0, right: 0 }} />

					<StatusBar style="light" backgroundColor="#1F346C" animated={true} />

					<ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
						<View className="flex-1 flex-col justify-between px-6 pt-12 pb-8 space-y-8">
							<View className="mb-8 w-full">
								<View className="mb-8">
									<Pressable
										onPress={() => router.back()}
										className="mr-4 p-2 flex-row items-center"
									>
										<Entypo name="chevron-left" size={24} color="white" />
										<Text className="text-sm font-montserrat text-white ml-2">Voltar</Text>
									</Pressable>
								</View>
							</View>

							<View className="items-center justify-center">
								<SendEmailFormSvg width={180} height={180} />
							</View>

							<View className="space-y-6 flex-1">
								<View className="items-start space-y-2">
									<Text className="text-lg font-montserrat font-bold text-white text-center">
										DIGITE SEU E-MAIL
									</Text>
									<Text className="text-base font-montserrat text-white text-center">
										Para Receber O Código
									</Text>

									<View className="w-full mt-2">
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
													className="bg-white"
												>
													<InputField
														placeholder="Email"
														value={value}
														onChangeText={onChange}
														onBlur={onBlur}
														keyboardType="default"
														autoCapitalize="none"
														className="text-gray-800 font-montserrat"
													/>
												</Input>
											)}
										/>
										{errors.email && (
											<Text className="text-red-300 text-sm mt-2 font-montserrat text-center">
												{errors.email.message}
											</Text>
										)}
									</View>
								</View>
							</View>
							<View className="mt-8 flex-1 justify-between items-center">
								<Button
									onPress={handleSubmit(onSubmit)}
									disabled={isSubmitting}
									className="bg-white rounded-xl h-16 w-48"
								>
									<Text className="text-black font-montserrat text-sm">
										{isSubmitting ? "Enviando..." : "Continuar"}
									</Text>
								</Button>
							</View>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
};

export default SendEmail;

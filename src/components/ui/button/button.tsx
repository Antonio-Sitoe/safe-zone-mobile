import { Text, Pressable } from "react-native";
import { ReactNode } from "react";

interface ButtonProps {
	children: ReactNode;
	onPress: () => void;
	variant?: "primary" | "secondary";
	disabled?: boolean;
	icon?: ReactNode;
}

export const ButtonSecondary = ({
	children,
	onPress,
	variant = "primary",
	disabled = false,
	icon,
}: ButtonProps) => {
	return (
		<Pressable
			onPress={onPress}
			disabled={disabled}
			className={`
         bg-app-primary mx-2 mb-2  rounded-lg  py-4 px-6 flex-row items-center justify-center
        ${variant !== "primary" ? "" : " border-2 border-primary"}
        ${disabled ? "opacity-50" : "active:opacity-80"}
      `}
		>
			{icon && <>{icon}</>}
			<Text
				className={`
          text-base font-semibold
          ${variant !== "primary" ? "text-white" : "text-primary"}
          ${icon ? "ml-2" : ""}
        `}
			>
				{children}
			</Text>
		</Pressable>
	);
};

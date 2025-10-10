export interface LocationItemProps {
	name: string;
	level: number;
	onPress?: () => void;
	variant: "safe" | "danger";
}

import { SafeAreaView } from "react-native-safe-area-context";
import { CardsGrid } from "@/components/cards/grid";
import { Header } from "@/components/header";

export default function Home() {
	return (
		<SafeAreaView className="flex-1 bg-white">
			<Header />
			<CardsGrid />
		</SafeAreaView>
	);
}

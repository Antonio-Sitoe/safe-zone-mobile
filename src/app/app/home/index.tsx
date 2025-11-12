import MapComponent from "@/components/map";

// import { useState } from "react";
// import { TouchableOpacity, ActivityIndicator } from "react-native";
// import { CardsGrid } from "@/components/cards/grid";
// import { Header } from "@/components/header";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Bell } from "lucide-react-native";
// import { useAuthStore } from "@/contexts/auth-store";
// import { getContactsByUserId, sendAlert } from "@/actions/community";
// import { SuccessModal } from "@/components/modal/notification";

export default function MapScreen() {
	return <MapComponent />;
}

// export default function Home() {
//   const { user } = useAuthStore();
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [isSendingAlert, setIsSendingAlert] = useState(false);

//   const handleSendAlert = async () => {
//     if (!user?.id || isSendingAlert) return;

//     setIsSendingAlert(true);

//     try {
//       const contactsResult = await getContactsByUserId(user.id);

//       if (contactsResult.error || !contactsResult.data) {
//         setIsSendingAlert(false);
//         return;
//       }

//       const contactsByGroup = contactsResult.data.data || [];

//       const contactIds = contactsByGroup
//         .flatMap((group: any) => group.contacts || [])
//         .map((contact: any) => contact.id)
//         .filter((id: string) => id);

//       if (contactIds.length === 0) {
//         setIsSendingAlert(false);
//         return;
//       }

//       const alertResult = await sendAlert(contactIds);

//       if (!alertResult.error) {
//         setShowSuccessModal(true);
//       }
//     } catch (error) {
//       console.error("Error sending alert:", error);
//     } finally {
//       setIsSendingAlert(false);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <Header />
//       <CardsGrid />

//       <TouchableOpacity
//         onPress={handleSendAlert}
//         disabled={isSendingAlert}
//         className="absolute bottom-6 right-6 w-20 h-20 bg-red-600 rounded-full items-center justify-center shadow-lg"
//         style={{
//           shadowColor: "#000",
//           shadowOffset: { width: 0, height: 2 },
//           shadowOpacity: 0.25,
//           shadowRadius: 3.84,
//           elevation: 5,
//         }}
//       >
//         {isSendingAlert ? (
//           <ActivityIndicator size="small" color="#FFFFFF" />
//         ) : (
//           <Bell size={24} color="#FFFFFF" />
//         )}
//       </TouchableOpacity>

//       <SuccessModal
//         visible={showSuccessModal}
//         onClose={() => setShowSuccessModal(false)}
//         title="Alerta Enviado Com Sucesso"
//         message="Os seus contactos foram notificados sobre a situação de risco."
//       />
//     </SafeAreaView>
//   );
// }

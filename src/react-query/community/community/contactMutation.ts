import { CreateContact } from "@/actions/contact";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateContactMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ groupId, name, phone }: { groupId: string; name: string; phone: string }) => {
			const payload = {
				name,
				phone,
			};
			return CreateContact(payload, groupId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["groups"] });
			queryClient.invalidateQueries({ queryKey: ["groups-data"] });
			queryClient.invalidateQueries({ queryKey: ["all-contacts"] });
		},
		onError: (error) => {
			console.error("Error creating contact:", error);
		},
	});
};

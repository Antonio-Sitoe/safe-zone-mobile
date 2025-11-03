import type { Contact } from "@/@types/Contact";
import { createGroup, deleteGroup, getGroupById, updateGroup } from "@/actions/community";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateGroupMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			userId,
			name,
			members,
		}: {
			userId: string;
			name: string;
			members: Contact[];
		}) => {
			const payload = {
				name,
				contacts: members.map((m) => ({ name: m.name, phone: m.phone })),
			};
			return createGroup(userId, payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["groups"] });
			queryClient.invalidateQueries({ queryKey: ["groups-data"] });
			queryClient.invalidateQueries({ queryKey: ["all-contacts"] });
		},
		onError: (error) => {
			console.error("Error creating group:", error);
		},
	});
};
export const useUpdateGroupMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			groupId,
			name,
			members,
		}: {
			groupId: string;
			name: string;
			members: Contact[];
		}) => {
			const payload = {
				name,
				contacts: members.map((m) => ({
					...(m.id && { id: m.id }),
					name: m.name,
					phone: m.phone,
				})),
			};
			return updateGroup(payload, groupId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["groups"] });
			queryClient.invalidateQueries({ queryKey: ["groups-data"] });
			queryClient.invalidateQueries({ queryKey: ["all-contacts"] });
		},
		onError: (error) => {
			console.error("Error updating group:", error);
		},
	});
};
export const useDeleteGroupMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ groupId }: { groupId: string }) => {
			return deleteGroup(groupId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["groups"] });
			queryClient.invalidateQueries({ queryKey: ["groups-data"] });
			queryClient.invalidateQueries({ queryKey: ["all-contacts"] });
		},
		onError: (error) => {
			console.error("Error deleting group:", error);
		},
	});
};
export const useGetGroupsMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId }: { userId: string }) => {
			return getGroupById(userId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["groups"] });
			queryClient.invalidateQueries({ queryKey: ["groups-data"] });
			queryClient.invalidateQueries({ queryKey: ["all-contacts"] });
		},
		onError: (error) => {
			console.error("Error getting group:", error);
		},
	});
};

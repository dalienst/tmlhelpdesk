"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  CreateGroupPayload,
  UpdateGroupPayload,
} from "@/services/groups";

export function useFetchGroups(params?: { search?: string; my_groups?: boolean }) {
  const headers = useAxiosAuth();

  return useQuery({
    queryKey: ["groups", params?.search || "", params?.my_groups ? "mine" : "all"],
    queryFn: () => getGroups(headers, params),
    enabled: !!headers && !!headers.headers.Authorization,
  });
}

export function useFetchGroup(reference: string) {
  const headers = useAxiosAuth();

  return useQuery({
    queryKey: ["group", reference],
    queryFn: () => getGroup(reference, headers),
    enabled: !!headers && !!headers.headers.Authorization && !!reference,
  });
}

export function useCreateGroup() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroupPayload) => createGroup(data, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useUpdateGroup() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reference, data }: { reference: string; data: UpdateGroupPayload }) =>
      updateGroup(reference, data, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["group"] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useDeleteGroup() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reference: string) => deleteGroup(reference, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

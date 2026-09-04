"use client";

import {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deactivateDepartment,
  deleteDepartment,
  createDepartment as CreateDepartmentPayload,
  updateDepartment as UpdateDepartmentPayload,
} from "@/services/departments";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useFetchDepartments(unit?: string) {
  const headers = useAxiosAuth();

  return useQuery({
    queryKey: ["departments", unit || "all"],
    queryFn: () => getDepartments(headers, unit),
    enabled: !!headers,
  });
}

export function useFetchDepartment(reference: string) {
  const headers = useAxiosAuth();

  return useQuery({
    queryKey: ["department", reference],
    queryFn: () => getDepartment(reference, headers),
    enabled: !!headers && !!reference,
  });
}

export function useCreateDepartment() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDepartmentPayload) =>
      createDepartment(data, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useUpdateDepartment() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reference,
      data,
    }: {
      reference: string;
      data: UpdateDepartmentPayload;
    }) => updateDepartment(reference, data, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["department"] });
    },
  });
}

export function useDeactivateDepartment() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reference: string) =>
      deactivateDepartment(reference, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["department"] });
    },
  });
}

export function useDeleteDepartment() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reference: string) => deleteDepartment(reference, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["department"] });
    },
  });
}

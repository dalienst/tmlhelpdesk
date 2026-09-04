"use client";

import {
  getUnits,
  getUnit,
  createUnit,
  updateUnit,
  deactivateUnit,
  deleteUnit,
  createUnit as CreateUnitPayload,
  updateUnit as UpdateUnitPayload,
} from "@/services/units";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useFetchUnits() {
  const headers = useAxiosAuth();

  return useQuery({
    queryKey: ["units"],
    queryFn: () => getUnits(headers),
    enabled: !!headers,
  });
}

export function useFetchUnit(reference: string) {
  const headers = useAxiosAuth();

  return useQuery({
    queryKey: ["unit", reference],
    queryFn: () => getUnit(reference, headers),
    enabled: !!headers && !!reference,
  });
}

export function useCreateUnit() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUnitPayload) => createUnit(data, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
}

export function useUpdateUnit() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reference,
      data,
    }: {
      reference: string;
      data: UpdateUnitPayload;
    }) => updateUnit(reference, data, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      queryClient.invalidateQueries({ queryKey: ["unit"] });
    },
  });
}

export function useDeactivateUnit() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reference: string) => deactivateUnit(reference, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      queryClient.invalidateQueries({ queryKey: ["unit"] });
    },
  });
}

export function useDeleteUnit() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reference: string) => deleteUnit(reference, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      queryClient.invalidateQueries({ queryKey: ["unit"] });
    },
  });
}

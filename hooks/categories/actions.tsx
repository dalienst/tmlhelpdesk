"use client";

import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  createCategory as CreateCategoryPayload,
  updateCategory as UpdateCategoryPayload,
} from "@/services/categories";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useFetchCategories(department?: string) {
  const headers = useAxiosAuth();

  return useQuery({
    queryKey: ["categories", department || "all"],
    queryFn: () => getCategories(headers, department),
    enabled: !!headers,
  });
}

export function useFetchCategory(reference: string) {
  const headers = useAxiosAuth();

  return useQuery({
    queryKey: ["category", reference],
    queryFn: () => getCategory(reference, headers),
    enabled: !!headers && !!reference,
  });
}

export function useCreateCategory() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryPayload) => createCategory(data, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reference,
      data,
    }: {
      reference: string;
      data: UpdateCategoryPayload;
    }) => updateCategory(reference, data, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });
}

export function useDeleteCategory() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reference: string) => deleteCategory(reference, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });
}

"use client";

import {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
  IssueQueryParams,
  createIssue as CreateIssuePayload,
  updateIssue as UpdateIssuePayload,
} from "@/services/issues";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useFetchIssues(params?: IssueQueryParams) {
  const headers = useAxiosAuth();

  return useQuery({
    queryKey: [
      "issues",
      params?.category || "all_cat",
      params?.department || "all_dept",
      params?.technician || "all_tech",
    ],
    queryFn: () => getIssues(headers, params),
    enabled: !!headers,
  });
}

export function useFetchIssue(reference: string) {
  const headers = useAxiosAuth();

  return useQuery({
    queryKey: ["issue", reference],
    queryFn: () => getIssue(reference, headers),
    enabled: !!headers && !!reference,
  });
}

export function useCreateIssue() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIssuePayload) => createIssue(data, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
}

export function useUpdateIssue() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reference,
      data,
    }: {
      reference: string;
      data: UpdateIssuePayload;
    }) => updateIssue(reference, data, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["issue"] });
    },
  });
}

export function useDeleteIssue() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reference: string) => deleteIssue(reference, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["issue"] });
    },
  });
}

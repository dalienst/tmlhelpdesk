"use client";

import {
  getAttachments,
  createAttachmentRecord,
  createAttachment as CreateAttachmentPayload,
} from "@/services/attachments";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useFetchAttachments(ticketRef?: string) {
  const headers = useAxiosAuth();

  return useQuery({
    queryKey: ["attachments", ticketRef || ""],
    queryFn: () => getAttachments(ticketRef!, headers),
    enabled: !!headers && !!ticketRef,
  });
}

export function useCreateAttachment() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAttachmentPayload) =>
      createAttachmentRecord(data, headers),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["attachments", variables.ticket],
      });
      await queryClient.invalidateQueries({
        queryKey: ["ticket", variables.ticket],
      });
    },
  });
}

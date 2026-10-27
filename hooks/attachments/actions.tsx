"use client";

import {
  getAttachments,
  createAttachmentRecord,
  createAttachment as CreateAttachmentPayload,
} from "@/services/attachments";
import useAxiosAuth, { hasToken } from "../authentication/useAxiosAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useFetchAttachments(ticketRef?: string) {
  const headers = useAxiosAuth();

  return useQuery({
    queryKey: ["attachments", ticketRef || ""],
    queryFn: () => getAttachments(ticketRef!, headers),
    enabled: hasToken(headers) && !!ticketRef,
  });
}

export function useCreateAttachment() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAttachmentPayload) =>
      createAttachmentRecord(data, headers),
    onSuccess: async () => {
      // Queries are keyed by ticket reference, but the payload carries the id.
      await queryClient.invalidateQueries({ queryKey: ["attachments"] });
      await queryClient.invalidateQueries({ queryKey: ["ticket"] });
    },
  });
}

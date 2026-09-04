"use client";

import {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  TicketQueryParams,
  createTicket as CreateTicketPayload,
  updateTicket as UpdateTicketPayload,
} from "@/services/tickets";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useFetchTickets(params?: TicketQueryParams) {
  const headers = useAxiosAuth();

  return useQuery({
    queryKey: [
      "tickets",
      params?.status || "all_status",
      params?.priority || "all_priority",
      params?.department || "all_dept",
      params?.unit || "all_unit",
      params?.category || "all_cat",
      params?.issue || "all_issue",
      params?.my_tickets ? "my_t" : "",
      params?.my_assigned ? "my_a" : "",
      params?.search || "",
    ],
    queryFn: () => getTickets(headers, params),
    enabled: !!headers,
  });
}

export function useFetchTicket(reference: string) {
  const headers = useAxiosAuth();

  return useQuery({
    queryKey: ["ticket", reference],
    queryFn: () => getTicket(reference, headers),
    enabled: !!headers && !!reference,
  });
}

export function useCreateTicket() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTicketPayload) => createTicket(data, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useUpdateTicket() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reference,
      data,
    }: {
      reference: string;
      data: UpdateTicketPayload;
    }) => updateTicket(reference, data, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
    },
  });
}

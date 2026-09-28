"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface Attachment {
  id: string;
  reference: string;
  ticket: string;
  ticket_number?: string;
  ticket_reference?: string;
  uploaded_by?: string;
  uploaded_by_name?: string;
  uploaded_by_email?: string;
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: string;
  attachment_type: "REQUEST_ATTACHMENT" | "FULFILLMENT_ATTACHMENT";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface createAttachment {
  ticket: string; // Ticket ID or reference
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: string;
  attachment_type?: "REQUEST_ATTACHMENT" | "FULFILLMENT_ATTACHMENT";
}

export const getAttachments = async (
  ticketRef: string,
  headers: { headers: { Authorization: string } }
): Promise<Attachment[]> => {
  const response: AxiosResponse<PaginatedResponse<Attachment>> =
    await apiActions.get(`/api/v1/attachments/?ticket=${ticketRef}`, headers);
  return response.data.results ?? [];
};

export const createAttachmentRecord = async (
  data: createAttachment,
  headers: { headers: { Authorization: string } }
): Promise<Attachment> => {
  const response: AxiosResponse<Attachment> = await apiActions.post(
    `/api/v1/attachments/`,
    data,
    headers
  );
  return response.data;
};

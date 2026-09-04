"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface Ticket {
  id: string;
  ticket_number: string;
  reference: string;
  unit: string;
  unit_name: string;
  unit_reference: string;
  department: string;
  department_name: string;
  department_reference: string;
  category: string;
  category_name: string;
  category_reference: string;
  issue: string;
  issue_name: string;
  issue_reference: string;
  sla_hours: number;
  requester: string;
  requester_name: string;
  requester_email: string;
  requester_payroll_no: string;
  assigned_to: string | null;
  assigned_to_name?: string;
  assigned_to_email?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "PENDING" | "RESOLVED" | "CLOSED" | "CANCELLED";
  subject: string;
  description: string;
  resolution_notes?: string;
  resolved_at?: string;
  closed_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface createTicket {
  unit?: string;
  department?: string;
  category?: string;
  issue: string;
  subject: string;
  description: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface updateTicket {
  status?: "OPEN" | "IN_PROGRESS" | "PENDING" | "RESOLVED" | "CLOSED" | "CANCELLED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  assigned_to?: string | null;
  resolution_notes?: string;
  subject?: string;
  description?: string;
}

export interface TicketQueryParams {
  status?: string;
  priority?: string;
  department?: string;
  unit?: string;
  category?: string;
  issue?: string;
  my_tickets?: boolean;
  my_assigned?: boolean;
  search?: string;
}

export const getTickets = async (
  headers: { headers: { Authorization: string } },
  params?: TicketQueryParams
): Promise<Ticket[]> => {
  const query = new URLSearchParams();
  if (params?.status) query.append("status", params.status);
  if (params?.priority) query.append("priority", params.priority);
  if (params?.department) query.append("department", params.department);
  if (params?.unit) query.append("unit", params.unit);
  if (params?.category) query.append("category", params.category);
  if (params?.issue) query.append("issue", params.issue);
  if (params?.my_tickets) query.append("my_tickets", "true");
  if (params?.my_assigned) query.append("my_assigned", "true");
  if (params?.search) query.append("search", params.search);

  const queryString = query.toString();
  const url = queryString ? `/api/v1/tickets/?${queryString}` : `/api/v1/tickets/`;
  const response: AxiosResponse<PaginatedResponse<Ticket>> =
    await apiActions.get(url, headers);
  return response.data.results ?? [];
};

export const getTicket = async (
  reference: string,
  headers: { headers: { Authorization: string } }
): Promise<Ticket> => {
  const response: AxiosResponse<Ticket> = await apiActions.get(
    `/api/v1/tickets/${reference}/`,
    headers
  );
  return response.data;
};

export const createTicket = async (
  data: createTicket,
  headers: { headers: { Authorization: string } }
): Promise<Ticket> => {
  const response: AxiosResponse<Ticket> = await apiActions.post(
    `/api/v1/tickets/`,
    data,
    headers
  );
  return response.data;
};

export const updateTicket = async (
  reference: string,
  data: updateTicket,
  headers: { headers: { Authorization: string } }
): Promise<Ticket> => {
  const response: AxiosResponse<Ticket> = await apiActions.patch(
    `/api/v1/tickets/${reference}/`,
    data,
    headers
  );
  return response.data;
};

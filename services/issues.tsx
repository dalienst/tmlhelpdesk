"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface Issue {
  id: string;
  category: string;
  category_name: string;
  category_reference: string;
  department_name: string;
  department_reference: string;
  name: string;
  code: string;
  description?: string;
  technician?: string | null;
  technician_name?: string;
  technician_email?: string;
  default_priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  sla_hours: number;
  requires_approval: boolean;
  is_active: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  reference: string;
}

export interface createIssue {
  category: string;
  name: string;
  code: string;
  description?: string;
  technician?: string | null;
  default_priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  sla_hours?: number;
  requires_approval?: boolean;
}

export interface updateIssue {
  category?: string;
  name?: string;
  code?: string;
  description?: string;
  technician?: string | null;
  default_priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  sla_hours?: number;
  requires_approval?: boolean;
  is_active?: boolean;
}

export interface IssueQueryParams {
  category?: string;
  department?: string;
  technician?: string;
}

export const getIssues = async (
  headers: { headers: { Authorization: string } },
  params?: IssueQueryParams
): Promise<Issue[]> => {
  const query = new URLSearchParams();
  if (params?.category) query.append("category", params.category);
  if (params?.department) query.append("department", params.department);
  if (params?.technician) query.append("technician", params.technician);

  const queryString = query.toString();
  const url = queryString ? `/api/v1/issues/?${queryString}` : `/api/v1/issues/`;
  const response: AxiosResponse<PaginatedResponse<Issue>> =
    await apiActions.get(url, headers);
  return response.data.results ?? [];
};

export const getIssue = async (
  reference: string,
  headers: { headers: { Authorization: string } }
): Promise<Issue> => {
  const response: AxiosResponse<Issue> = await apiActions.get(
    `/api/v1/issues/${reference}/`,
    headers
  );
  return response.data;
};

export const createIssue = async (
  data: createIssue,
  headers: { headers: { Authorization: string } }
): Promise<Issue> => {
  const response: AxiosResponse<Issue> = await apiActions.post(
    `/api/v1/issues/`,
    data,
    headers
  );
  return response.data;
};

export const updateIssue = async (
  reference: string,
  data: updateIssue,
  headers: { headers: { Authorization: string } }
): Promise<Issue> => {
  const response: AxiosResponse<Issue> = await apiActions.patch(
    `/api/v1/issues/${reference}/`,
    data,
    headers
  );
  return response.data;
};

export const deleteIssue = async (
  reference: string,
  headers: { headers: { Authorization: string } }
): Promise<Issue> => {
  const response: AxiosResponse<Issue> = await apiActions.delete(
    `/api/v1/issues/${reference}/`,
    headers
  );
  return response.data;
};

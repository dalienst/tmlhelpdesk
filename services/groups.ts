"use client";

import { apiActions } from "@/tools/axios";

export interface GroupDepartment {
  id: string;
  reference: string;
  name: string;
  code: string;
  unit_name: string;
  unit_code: string;
}

export interface Group {
  id: string;
  reference: string;
  name: string;
  code: string;
  description: string;
  manager: string | null;
  manager_name?: string;
  manager_email?: string;
  manager_payroll_no?: string;
  departments_count: number;
  departments_list: GroupDepartment[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateGroupPayload {
  name: string;
  code: string;
  description?: string;
  manager?: string | null;
}

export interface UpdateGroupPayload extends Partial<CreateGroupPayload> {
  department_ids?: string[];
  is_active?: boolean;
}

export const getGroups = async (
  headers: { headers: { Authorization: string } },
  params?: { search?: string; my_groups?: boolean }
): Promise<Group[]> => {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.my_groups) query.append("my_groups", "true");
  const res = await apiActions.get(`/api/v1/groups/${query.toString() ? `?${query.toString()}` : ""}`, headers);
  return res.data?.results ?? res.data ?? [];
};

export const getGroup = async (
  reference: string,
  headers: { headers: { Authorization: string } }
): Promise<Group> => {
  const res = await apiActions.get(`/api/v1/groups/${reference}/`, headers);
  return res.data;
};

export const createGroup = async (
  data: CreateGroupPayload,
  headers: { headers: { Authorization: string } }
): Promise<Group> => {
  const res = await apiActions.post(`/api/v1/groups/`, data, headers);
  return res.data;
};

export const updateGroup = async (
  reference: string,
  data: UpdateGroupPayload,
  headers: { headers: { Authorization: string } }
): Promise<Group> => {
  const res = await apiActions.patch(`/api/v1/groups/${reference}/`, data, headers);
  return res.data;
};

export const deleteGroup = async (
  reference: string,
  headers: { headers: { Authorization: string } }
): Promise<void> => {
  await apiActions.delete(`/api/v1/groups/${reference}/`, headers);
};

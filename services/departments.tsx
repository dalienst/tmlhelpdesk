"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface Department {
  id: string;
  unit: string;
  name: string;
  code: string;
  description: string;
  supervisor: string | null;
  staff: string[];
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  reference: string;
}

export interface createDepartment {
  unit: string;
  name: string;
  code: string;
  description?: string;
  supervisor?: string | null;
  staff?: string[];
}

export interface updateDepartment {
  unit?: string;
  name?: string;
  code?: string;
  description?: string;
  supervisor?: string | null;
  staff?: string[];
  is_active?: boolean;
}

export const getDepartments = async (
  headers: { headers: { Authorization: string } },
  unit?: string
): Promise<Department[]> => {
  const url = unit
    ? `/api/v1/departments/?unit=${encodeURIComponent(unit)}`
    : `/api/v1/departments/`;
  const response: AxiosResponse<PaginatedResponse<Department>> =
    await apiActions.get(url, headers);
  return response.data.results ?? [];
};

export const getDepartment = async (
  reference: string,
  headers: { headers: { Authorization: string } }
): Promise<Department> => {
  const response: AxiosResponse<Department> = await apiActions.get(
    `/api/v1/departments/${reference}/`,
    headers
  );
  return response.data;
};

export const createDepartment = async (
  data: createDepartment,
  headers: { headers: { Authorization: string } }
): Promise<Department> => {
  const response: AxiosResponse<Department> = await apiActions.post(
    `/api/v1/departments/`,
    data,
    headers
  );
  return response.data;
};

export const updateDepartment = async (
  reference: string,
  data: updateDepartment,
  headers: { headers: { Authorization: string } }
): Promise<Department> => {
  const response: AxiosResponse<Department> = await apiActions.patch(
    `/api/v1/departments/${reference}/`,
    data,
    headers
  );
  return response.data;
};

export const deactivateDepartment = async (
  reference: string,
  headers: { headers: { Authorization: string } }
): Promise<Department> => {
  const response: AxiosResponse<Department> = await apiActions.patch(
    `/api/v1/departments/${reference}/`,
    { is_active: false },
    headers
  );
  return response.data;
};

export const deleteDepartment = async (
  reference: string,
  headers: { headers: { Authorization: string } }
): Promise<Department> => {
  const response: AxiosResponse<Department> = await apiActions.delete(
    `/api/v1/departments/${reference}/`,
    headers
  );
  return response.data;
};

"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface Category {
  id: string;
  group: string;
  group_name: string;
  group_code?: string;
  group_reference: string;
  name: string;
  code: string;
  description?: string;
  supervisor?: string | null;
  supervisor_name?: string;
  is_active: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  reference: string;
}

export interface createCategory {
  group: string;
  name: string;
  code: string;
  description?: string;
  supervisor?: string | null;
}

export interface updateCategory {
  group?: string;
  name?: string;
  code?: string;
  description?: string;
  supervisor?: string | null;
  is_active?: boolean;
}

export const getCategories = async (
  headers: { headers: { Authorization: string } },
  group?: string
): Promise<Category[]> => {
  const url = group
    ? `/api/v1/categories/?group=${encodeURIComponent(group)}`
    : `/api/v1/categories/`;
  const response: AxiosResponse<PaginatedResponse<Category>> =
    await apiActions.get(url, headers);
  return response.data.results ?? [];
};

export const getCategory = async (
  reference: string,
  headers: { headers: { Authorization: string } }
): Promise<Category> => {
  const response: AxiosResponse<Category> = await apiActions.get(
    `/api/v1/categories/${reference}/`,
    headers
  );
  return response.data;
};

export const createCategory = async (
  data: createCategory,
  headers: { headers: { Authorization: string } }
): Promise<Category> => {
  const response: AxiosResponse<Category> = await apiActions.post(
    `/api/v1/categories/`,
    data,
    headers
  );
  return response.data;
};

export const updateCategory = async (
  reference: string,
  data: updateCategory,
  headers: { headers: { Authorization: string } }
): Promise<Category> => {
  const response: AxiosResponse<Category> = await apiActions.patch(
    `/api/v1/categories/${reference}/`,
    data,
    headers
  );
  return response.data;
};

export const deleteCategory = async (
  reference: string,
  headers: { headers: { Authorization: string } }
): Promise<Category> => {
  const response: AxiosResponse<Category> = await apiActions.delete(
    `/api/v1/categories/${reference}/`,
    headers
  );
  return response.data;
};

"use client"
import { apiActions, apiMultipartActions } from "@/tools/axios"
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface Unit {
    id: string;
    name: string;
    code: string;
    description: string;
    location: string;
    email: string;
    phone: string;
    is_active: boolean;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    reference: string;
}

export interface createUnit {
    name: string;
    code: string;
    description: string;
    location: string;
    email: string;
    phone: string;
}

export interface deactivateUnit {
    is_active: boolean;
}

export interface updateUnit {
    name?: string;
    code?: string;
    description?: string;
    location?: string;
    email?: string;
    phone?: string;
}

export const getUnits = async (headers: { headers: { Authorization: string } }): Promise<Unit[]> => {
    const response: AxiosResponse<PaginatedResponse<Unit>> = await apiActions.get(`/api/v1/units/`, headers)
    return response.data.results ?? [];
}

export const getUnit = async (reference: string, headers: { headers: { Authorization: string } }): Promise<Unit> => {
    const response: AxiosResponse<Unit> = await apiActions.get(`/api/v1/units/${reference}/`, headers)
    return response.data
}

export const createUnit = async (data: createUnit, headers: { headers: { Authorization: string } }): Promise<Unit> => {
    const response: AxiosResponse<Unit> = await apiActions.post(`/api/v1/units/`, data, headers)
    return response.data
}

export const deactivateUnit = async (reference: string, headers: { headers: { Authorization: string } }): Promise<Unit> => {
    const response: AxiosResponse<Unit> = await apiActions.patch(`/api/v1/units/${reference}/`, { is_active: false }, headers)
    return response.data
}

export const updateUnit = async (reference: string, data: updateUnit, headers: { headers: { Authorization: string } }): Promise<Unit> => {
    const response: AxiosResponse<Unit> = await apiActions.patch(`/api/v1/units/${reference}/`, data, headers)
    return response.data
}

export const deleteUnit = async (reference: string, headers: { headers: { Authorization: string } }): Promise<Unit> => {
    const response: AxiosResponse<Unit> = await apiActions.delete(`/api/v1/units/${reference}/`, headers)
    return response.data
}
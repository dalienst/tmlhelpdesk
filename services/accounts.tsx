"use client"

import { apiActions, apiMultipartActions } from "@/tools/axios"
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface User {
    id: string;
    email: string;
    payroll_no: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_superuser: boolean;
    is_active: boolean;
    is_admin: boolean;
    is_deleted: boolean;
    last_login: string;
    is_technician: boolean;
    is_employee: boolean;
    is_manager: boolean;
    is_trainer: boolean;
    is_hod: boolean;
    is_hr: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    reference: string;
}

export interface forgotPassword {
    email: string;
}

export interface resetPassword {
    code: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface updateUser {
    first_name?: string;
    last_name?: string;
}

export interface ActivateAccountPayload {
    uidb64: string; // in the url params
    token: string; // in the url params
    password: string;
    password_confirmation: string;
}

export interface CreateEmployeeByAdminPayload {
    email: string;
    first_name: string;
    last_name: string;
    payroll_no: string;
}

export interface CreateBulkEmployeeByAdminPayload {
    employees: CreateEmployeeByAdminPayload[];
}

interface createBulkEmployeeByAdminCSV {
    file: File;
}

export interface UpdateUserByAdminPayload {
    is_employee?: boolean;
    is_manager?: boolean;
    is_trainer?: boolean;
    is_hod?: boolean;
    is_hr?: boolean;
    is_technician?: boolean;
    is_staff?: boolean;
    is_admin?: boolean;
    is_active?: boolean;
}

export interface resetMemberPassword {
    password: string;
    password_confirmation: string;
}

export const activateAccount = async (data: ActivateAccountPayload): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.patch(`/api/v1/auth/activate/${data.uidb64}/${data.token}/`, data)
    return response.data
}

export const getAccount = async (userId: string, headers: { headers: { Authorization: string } }): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.get(`/api/v1/auth/${userId}/`, headers)
    return response.data
}

export const updateAccount = async (userId: string, formData: updateUser | FormData, headers: { headers: { Authorization: string } }): Promise<User> => {
    const response: AxiosResponse<User> = await apiMultipartActions.patch(`/api/v1/auth/${userId}/`, formData, headers)
    return response.data
}

export const forgotPassword = async (data: forgotPassword): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.post(`/api/v1/auth/password/forgot/`, data)
    return response.data
}

export const resetPassword = async (data: resetPassword): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.post(`/api/v1/auth/password/reset/confirm/`, data)
    return response.data
}

export const createEmployeeByAdmin = async (data: CreateEmployeeByAdminPayload, headers: { headers: { Authorization: string } }): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.post(`/api/v1/auth/signup/employees/create/`, data, headers)
    return response.data
}

export const downloadTemplate = async (headers: { headers: { Authorization: string } }): Promise<Blob> => {
    const response = await apiActions.get(`/api/v1/auth/signup/employees/bulk/create/csv/template/`, {
        ...headers,
        responseType: 'blob'
    });
    return response.data;
}

export const createBulkEmployeeByAdmin = async (data: CreateBulkEmployeeByAdminPayload, headers: { headers: { Authorization: string } }): Promise<User> => {
    const response: AxiosResponse<User> = await apiMultipartActions.post(`/api/v1/auth/signup/employees/bulk/create/`, data, headers)
    return response.data
}

export const createBulkEmployeeByAdminCSV = async (data: createBulkEmployeeByAdminCSV, headers: { headers: { Authorization: string } }): Promise<User> => {
    const response: AxiosResponse<User> = await apiMultipartActions.post(`/api/v1/auth/signup/employees/bulk/create/csv/`, data, headers)
    return response.data
}

export const getEmployees = async (headers: { headers: { Authorization: string } }): Promise<User[]> => {
    const response: AxiosResponse<PaginatedResponse<User>> = await apiActions.get(`/api/v1/auth/`, headers)
    return response.data.results ?? [];
}

export const getEmployee = async (reference: string, headers: { headers: { Authorization: string } }): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.get(`/api/v1/auth/${reference}/update/`, headers)
    return response.data
}

export const updateUserByAdmin = async (reference: string, formData: UpdateUserByAdminPayload, headers: { headers: { Authorization: string } }): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.patch(`/api/v1/auth/${reference}/update/`, formData, headers)
    return response.data
}

export const resetMemberPassword = async (reference: string, formData: resetMemberPassword, headers: { headers: { Authorization: string } }): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.patch(`/api/v1/auth/password/reset/${reference}/member/`, formData, headers)
    return response.data
}

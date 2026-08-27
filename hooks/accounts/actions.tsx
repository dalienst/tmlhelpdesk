"use client";

import { 
    getAccount, 
    getEmployee, 
    getEmployees, 
    createEmployeeByAdmin,
    createBulkEmployeeByAdmin,
    createBulkEmployeeByAdminCSV,
    downloadTemplate,
    updateUserByAdmin,
    CreateEmployeeByAdminPayload,
    CreateBulkEmployeeByAdminPayload,
    UpdateUserByAdminPayload
} from "@/services/accounts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import useUserId from "../authentication/useUserId";

export function useFetchAccount() {
    const userId = useUserId();
    const token = useAxiosAuth();

    return useQuery({
        queryKey: ["account", userId],
        queryFn: () => getAccount(userId as string, token),
        enabled: !!userId,
    });
}

// HR

export function useFetchEmployees() {
    const token = useAxiosAuth();

    return useQuery({
        queryKey: ["employees"],
        queryFn: () => getEmployees(token),
        enabled: !!token,
    });
}

export function useFetchEmployee(reference: string) {
    const token = useAxiosAuth();

    return useQuery({
        queryKey: ["employee", reference],
        queryFn: () => getEmployee(reference, token),
        enabled: !!token && !!reference,
    });
}

// Mutations for Admin
export function useCreateEmployee() {
    const token = useAxiosAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateEmployeeByAdminPayload) => createEmployeeByAdmin(data, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
        },
    });
}

export function useCreateBulkEmployees() {
    const token = useAxiosAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBulkEmployeeByAdminPayload) => createBulkEmployeeByAdmin(data, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
        },
    });
}

export function useCreateBulkEmployeesCSV() {
    const token = useAxiosAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { file: File }) => createBulkEmployeeByAdminCSV(data, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
        },
    });
}

export function useDownloadTemplate() {
    const token = useAxiosAuth();
    
    return useMutation({
        mutationFn: () => downloadTemplate(token)
    });
}

export function useUpdateUserByAdmin() {
    const token = useAxiosAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reference, data }: { reference: string, data: UpdateUserByAdminPayload }) => updateUserByAdmin(reference, data, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            queryClient.invalidateQueries({ queryKey: ["employee"] });
        },
    });
}

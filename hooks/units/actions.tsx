"use client"

import { getUnits, getUnit } from "@/services/units";
import useAxiosAuth from "../authentication/useAxiosAuth"
import { useQuery } from "@tanstack/react-query"

export function useFetchUnits() {
    const headers = useAxiosAuth();

    return useQuery({
        queryKey: ["units"],
        queryFn: () => getUnits(headers),
        enabled: !!headers,
    })
}

export function useFetchUnit(reference: string) {
    const headers = useAxiosAuth();

    return useQuery({
        queryKey: ["unit", reference],
        queryFn: () => getUnit(reference, headers),
        enabled: !!headers && !!reference,
    })
}
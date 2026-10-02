"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import {
  getDepartmentEscalationRule,
  saveDepartmentEscalationRule,
  SaveEscalationRulePayload,
} from "@/services/escalations";

export function useFetchDepartmentEscalationRule(departmentRef: string) {
  const headers = useAxiosAuth();

  return useQuery({
    queryKey: ["escalation-rule", departmentRef],
    queryFn: () => getDepartmentEscalationRule(departmentRef, headers),
    enabled: !!headers && !!headers.headers.Authorization && !!departmentRef,
  });
}

export function useSaveDepartmentEscalationRule() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      departmentRef,
      data,
    }: {
      departmentRef: string;
      data: SaveEscalationRulePayload;
    }) => saveDepartmentEscalationRule(departmentRef, data, headers),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["escalation-rule", variables.departmentRef],
      });
    },
  });
}

export const useUpdateDepartmentEscalationRule = useSaveDepartmentEscalationRule;

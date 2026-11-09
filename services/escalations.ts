"use client";

import { apiActions } from "@/tools/axios";

export interface EscalationRule {
  id: string;
  reference: string;
  department: string;
  department_name: string;
  department_code: string;
  department_reference: string;
  unit_name: string;
  unit_code: string;
  supervisor_email?: string;
  supervisor_name?: string;
  warning_threshold_pct: number;
  auto_escalate_on_breach: boolean;
  escalate_to_gm_after_hours: number | null;
  immediate_critical_alert: boolean;
  notify_emails?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SaveEscalationRulePayload {
  warning_threshold_pct?: number;
  auto_escalate_on_breach?: boolean;
  escalate_to_gm_after_hours?: number | null;
  immediate_critical_alert?: boolean;
  notify_emails?: string;
}

export const getDepartmentEscalationRule = async (
  departmentRef: string,
  headers: { headers: { Authorization: string } }
): Promise<EscalationRule> => {
  const res = await apiActions.get(`/api/v1/escalations/department/${departmentRef}/`, headers);
  return res.data;
};

export const saveDepartmentEscalationRule = async (
  departmentRef: string,
  data: SaveEscalationRulePayload,
  headers: { headers: { Authorization: string } }
): Promise<EscalationRule> => {
  const res = await apiActions.put(`/api/v1/escalations/department/${departmentRef}/`, data, headers);
  return res.data;
};

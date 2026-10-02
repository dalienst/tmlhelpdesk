"use client";

import { apiActions } from "@/tools/axios";

export interface AnalyticsSummary {
  total_tickets: number;
  resolved_tickets: number;
  active_tickets: number;
  escalated_tickets: number;
  escalation_rate: number;
  sla_compliance_rate: number;
  sla_met_count: number;
  sla_breached_count: number;
  mttr_hours: number;
  total_paused_hours: number;
  period: string;
  start_date: string | null;
  end_date: string;
}

export interface PriorityBreakdown {
  priority: string;
  total: number;
  resolved: number;
  sla_met: number;
  sla_breached: number;
  compliance_rate: number;
  avg_resolution_hours: number;
}

export interface AgingBuckets {
  under_24h: number;
  "1_to_3d": number;
  "3_to_7d": number;
  "7_to_14d": number;
  over_14d: number;
}

export interface OldestActiveTicket {
  reference: string;
  ticket_number: string;
  subject: string;
  department: string;
  priority: string;
  status: string;
  assigned_to: string;
  age_days: number;
  created_at: string;
}

export interface TopIssuePareto {
  name: string;
  department: string;
  count: number;
  resolved: number;
  breached: number;
  breach_rate: number;
  avg_hours: number;
  sla_hours: number;
}

export interface VolumeTimeline {
  date: string;
  created: number;
  resolved: number;
}

export interface TechnicianScorecard {
  name: string;
  payroll_no: string;
  assigned: number;
  resolved: number;
  in_progress: number;
  pending: number;
  resolution_rate: number;
  sla_compliance: number;
  avg_resolution_hours: number;
}

export interface PendingReasonItem {
  reason: string;
  count: number;
}

export interface EscalationReasonItem {
  reason: string;
  count: number;
}

export interface UnitComparisonItem {
  name: string;
  code: string;
  total: number;
  open: number;
  resolved: number;
  escalated: number;
  sla_compliance: number;
  avg_resolution_hours: number;
}

export interface ProcurementLifecycle {
  total_tickets_with_attachments: number;
  quotation_requests_count: number;
  lpo_fulfilled_count: number;
  lpo_fulfillment_rate: number;
  pending_procurement_count: number;
}

export interface ComprehensiveAnalyticsResponse {
  summary: AnalyticsSummary;
  tier1_core: {
    sla_by_priority: PriorityBreakdown[];
    aging_buckets: AgingBuckets;
    oldest_active_tickets: OldestActiveTicket[];
    top_issues_pareto: TopIssuePareto[];
    volume_timeline: VolumeTimeline[];
  };
  tier2_management: {
    technician_scorecards: TechnicianScorecard[];
    pending_reasons_distribution: PendingReasonItem[];
    pending_overdue_resumption: number;
    escalation_reasons_breakdown: EscalationReasonItem[];
  };
  tier3_executive: {
    unit_comparison: UnitComparisonItem[];
    group_comparison: UnitComparisonItem[];
    procurement_lifecycle: ProcurementLifecycle;
  };
}

export interface AnalyticsQueryParams {
  period?: string;
  start_date?: string;
  end_date?: string;
  unit?: string;
  department?: string;
  group?: string;
  priority?: string;
  status?: string;
  type?: "tickets" | "technicians" | "units" | "groups";
}

export const getAnalytics = async (
  headers: { headers: { Authorization: string } },
  params?: AnalyticsQueryParams
): Promise<ComprehensiveAnalyticsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.period) queryParams.append("period", params.period);
  if (params?.start_date) queryParams.append("start_date", params.start_date);
  if (params?.end_date) queryParams.append("end_date", params.end_date);
  if (params?.unit && params.unit !== "ALL") queryParams.append("unit", params.unit);
  if (params?.department && params.department !== "ALL") queryParams.append("department", params.department);
  if (params?.group && params.group !== "ALL") queryParams.append("group", params.group);
  if (params?.priority && params.priority !== "ALL") queryParams.append("priority", params.priority);
  if (params?.status && params.status !== "ALL") queryParams.append("status", params.status);

  const url = `/api/v1/reports/analytics/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await apiActions.get(url, headers);
  return response.data;
};

export const exportReportCSV = async (
  headers: { headers: { Authorization: string } },
  params?: AnalyticsQueryParams
): Promise<Blob> => {
  const queryParams = new URLSearchParams();
  if (params?.type) queryParams.append("type", params.type);
  if (params?.period) queryParams.append("period", params.period);
  if (params?.start_date) queryParams.append("start_date", params.start_date);
  if (params?.end_date) queryParams.append("end_date", params.end_date);
  if (params?.unit && params.unit !== "ALL") queryParams.append("unit", params.unit);
  if (params?.department && params.department !== "ALL") queryParams.append("department", params.department);
  if (params?.group && params.group !== "ALL") queryParams.append("group", params.group);
  if (params?.priority && params.priority !== "ALL") queryParams.append("priority", params.priority);
  if (params?.status && params.status !== "ALL") queryParams.append("status", params.status);

  const url = `/api/v1/reports/export/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await apiActions.get(url, { ...headers, responseType: "blob" });
  return response.data;
};

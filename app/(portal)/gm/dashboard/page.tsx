"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart3,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Loader2,
  PlusCircle,
  Users,
} from "lucide-react";
import { useFetchAnalytics } from "@/hooks/reports/actions";
import { useFetchDepartments } from "@/hooks/departments/actions";
import { useFetchTickets } from "@/hooks/tickets/actions";

export default function GeneralManagerDashboard() {
  const [period, setPeriod] = useState<string>("30d");

  const { data: departments } = useFetchDepartments();
  const {
    data: analytics,
    isLoading: analyticsLoading,
    isFetching,
    refetch,
  } = useFetchAnalytics({ period });

  // Priority Escalations across unit
  const { data: escalatedTickets } = useFetchTickets({
    status: "ESCALATED",
  });

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* GM Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1.5">
            <Building2 className="w-3.5 h-3.5" />
            General Manager Oversight
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Unit Property Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Operational SLA monitoring and technician workload for your managed property.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-gray-100 p-0.5 rounded border border-gray-200">
            {["7d", "30d", "90d"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  period === p
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/tickets/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-blue hover:bg-primary-blue/95 text-white rounded text-xs font-semibold transition shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Raise Request</span>
          </Link>
        </div>
      </div>

      {analyticsLoading ? (
        <div className="p-16 text-center text-gray-500 flex flex-col items-center justify-center bg-white rounded border border-gray-200">
          <Loader2 className="w-8 h-8 animate-spin text-primary-blue mb-3" />
          <p className="text-sm font-semibold text-gray-700">Loading Property Health Metrics...</p>
        </div>
      ) : (
        <>
          {/* GM KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                Total Unit Requests
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-gray-900">
                  {analytics?.summary?.total_tickets || 0}
                </span>
                <span className="text-xs font-semibold text-primary-blue bg-blue-50 px-2 py-0.5 rounded">
                  Branch Total
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                Unit SLA Compliance
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-emerald-600">
                  {analytics?.summary?.sla_compliance_rate || 0}%
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Target: 90%
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                Escalated Tickets
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-manager-orange">
                  {escalatedTickets?.length || 0}
                </span>
                <span className="text-xs font-semibold text-manager-orange bg-orange-50 px-2 py-0.5 rounded">
                  Requires Review
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                SLA Breaches
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-red-600">
                  {analytics?.summary?.sla_breached_count || 0}
                </span>
                <span className="text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                  Past SLA
                </span>
              </div>
            </div>
          </div>

          {/* Technician Scorecards in Unit */}
          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-blue" />
                <h3 className="font-semibold text-gray-900 text-sm">
                  Technician Workload & Performance
                </h3>
              </div>
              <Link
                href="/reports"
                className="text-xs font-semibold text-primary-blue hover:underline flex items-center gap-1"
              >
                Detailed Reports <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Technician Name</th>
                    <th className="py-3 px-4">Payroll No</th>
                    <th className="py-3 px-4">Assigned</th>
                    <th className="py-3 px-4">Resolved</th>
                    <th className="py-3 px-4">In Progress</th>
                    <th className="py-3 px-4">SLA Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analytics?.tier2_management?.technician_scorecards?.map((t) => (
                    <tr key={t.payroll_no || t.name} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {t.name}
                      </td>
                      <td className="py-3 px-4 text-gray-500 font-mono">
                        {t.payroll_no || "-"}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-700">
                        {t.assigned}
                      </td>
                      <td className="py-3 px-4 text-emerald-600 font-medium">
                        {t.resolved}
                      </td>
                      <td className="py-3 px-4 text-amber-600 font-medium">
                        {t.in_progress}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            t.sla_compliance >= 90
                              ? "text-emerald-700"
                              : t.sla_compliance >= 75
                              ? "text-amber-700"
                              : "text-red-700"
                          }`}
                        >
                          {t.sla_compliance}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

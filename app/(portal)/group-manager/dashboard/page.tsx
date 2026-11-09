"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users2,
  Building2,
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart3,
  ArrowUpRight,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useFetchAnalytics } from "@/hooks/reports/actions";
import { useFetchGroups } from "@/hooks/groups/actions";

export default function GroupManagerDashboard() {
  const [period, setPeriod] = useState<string>("30d");

  const { data: groups } = useFetchGroups();

  const {
    data: analytics,
    isLoading: analyticsLoading,
    isFetching,
    refetch,
  } = useFetchAnalytics({ period });

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Group Manager Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-primary-blue border border-blue-200 mb-1.5">
            <Users2 className="w-3.5 h-3.5" />
            Group Manager Oversight
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Group Operations Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Functional cross-property oversight of departments and technicians under your group domain.
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
            href="/reports"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-blue hover:bg-primary-blue/95 text-white rounded text-xs font-semibold transition shadow-sm"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Group Reports</span>
          </Link>
        </div>
      </div>

      {analyticsLoading ? (
        <div className="p-16 text-center text-gray-500 flex flex-col items-center justify-center bg-white rounded border border-gray-200">
          <Loader2 className="w-8 h-8 animate-spin text-primary-blue mb-3" />
          <p className="text-sm font-semibold text-gray-700">Loading Group Operations Metrics...</p>
        </div>
      ) : (
        <>
          {/* Group KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                Total Group Requests
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-gray-900">
                  {analytics?.summary?.total_tickets || 0}
                </span>
                <span className="text-xs font-semibold text-primary-blue bg-blue-50 px-2 py-0.5 rounded">
                  Across Branches
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                Group SLA Compliance
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
                Active In-Flight
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-blue-600">
                  {analytics?.summary?.active_tickets || 0}
                </span>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Open / Assigned
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
                  Breached
                </span>
              </div>
            </div>
          </div>

          {/* Cross-Property Breakdown for this Group */}
          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary-blue" />
                <h3 className="font-semibold text-gray-900 text-sm">
                  Functional Activity Across Properties
                </h3>
              </div>
              <Link
                href="/reports"
                className="text-xs font-semibold text-primary-blue hover:underline flex items-center gap-1"
              >
                View Analytics <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Property / Branch</th>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Open</th>
                    <th className="py-3 px-4">Resolved</th>
                    <th className="py-3 px-4">Escalated</th>
                    <th className="py-3 px-4">SLA Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analytics?.tier3_executive?.unit_comparison?.map((u) => (
                    <tr key={u.code || u.name} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {u.name}
                      </td>
                      <td className="py-3 px-4 text-gray-500 font-mono">
                        {u.code}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-700">
                        {u.total}
                      </td>
                      <td className="py-3 px-4 text-blue-600 font-medium">
                        {u.open}
                      </td>
                      <td className="py-3 px-4 text-emerald-600 font-medium">
                        {u.resolved}
                      </td>
                      <td className="py-3 px-4 text-manager-orange font-medium">
                        {u.escalated}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            u.sla_compliance >= 90
                              ? "text-emerald-700"
                              : u.sla_compliance >= 75
                              ? "text-amber-700"
                              : "text-red-700"
                          }`}
                        >
                          {u.sla_compliance}%
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

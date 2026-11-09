"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Building2,
  Users2,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ShieldAlert,
  BarChart3,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useFetchAnalytics } from "@/hooks/reports/actions";
import { useFetchUnits } from "@/hooks/units/actions";
import { useFetchGroups } from "@/hooks/groups/actions";

export default function DirectorDashboard() {
  const [period, setPeriod] = useState<string>("30d");

  const { data: units } = useFetchUnits();
  const { data: groups } = useFetchGroups();

  const {
    data: analytics,
    isLoading,
    isFetching,
    refetch,
  } = useFetchAnalytics({ period });

  const totalUnits = units?.length || 0;
  const totalGroups = groups?.length || 0;

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-admin-purple border border-purple-200 mb-1.5">
            <Compass className="w-3.5 h-3.5" />
            Executive Oversight Level
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Director Executive Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Global portfolio view across all {totalUnits} Tamarind properties and {totalGroups} functional groups.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-gray-100 p-0.5 rounded border border-gray-200">
            {["7d", "30d", "90d", "1y"].map((p) => (
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
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/reports"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-blue hover:bg-primary-blue/95 text-white rounded text-xs font-semibold transition shadow-sm"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Full Reports & Analytics</span>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-gray-500 flex flex-col items-center justify-center bg-white rounded border border-gray-200">
          <Loader2 className="w-8 h-8 animate-spin text-primary-blue mb-3" />
          <p className="text-sm font-semibold text-gray-700">Aggregating Global Tamarind Metrics...</p>
        </div>
      ) : (
        <>
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                Total Requests Raised
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-gray-900">
                  {analytics?.summary?.total_tickets || 0}
                </span>
                <span className="text-xs font-semibold text-primary-blue bg-blue-50 px-2 py-0.5 rounded">
                  Portfolio Total
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                Overall SLA Compliance
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
                Portfolio Breached Tickets
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-red-600">
                  {analytics?.summary?.sla_breached_count || 0}
                </span>
                <span className="text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                  {analytics?.summary?.active_tickets || 0} Active
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                Average Resolution Time
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-gray-900">
                  {analytics?.summary?.mttr_hours || 0}
                </span>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  Hours / Ticket
                </span>
              </div>
            </div>
          </div>

          {/* Properties Cross-Comparison Table */}
          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary-blue" />
                <h3 className="font-semibold text-gray-900 text-sm">
                  Property Performance Benchmarks
                </h3>
              </div>
              <Link
                href="/reports"
                className="text-xs font-semibold text-primary-blue hover:underline flex items-center gap-1"
              >
                Deep-dive Analytics <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Property / Branch</th>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Total Requests</th>
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
                        <div className="flex items-center gap-2">
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
                          <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                u.sla_compliance >= 90
                                  ? "bg-emerald-500"
                                  : u.sla_compliance >= 75
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${Math.min(100, u.sla_compliance)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Functional Group Benchmarks */}
          {analytics?.tier3_executive?.group_comparison &&
            analytics.tier3_executive.group_comparison.length > 0 && (
              <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users2 className="w-5 h-5 text-admin-purple" />
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Cross-Unit Functional Group Health
                    </h3>
                  </div>
                  <Link
                    href="/admin/groups"
                    className="text-xs font-semibold text-primary-blue hover:underline flex items-center gap-1"
                  >
                    Manage Groups <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                        <th className="py-3 px-4">Functional Group</th>
                        <th className="py-3 px-4">Code</th>
                        <th className="py-3 px-4">Total Requests</th>
                        <th className="py-3 px-4">Open</th>
                        <th className="py-3 px-4">Resolved</th>
                        <th className="py-3 px-4">Escalated</th>
                        <th className="py-3 px-4">SLA Compliance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {analytics.tier3_executive.group_comparison.map((g) => (
                        <tr key={g.code || g.name} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3 px-4 font-semibold text-gray-900">
                            {g.name}
                          </td>
                          <td className="py-3 px-4 text-gray-500 font-mono">
                            {g.code}
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-700">
                            {g.total}
                          </td>
                          <td className="py-3 px-4 text-blue-600 font-medium">
                            {g.open}
                          </td>
                          <td className="py-3 px-4 text-emerald-600 font-medium">
                            {g.resolved}
                          </td>
                          <td className="py-3 px-4 text-manager-orange font-medium">
                            {g.escalated}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-semibold ${
                                g.sla_compliance >= 90
                                  ? "text-emerald-700"
                                  : g.sla_compliance >= 75
                                  ? "text-amber-700"
                                  : "text-red-700"
                              }`}
                            >
                              {g.sla_compliance}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </>
      )}
    </div>
  );
}

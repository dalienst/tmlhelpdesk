"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Building2,
  Layers,
  Users,
  Users2,
  Briefcase,
  ChevronRight,
  ShieldAlert,
  Loader2,
  FileText,
  Percent,
  CheckCircle,
  XCircle,
  Hourglass,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import { exportReportCSV } from "@/services/reports";
import { useFetchAnalytics } from "@/hooks/reports/actions";
import { useFetchUnits } from "@/hooks/units/actions";
import { useFetchDepartments } from "@/hooks/departments/actions";
import { useFetchGroups } from "@/hooks/groups/actions";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";

export default function ReportsPage() {
  const headers = useAxiosAuth();
  const [period, setPeriod] = useState<string>("30d");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("ALL");
  const [selectedGroup, setSelectedGroup] = useState<string>("ALL");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"tier1" | "tier2" | "tier3">("tier1");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

  const { data: units } = useFetchUnits();
  const { data: groups } = useFetchGroups();
  const { data: departments } = useFetchDepartments();

  const {
    data: analytics,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useFetchAnalytics({
    period,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
    unit: selectedUnit !== "ALL" ? selectedUnit : undefined,
    group: selectedGroup !== "ALL" ? selectedGroup : undefined,
    department: selectedDept !== "ALL" ? selectedDept : undefined,
    priority: selectedPriority !== "ALL" ? selectedPriority : undefined,
  });

  const handleExport = async (type: "tickets" | "technicians" | "units") => {
    if (!headers) {
      toast.error("Authentication required to export data");
      return;
    }
    setIsExporting(true);
    setShowExportMenu(false);
    const toastId = toast.loading(`Generating ${type} CSV export...`);
    try {
      const blob = await exportReportCSV(headers, {
        type,
        period,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        unit: selectedUnit !== "ALL" ? selectedUnit : undefined,
        group: selectedGroup !== "ALL" ? selectedGroup : undefined,
        department: selectedDept !== "ALL" ? selectedDept : undefined,
        priority: selectedPriority !== "ALL" ? selectedPriority : undefined,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `tamarind_${type}_report_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("CSV download complete", { id: toastId });
    } catch (err) {
      toast.error("Failed to generate CSV export", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const getPriorityBadge = (prio: string) => {
    switch (prio?.toUpperCase()) {
      case "CRITICAL":
        return <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-semibold">Critical</span>;
      case "HIGH":
        return <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-semibold">High</span>;
      case "MEDIUM":
        return <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-semibold">Medium</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 text-[10px] font-semibold">Low</span>;
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>Operational Intelligence</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-semibold text-primary-blue">Tiered Reports & Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-primary-blue" />
            4-Tier SLA & Organizational Analytics
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Executive operational pulse, technician scorecards, cross-property benchmarks, and functional group health across Tamarind operations.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-primary-blue hover:bg-primary-blue/95 text-white text-xs font-semibold transition shadow-sm disabled:opacity-70"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Export CSV</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => handleExport("tickets")}
                  className="w-full text-left px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-primary-blue" />
                  <span>Tickets & SLA Detail CSV</span>
                </button>
                <button
                  onClick={() => handleExport("technicians")}
                  className="w-full text-left px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-t border-gray-100"
                >
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Technician Performance CSV</span>
                </button>
                <button
                  onClick={() => handleExport("units")}
                  className="w-full text-left px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-t border-gray-100"
                >
                  <Building2 className="w-3.5 h-3.5 text-admin-purple" />
                  <span>Property Comparison CSV</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="bg-white p-4 rounded border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-500 mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Timeframe:
            </span>
            {[
              { id: "today", label: "Today" },
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "90d", label: "Quarter" },
              { id: "1y", label: "1 Year" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPeriod(p.id);
                  setStartDate("");
                  setEndDate("");
                }}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                  period === p.id && !startDate
                    ? "bg-primary-blue text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={() => setShowCustomModal(true)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                startDate
                  ? "bg-primary-blue text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {startDate && endDate ? `${startDate} to ${endDate}` : "Custom Date Range"}
            </button>
          </div>
        </div>

        {/* Dimension Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-gray-100 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">
              Branch / Unit
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 font-medium text-gray-800 outline-none focus:border-primary-blue focus:bg-white"
            >
              <option value="ALL">All Branches & Units</option>
              {units?.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name} ({u.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">
              Functional Group
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 font-medium text-gray-800 outline-none focus:border-primary-blue focus:bg-white"
            >
              <option value="ALL">All Functional Groups</option>
              {groups?.map((g) => (
                <option key={g.id} value={g.code}>
                  {g.name} ({g.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 font-medium text-gray-800 outline-none focus:border-primary-blue focus:bg-white"
            >
              <option value="ALL">All Departments</option>
              {departments?.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">
              Priority Filter
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 font-medium text-gray-800 outline-none focus:border-primary-blue focus:bg-white"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tiered Tab Navigation */}
      <div className="flex border-b border-gray-200 gap-1 bg-white px-2 pt-2 rounded-t border-t border-x">
        <button
          onClick={() => setActiveTab("tier1")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
            activeTab === "tier1"
              ? "border-primary-blue text-primary-blue"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Tier 1: Operational Pulse & Aging</span>
        </button>

        <button
          onClick={() => setActiveTab("tier2")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
            activeTab === "tier2"
              ? "border-primary-blue text-primary-blue"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Tier 2: Technician Scorecards</span>
        </button>

        <button
          onClick={() => setActiveTab("tier3")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
            activeTab === "tier3"
              ? "border-primary-blue text-primary-blue"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Tier 3: Strategic Executive Benchmarks</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {isLoading ? (
        <div className="bg-white p-16 rounded-b border border-gray-200 text-center flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-blue mb-3" />
          <p className="text-sm font-semibold text-gray-700">Calculating SLA & Performance Metrics...</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-b border border-gray-200 shadow-sm space-y-6">
          {/* TAB 1: OPERATIONAL PULSE */}
          {activeTab === "tier1" && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded border border-gray-200 bg-gray-50/50">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                    Total Inbound Requests
                  </span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {analytics?.summary?.total_tickets || 0}
                    </span>
                    <span className="text-xs font-semibold text-primary-blue">
                      100% of Volume
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded border border-gray-200 bg-gray-50/50">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                    SLA Compliance Rate
                  </span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className={`text-3xl font-bold ${
                      (analytics?.summary?.sla_compliance_rate || 0) >= 90
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}>
                      {analytics?.summary?.sla_compliance_rate || 0}%
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Target 90%+
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded border border-gray-200 bg-gray-50/50">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                    SLA Breached Tickets
                  </span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-3xl font-bold text-red-600">
                      {analytics?.summary?.sla_breached_count || 0}
                    </span>
                    <span className="text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                      Exceeded Limit
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded border border-gray-200 bg-gray-50/50">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                    Mean Resolution Time (MTTR)
                  </span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {analytics?.summary?.mttr_hours || 0}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      Hours per Ticket
                    </span>
                  </div>
                </div>
              </div>

              {/* Priority Breakdown Table */}
              <div className="border border-gray-200 rounded overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-200 font-semibold text-xs text-gray-800">
                  SLA Performance by Priority Level
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-500 uppercase font-semibold">
                        <th className="py-2.5 px-3">Priority</th>
                        <th className="py-2.5 px-3">Total</th>
                        <th className="py-2.5 px-3">Resolved</th>
                        <th className="py-2.5 px-3">SLA Met</th>
                        <th className="py-2.5 px-3">Breached</th>
                        <th className="py-2.5 px-3">Compliance Rate</th>
                        <th className="py-2.5 px-3">Mean Res (Hrs)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {analytics?.tier1_core?.sla_by_priority?.map((p) => (
                        <tr key={p.priority} className="hover:bg-gray-50/70">
                          <td className="py-2.5 px-3 font-semibold text-gray-900">
                            {getPriorityBadge(p.priority)}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-gray-800">{p.total}</td>
                          <td className="py-2.5 px-3 text-emerald-600 font-medium">{p.resolved}</td>
                          <td className="py-2.5 px-3 text-blue-600 font-medium">{p.sla_met}</td>
                          <td className="py-2.5 px-3 text-red-600 font-medium">{p.sla_breached}</td>
                          <td className="py-2.5 px-3 font-semibold text-gray-900">{p.compliance_rate}%</td>
                          <td className="py-2.5 px-3 text-gray-600">{p.avg_resolution_hours}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Backlog Aging Distribution */}
              {analytics?.tier1_core?.aging_buckets && (
                <div className="border border-gray-200 rounded p-4">
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
                    Active Ticket Backlog Aging
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-center">
                      <p className="text-xs text-emerald-700 font-medium">&lt; 24 Hours</p>
                      <p className="text-xl font-bold text-emerald-800 mt-1">
                        {analytics.tier1_core.aging_buckets.under_24h}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded border border-blue-200 text-center">
                      <p className="text-xs text-blue-700 font-medium">1 - 3 Days</p>
                      <p className="text-xl font-bold text-blue-800 mt-1">
                        {analytics.tier1_core.aging_buckets["1_to_3d"]}
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded border border-yellow-200 text-center">
                      <p className="text-xs text-yellow-700 font-medium">3 - 7 Days</p>
                      <p className="text-xl font-bold text-yellow-800 mt-1">
                        {analytics.tier1_core.aging_buckets["3_to_7d"]}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded border border-orange-200 text-center">
                      <p className="text-xs text-orange-700 font-medium">7 - 14 Days</p>
                      <p className="text-xl font-bold text-orange-800 mt-1">
                        {analytics.tier1_core.aging_buckets["7_to_14d"]}
                      </p>
                    </div>
                    <div className="p-3 bg-red-50 rounded border border-red-200 text-center">
                      <p className="text-xs text-red-700 font-medium">&gt; 14 Days</p>
                      <p className="text-xl font-bold text-red-800 mt-1">
                        {analytics.tier1_core.aging_buckets.over_14d}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TECHNICIANS */}
          {activeTab === "tier2" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Technician Individual Workload & SLA Scorecard
                </h3>
                <div className="border border-gray-200 rounded overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                        <th className="py-2.5 px-3">Technician</th>
                        <th className="py-2.5 px-3">Payroll No</th>
                        <th className="py-2.5 px-3">Assigned</th>
                        <th className="py-2.5 px-3">Resolved</th>
                        <th className="py-2.5 px-3">In Progress</th>
                        <th className="py-2.5 px-3">Pending</th>
                        <th className="py-2.5 px-3">Resolution Rate</th>
                        <th className="py-2.5 px-3">SLA Compliance</th>
                        <th className="py-2.5 px-3">Mean Res (Hrs)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {analytics?.tier2_management?.technician_scorecards?.map((t) => (
                        <tr key={t.payroll_no || t.name} className="hover:bg-gray-50/70">
                          <td className="py-2.5 px-3 font-semibold text-gray-900">{t.name}</td>
                          <td className="py-2.5 px-3 text-gray-500 font-mono">{t.payroll_no || "-"}</td>
                          <td className="py-2.5 px-3 font-medium text-gray-800">{t.assigned}</td>
                          <td className="py-2.5 px-3 text-emerald-600 font-medium">{t.resolved}</td>
                          <td className="py-2.5 px-3 text-amber-600 font-medium">{t.in_progress}</td>
                          <td className="py-2.5 px-3 text-gray-600 font-medium">{t.pending}</td>
                          <td className="py-2.5 px-3 text-blue-600 font-medium">{t.resolution_rate}%</td>
                          <td className="py-2.5 px-3 font-semibold text-gray-900">{t.sla_compliance}%</td>
                          <td className="py-2.5 px-3 font-medium text-gray-700">{t.avg_resolution_hours}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STRATEGIC BENCHMARKS & GROUPS */}
          {activeTab === "tier3" && (
            <div className="space-y-6">
              {/* Unit Comparison */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary-blue" />
                  Cross-Property Branch Benchmarking
                </h3>
                <div className="border border-gray-200 rounded overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                        <th className="py-2.5 px-3">Branch / Property</th>
                        <th className="py-2.5 px-3">Code</th>
                        <th className="py-2.5 px-3">Total Requests</th>
                        <th className="py-2.5 px-3">Open</th>
                        <th className="py-2.5 px-3">Resolved</th>
                        <th className="py-2.5 px-3">Escalated</th>
                        <th className="py-2.5 px-3">SLA Compliance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {analytics?.tier3_executive?.unit_comparison?.map((u) => (
                        <tr key={u.code || u.name} className="hover:bg-gray-50/70">
                          <td className="py-2.5 px-3 font-semibold text-gray-900">{u.name}</td>
                          <td className="py-2.5 px-3 text-gray-500 font-mono">{u.code}</td>
                          <td className="py-2.5 px-3 font-medium text-gray-800">{u.total}</td>
                          <td className="py-2.5 px-3 text-blue-600 font-medium">{u.open}</td>
                          <td className="py-2.5 px-3 text-emerald-600 font-medium">{u.resolved}</td>
                          <td className="py-2.5 px-3 text-manager-orange font-medium">{u.escalated}</td>
                          <td className="py-2.5 px-3 font-semibold text-gray-900">{u.sla_compliance}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Functional Group Comparison */}
              {analytics?.tier3_executive?.group_comparison &&
                analytics.tier3_executive.group_comparison.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Users2 className="w-4 h-4 text-admin-purple" />
                      Cross-Unit Functional Group Health
                    </h3>
                    <div className="border border-gray-200 rounded overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                            <th className="py-2.5 px-3">Functional Domain</th>
                            <th className="py-2.5 px-3">Code</th>
                            <th className="py-2.5 px-3">Total Requests</th>
                            <th className="py-2.5 px-3">Open</th>
                            <th className="py-2.5 px-3">Resolved</th>
                            <th className="py-2.5 px-3">Escalated</th>
                            <th className="py-2.5 px-3">SLA Compliance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {analytics.tier3_executive.group_comparison.map((g) => (
                            <tr key={g.code || g.name} className="hover:bg-gray-50/70">
                              <td className="py-2.5 px-3 font-semibold text-gray-900">{g.name}</td>
                              <td className="py-2.5 px-3 text-gray-500 font-mono">{g.code}</td>
                              <td className="py-2.5 px-3 font-medium text-gray-800">{g.total}</td>
                              <td className="py-2.5 px-3 text-blue-600 font-medium">{g.open}</td>
                              <td className="py-2.5 px-3 text-emerald-600 font-medium">{g.resolved}</td>
                              <td className="py-2.5 px-3 text-manager-orange font-medium">{g.escalated}</td>
                              <td className="py-2.5 px-3 font-semibold text-gray-900">{g.sla_compliance}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      )}

      {/* Custom Date Range Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-sm p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Custom Analytics Timeframe</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-primary-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-primary-blue"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setShowCustomModal(false);
                }}
                className="px-3 py-1.5 rounded text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Clear
              </button>
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-1.5 rounded bg-primary-blue text-white text-xs font-semibold hover:bg-primary-blue/95"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

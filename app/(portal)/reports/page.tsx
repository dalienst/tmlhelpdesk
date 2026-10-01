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
  ShoppingBag,
} from "lucide-react";
import { exportReportCSV } from "@/services/reports";
import { useFetchAnalytics } from "@/hooks/reports/actions";
import { useFetchUnits } from "@/hooks/units/actions";
import { useFetchDepartments } from "@/hooks/departments/actions";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";

export default function ReportsPage() {
  const headers = useAxiosAuth();
  const [period, setPeriod] = useState<string>("30d");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("ALL");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"tier1" | "tier2" | "tier3">("tier1");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

  const { data: units } = useFetchUnits();
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

  const getSlaColor = (rate: number) => {
    if (rate >= 90) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (rate >= 75) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-red-700 bg-red-50 border-red-200";
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
      {/* Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
            <Link href="/" className="hover:text-red-800 transition">Portal</Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-900 font-medium">Reports & Analytics</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-red-800" />
            Enterprise Reports & Operational Intelligence
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            SLA performance, technician scorecards, backlog aging, and unit analytics across Tamarind Group.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition shadow-xs disabled:opacity-60"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-red-800" : ""}`} />
            Refresh
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-red-800 hover:bg-red-900 rounded transition shadow-xs disabled:opacity-60"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              Export CSV
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {showExportMenu && (
              <div
                className="absolute right-0 mt-1.5 w-52 bg-white border border-gray-200 rounded shadow-lg z-50 py-1 text-xs"
                onMouseLeave={() => setShowExportMenu(false)}
              >
                <button
                  onClick={() => handleExport("tickets")}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="font-medium text-gray-900">Tickets Register</p>
                    <p className="text-[10px] text-gray-500">All matching tickets & SLA times</p>
                  </div>
                </button>
                <button
                  onClick={() => handleExport("technicians")}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 border-t border-gray-100"
                >
                  <Users className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Technician Scorecard</p>
                    <p className="text-[10px] text-gray-500">Output, resolution rate & MTTR</p>
                  </div>
                </button>
                <button
                  onClick={() => handleExport("units")}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 border-t border-gray-100"
                >
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Unit Comparison</p>
                    <p className="text-[10px] text-gray-500">Property workload & compliance</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white border border-gray-200 rounded p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Period Selector */}
          <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded border border-gray-200 text-xs">
            {[
              { id: "today", label: "Today" },
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "90d", label: "90 Days" },
              { id: "ytd", label: "Year to Date" },
              { id: "all", label: "All Time" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPeriod(p.id);
                  setStartDate("");
                  setEndDate("");
                }}
                className={`px-2.5 py-1 rounded text-xs transition ${
                  period === p.id
                    ? "bg-white text-gray-900 font-semibold shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={() => setShowCustomModal(true)}
              className={`px-2.5 py-1 rounded text-xs transition flex items-center gap-1 ${
                period === "custom"
                  ? "bg-white text-gray-900 font-semibold shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Calendar className="w-3 h-3" />
              {period === "custom" && startDate && endDate
                ? `${startDate} - ${endDate}`
                : "Custom"}
            </button>
          </div>

          {/* Dimension Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Unit Filter */}
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 border border-gray-200 rounded">
              <Building2 className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="bg-transparent text-gray-700 outline-none text-xs cursor-pointer font-medium"
              >
                <option value="ALL">All Properties / Units</option>
                {units?.map((u) => (
                  <option key={u.id} value={u.reference}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 border border-gray-200 rounded">
              <Layers className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-transparent text-gray-700 outline-none text-xs cursor-pointer font-medium"
              >
                <option value="ALL">All Departments</option>
                {departments?.map((d) => (
                  <option key={d.id} value={d.reference}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 border border-gray-200 rounded">
              <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="bg-transparent text-gray-700 outline-none text-xs cursor-pointer font-medium"
              >
                <option value="ALL">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Custom Date Modal / Expandable Box */}
        {showCustomModal && (
          <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center gap-3 text-xs bg-gray-50/50 p-2.5 rounded">
            <span className="font-medium text-gray-700">Custom Date Range:</span>
            <div className="flex items-center gap-2">
              <label className="text-gray-500">From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white border border-gray-200 rounded px-2 py-1 text-xs outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-gray-500">To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white border border-gray-200 rounded px-2 py-1 text-xs outline-none"
              />
            </div>
            <button
              onClick={() => {
                if (startDate && endDate) {
                  setPeriod("custom");
                  setShowCustomModal(false);
                } else {
                  toast.error("Please pick both start and end dates");
                }
              }}
              className="px-2.5 py-1 bg-red-800 text-white rounded font-medium hover:bg-red-900 transition"
            >
              Apply Filter
            </button>
            <button
              onClick={() => setShowCustomModal(false)}
              className="px-2 py-1 text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white border border-gray-200 rounded">
          <Loader2 className="w-8 h-8 animate-spin text-red-800" />
          <p className="text-xs text-gray-500 font-medium">Aggregating enterprise operational reports...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded text-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-red-900">Failed to load reporting data</p>
          <p className="text-xs text-red-700 mt-1">Please check server connectivity or try refreshing.</p>
          <button
            onClick={() => refetch()}
            className="mt-3 px-3 py-1.5 bg-red-800 text-white rounded text-xs font-medium hover:bg-red-900 transition"
          >
            Retry Loading
          </button>
        </div>
      ) : analytics ? (
        <>
          {/* Top Executive KPI Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Total Tickets */}
            <div className="bg-white border border-gray-200 rounded p-4 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
                <span>Total Requests</span>
                <FileText className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {analytics.summary.total_tickets.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                <span className="text-emerald-600 font-medium">{analytics.summary.resolved_tickets} resolved</span>
                {" · "}
                <span className="text-amber-600 font-medium">{analytics.summary.active_tickets} active</span>
              </p>
            </div>

            {/* SLA Compliance */}
            <div className="bg-white border border-gray-200 rounded p-4 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
                <span>SLA Adherence</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-semibold text-gray-900">
                  {analytics.summary.sla_compliance_rate}%
                </p>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${getSlaColor(
                    analytics.summary.sla_compliance_rate
                  )}`}
                >
                  {analytics.summary.sla_compliance_rate >= 90 ? "Target Met" : "Under Target"}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                {analytics.summary.sla_met_count} met · {analytics.summary.sla_breached_count} breached
              </p>
            </div>

            {/* Mean Time to Resolution (MTTR) */}
            <div className="bg-white border border-gray-200 rounded p-4 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
                <span>Mean Turnaround (MTTR)</span>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {analytics.summary.mttr_hours} <span className="text-xs font-normal text-gray-500">hrs</span>
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                From creation to verified resolution
              </p>
            </div>

            {/* On-Hold & Paused Hours */}
            <div className="bg-white border border-gray-200 rounded p-4 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
                <span>Paused Hours (Parts/Vendor)</span>
                <Hourglass className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {analytics.summary.total_paused_hours} <span className="text-xs font-normal text-gray-500">hrs</span>
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Fairly deducted from SLA timers
              </p>
            </div>

            {/* Escalation Rate */}
            <div className="bg-white border border-gray-200 rounded p-4 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
                <span>Escalation Rate</span>
                <ShieldAlert className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-semibold text-gray-900">
                  {analytics.summary.escalation_rate}%
                </p>
                <span className="text-[10px] text-gray-500 font-medium">
                  ({analytics.summary.escalated_tickets} total)
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Elevated to Management / HOD
              </p>
            </div>
          </div>

          {/* Three Tier Tabs Selector */}
          <div className="border-b border-gray-200 flex items-center gap-6 text-xs font-medium">
            <button
              onClick={() => setActiveTab("tier1")}
              className={`pb-3 flex items-center gap-2 border-b-2 transition ${
                activeTab === "tier1"
                  ? "border-red-800 text-red-800 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <Clock className="w-4 h-4" />
              Tier 1: Core Operations & SLA
            </button>
            <button
              onClick={() => setActiveTab("tier2")}
              className={`pb-3 flex items-center gap-2 border-b-2 transition ${
                activeTab === "tier2"
                  ? "border-red-800 text-red-800 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <Users className="w-4 h-4" />
              Tier 2: Management & Productivity
            </button>
            <button
              onClick={() => setActiveTab("tier3")}
              className={`pb-3 flex items-center gap-2 border-b-2 transition ${
                activeTab === "tier3"
                  ? "border-red-800 text-red-800 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Tier 3: Executive, Cross-Unit & Operational Workflows
            </button>
          </div>

          {/* ============================================================== */}
          {/* TAB 1: CORE OPERATIONS & SLA */}
          {/* ============================================================== */}
          {activeTab === "tier1" && (
            <div className="space-y-6">
              {/* Row 1: SLA by Priority & Ticket Aging Buckets */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SLA by Priority */}
                <div className="bg-white border border-gray-200 rounded p-4 shadow-xs">
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>SLA Compliance by Priority</span>
                    <span className="text-[11px] font-normal text-gray-500">Target vs Actual</span>
                  </h3>
                  <div className="space-y-3">
                    {analytics.tier1_core.sla_by_priority.map((prio) => (
                      <div key={prio.priority} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(prio.priority)}
                            <span className="text-gray-600">
                              {prio.total} tickets ({prio.resolved} resolved)
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-500 text-[11px]">
                            <span>Avg {prio.avg_resolution_hours} hrs</span>
                            <span className="font-semibold text-gray-900">{prio.compliance_rate}% SLA</span>
                          </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              prio.compliance_rate >= 90
                                ? "bg-emerald-600"
                                : prio.compliance_rate >= 75
                                ? "bg-amber-500"
                                : "bg-red-600"
                            }`}
                            style={{ width: `${prio.compliance_rate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ticket Aging & Backlog Health */}
                <div className="bg-white border border-gray-200 rounded p-4 shadow-xs">
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Active Ticket Aging Distribution</span>
                    <span className="text-[11px] font-normal text-gray-500">WIP & Pending Backlog</span>
                  </h3>
                  <div className="grid grid-cols-5 gap-2 text-center mb-4">
                    <div className="p-2.5 rounded bg-emerald-50 border border-emerald-100">
                      <p className="text-lg font-semibold text-emerald-800">
                        {analytics.tier1_core.aging_buckets.under_24h}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-medium mt-0.5">&lt; 24 Hours</p>
                    </div>
                    <div className="p-2.5 rounded bg-blue-50 border border-blue-100">
                      <p className="text-lg font-semibold text-blue-800">
                        {analytics.tier1_core.aging_buckets["1_to_3d"]}
                      </p>
                      <p className="text-[10px] text-blue-700 font-medium mt-0.5">1–3 Days</p>
                    </div>
                    <div className="p-2.5 rounded bg-amber-50 border border-amber-100">
                      <p className="text-lg font-semibold text-amber-800">
                        {analytics.tier1_core.aging_buckets["3_to_7d"]}
                      </p>
                      <p className="text-[10px] text-amber-700 font-medium mt-0.5">3–7 Days</p>
                    </div>
                    <div className="p-2.5 rounded bg-orange-50 border border-orange-100">
                      <p className="text-lg font-semibold text-orange-800">
                        {analytics.tier1_core.aging_buckets["7_to_14d"]}
                      </p>
                      <p className="text-[10px] text-orange-700 font-medium mt-0.5">7–14 Days</p>
                    </div>
                    <div className="p-2.5 rounded bg-red-50 border border-red-100">
                      <p className="text-lg font-semibold text-red-800">
                        {analytics.tier1_core.aging_buckets.over_14d}
                      </p>
                      <p className="text-[10px] text-red-700 font-medium mt-0.5">&gt; 14 Days</p>
                    </div>
                  </div>

                  {/* Oldest Active Tickets alert list */}
                  <h4 className="text-[11px] font-semibold text-gray-700 mb-2">Longest Running Active Requests:</h4>
                  {analytics.tier1_core.oldest_active_tickets.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No active overdue backlog.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {analytics.tier1_core.oldest_active_tickets.map((t) => (
                        <Link
                          key={t.reference}
                          href={`/tickets/${t.reference}`}
                          className="flex items-center justify-between p-2 rounded hover:bg-gray-50 border border-gray-100 text-xs transition group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-medium text-gray-900 group-hover:text-red-800">
                              {t.ticket_number}
                            </span>
                            <span className="text-gray-600 truncate max-w-[180px]">{t.subject}</span>
                            {getPriorityBadge(t.priority)}
                          </div>
                          <div className="flex items-center gap-3 text-gray-500 text-[11px]">
                            <span>{t.department}</span>
                            <span className="font-semibold text-red-700">{t.age_days} days old</span>
                            <ArrowUpRight className="w-3 h-3 text-gray-400 group-hover:text-red-800 transition" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Service Catalog Pareto Analysis (Top 10 Frequent Issues) */}
              <div className="bg-white border border-gray-200 rounded p-4 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Service Catalog Incident Frequency (Pareto Analysis)
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Most requested services, breach frequencies, and turnaround velocity
                    </p>
                  </div>
                  <span className="text-[11px] text-gray-500">Top 10 Services</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 bg-gray-50/50">
                        <th className="py-2 px-3 font-medium">Service / Issue</th>
                        <th className="py-2 px-3 font-medium">Department</th>
                        <th className="py-2 px-3 font-medium text-center">Volume</th>
                        <th className="py-2 px-3 font-medium text-center">Resolved</th>
                        <th className="py-2 px-3 font-medium text-center">Breach Rate</th>
                        <th className="py-2 px-3 font-medium text-center">Target SLA</th>
                        <th className="py-2 px-3 font-medium text-right">Avg Turnaround</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {analytics.tier1_core.top_issues_pareto.map((iss, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/60 transition">
                          <td className="py-2 px-3 font-medium text-gray-900 flex items-center gap-2">
                            <span className="w-4 text-center text-gray-400 text-[10px]">{idx + 1}</span>
                            {iss.name}
                          </td>
                          <td className="py-2 px-3 text-gray-600">{iss.department}</td>
                          <td className="py-2 px-3 text-center font-semibold text-gray-900">{iss.count}</td>
                          <td className="py-2 px-3 text-center text-gray-600">{iss.resolved}</td>
                          <td className="py-2 px-3 text-center">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                iss.breach_rate > 20
                                  ? "bg-red-50 text-red-700"
                                  : iss.breach_rate > 0
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {iss.breach_rate}%
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center text-gray-500">{iss.sla_hours} hrs</td>
                          <td className="py-2 px-3 text-right font-medium text-gray-900">
                            {iss.avg_hours} hrs
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: MANAGEMENT & PRODUCTIVITY */}
          {/* ============================================================== */}
          {activeTab === "tier2" && (
            <div className="space-y-6">
              {/* Technician Productivity Scorecard */}
              <div className="bg-white border border-gray-200 rounded p-4 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Technician Productivity Scorecard
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Workload allocation, resolution efficiency, and SLA compliance per officer
                    </p>
                  </div>
                  <button
                    onClick={() => handleExport("technicians")}
                    className="text-xs text-red-800 hover:text-red-900 font-medium flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Export Scorecard CSV
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 bg-gray-50/50">
                        <th className="py-2 px-3 font-medium">Technician / Officer</th>
                        <th className="py-2 px-3 font-medium text-center">Payroll No</th>
                        <th className="py-2 px-3 font-medium text-center">Assigned</th>
                        <th className="py-2 px-3 font-medium text-center">In Progress</th>
                        <th className="py-2 px-3 font-medium text-center">On Hold</th>
                        <th className="py-2 px-3 font-medium text-center">Resolved</th>
                        <th className="py-2 px-3 font-medium text-center">Resolution Rate</th>
                        <th className="py-2 px-3 font-medium text-center">SLA Adherence</th>
                        <th className="py-2 px-3 font-medium text-right">MTTR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {analytics.tier2_management.technician_scorecards.map((tech) => (
                        <tr key={tech.name} className="hover:bg-gray-50/60 transition">
                          <td className="py-2.5 px-3 font-medium text-gray-900">
                            {tech.name}
                          </td>
                          <td className="py-2.5 px-3 text-center text-gray-500 font-mono text-[11px]">
                            {tech.payroll_no}
                          </td>
                          <td className="py-2.5 px-3 text-center font-semibold text-gray-900">{tech.assigned}</td>
                          <td className="py-2.5 px-3 text-center text-blue-700 font-medium">{tech.in_progress}</td>
                          <td className="py-2.5 px-3 text-center text-amber-700 font-medium">{tech.pending}</td>
                          <td className="py-2.5 px-3 text-center text-emerald-700 font-semibold">{tech.resolved}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="font-medium text-gray-900">{tech.resolution_rate}%</span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getSlaColor(
                                tech.sla_compliance
                              )}`}
                            >
                              {tech.sla_compliance}%
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium text-gray-900">
                            {tech.avg_resolution_hours} hrs
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Waiting Flow ("On-Hold") & Escalation Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending / On-Hold Bottlenecks */}
                <div className="bg-white border border-gray-200 rounded p-4 shadow-xs">
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Pending / "On-Hold" Reasons Breakdown</span>
                    <Hourglass className="w-4 h-4 text-amber-500" />
                  </h3>
                  <p className="text-[11px] text-gray-500 mb-3">
                    Why requests take more than one day and SLA clocks are paused
                  </p>

                  <div className="space-y-2.5">
                    {analytics.tier2_management.pending_reasons_distribution.map((p) => (
                      <div key={p.reason} className="flex items-center justify-between p-2 rounded bg-gray-50 text-xs">
                        <span className="text-gray-700 font-medium">{p.reason}</span>
                        <span className="font-semibold text-gray-900 px-2 py-0.5 rounded bg-white border border-gray-200">
                          {p.count} tickets
                        </span>
                      </div>
                    ))}
                  </div>

                  {analytics.tier2_management.pending_overdue_resumption > 0 && (
                    <div className="mt-3 p-2.5 rounded bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        <strong>{analytics.tier2_management.pending_overdue_resumption} tickets</strong> have passed their
                        expected resumption date without reactivation.
                      </span>
                    </div>
                  )}
                </div>

                {/* Escalations & Critical Incident Audit */}
                <div className="bg-white border border-gray-200 rounded p-4 shadow-xs">
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Escalations & Incident Severity</span>
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                  </h3>
                  <p className="text-[11px] text-gray-500 mb-3">
                    Tickets elevated to Management / HOD and recorded root causes
                  </p>

                  {analytics.tier2_management.escalation_reasons_breakdown.length === 0 ? (
                    <div className="py-8 text-center text-xs text-gray-400">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                      No escalated tickets in selected period.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {analytics.tier2_management.escalation_reasons_breakdown.map((e) => (
                        <div key={e.reason} className="flex items-center justify-between p-2 rounded bg-red-50/50 border border-red-100 text-xs">
                          <span className="text-red-900 font-medium">{e.reason}</span>
                          <span className="font-semibold text-red-700 px-2 py-0.5 rounded bg-white border border-red-200">
                            {e.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: EXECUTIVE, UNITS & PROCUREMENT */}
          {/* ============================================================== */}
          {activeTab === "tier3" && (
            <div className="space-y-6">
              {/* Cross-Unit Comparative Table */}
              <div className="bg-white border border-gray-200 rounded p-4 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Cross-Unit Comparative Analytics
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Operational performance and service delivery across Tamarind properties
                    </p>
                  </div>
                  <button
                    onClick={() => handleExport("units")}
                    className="text-xs text-red-800 hover:text-red-900 font-medium flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Export Unit CSV
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 bg-gray-50/50">
                        <th className="py-2 px-3 font-medium">Property / Unit</th>
                        <th className="py-2 px-3 font-medium text-center">Code</th>
                        <th className="py-2 px-3 font-medium text-center">Total Requests</th>
                        <th className="py-2 px-3 font-medium text-center">Open Backlog</th>
                        <th className="py-2 px-3 font-medium text-center">Resolved</th>
                        <th className="py-2 px-3 font-medium text-center">Escalations</th>
                        <th className="py-2 px-3 font-medium text-center">SLA Compliance</th>
                        <th className="py-2 px-3 font-medium text-right">Avg Turnaround</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {analytics.tier3_executive.unit_comparison.map((u) => (
                        <tr key={u.name} className="hover:bg-gray-50/60 transition">
                          <td className="py-2.5 px-3 font-medium text-gray-900 flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-gray-400" />
                            {u.name}
                          </td>
                          <td className="py-2.5 px-3 text-center text-gray-500 font-mono text-[11px]">{u.code}</td>
                          <td className="py-2.5 px-3 text-center font-semibold text-gray-900">{u.total}</td>
                          <td className="py-2.5 px-3 text-center text-amber-700 font-medium">{u.open}</td>
                          <td className="py-2.5 px-3 text-center text-emerald-700 font-medium">{u.resolved}</td>
                          <td className="py-2.5 px-3 text-center text-red-700 font-medium">{u.escalated}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getSlaColor(
                                u.sla_compliance
                              )}`}
                            >
                              {u.sla_compliance}%
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium text-gray-900">
                            {u.avg_resolution_hours} hrs
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Documented Operations & Verified Work Deliverables */}
              <div className="bg-white border border-gray-200 rounded p-4 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Documented Operations & Verified Work Deliverables
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Tracking service requests with supporting evidence (fault photos, error logs, specs) and technician resolution deliverables (signed job cards, completion reports)
                    </p>
                  </div>
                  <ShoppingBag className="w-4 h-4 text-red-800" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 rounded bg-gray-50 border border-gray-200">
                    <p className="text-xs text-gray-500">Documented Service Requests</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">
                      {analytics.tier3_executive.procurement_lifecycle.quotation_requests_count}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Tickets with fault photos / docs</p>
                  </div>

                  <div className="p-3 rounded bg-emerald-50 border border-emerald-100">
                    <p className="text-xs text-emerald-700">Verified Work Deliverables</p>
                    <p className="text-xl font-semibold text-emerald-900 mt-1">
                      {analytics.tier3_executive.procurement_lifecycle.lpo_fulfilled_count}
                    </p>
                    <p className="text-[10px] text-emerald-700 mt-0.5">Signed job cards / completion proof</p>
                  </div>

                  <div className="p-3 rounded bg-blue-50 border border-blue-100">
                    <p className="text-xs text-blue-700">Deliverable Completion Rate</p>
                    <p className="text-xl font-semibold text-blue-900 mt-1">
                      {analytics.tier3_executive.procurement_lifecycle.lpo_fulfillment_rate}%
                    </p>
                    <p className="text-[10px] text-blue-700 mt-0.5">Verified vs requested</p>
                  </div>

                  <div className="p-3 rounded bg-amber-50 border border-amber-100">
                    <p className="text-xs text-amber-700">Awaiting Work Deliverable</p>
                    <p className="text-xl font-semibold text-amber-900 mt-1">
                      {analytics.tier3_executive.procurement_lifecycle.pending_procurement_count}
                    </p>
                    <p className="text-[10px] text-amber-700 mt-0.5">Technician work in progress</p>
                  </div>
                </div>

                <div className="p-3 rounded bg-gray-50 border border-gray-100 text-xs text-gray-600 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-800 shrink-0 mt-0.5" />
                  <span>
                    <strong>Universal Hospitality Operations:</strong> All frontline staff across Food &amp; Beverage (waiters, bar staff), Housekeeping, Maintenance, IT, HR, and Stores can attach photos of issues or specs directly via MinIO (<code>media.tamarind.co.ke</code> / <code>tml-helpdesk</code>). Technicians and supervisors attach signed maintenance job cards, diagnostic reports, and proof of work deliverables upon resolving requests.
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

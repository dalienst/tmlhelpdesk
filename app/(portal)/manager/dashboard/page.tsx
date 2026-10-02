"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Loader2,
  Ticket as TicketIcon,
  UserCheck,
  Search,
  Filter,
  PlusCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Building2,
  Layers,
  ChevronRight,
} from "lucide-react";
import { useFetchTickets } from "@/hooks/tickets/actions";
import { useFetchDepartments } from "@/hooks/departments/actions";

export default function ManagerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dept_tickets" | "my_tickets">("dept_tickets");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");

  const { data: departments } = useFetchDepartments();

  // Department tickets queue
  const {
    data: deptTickets,
    isLoading: deptLoading,
    error: deptError,
    refetch: refetchDept,
    isFetching: deptFetching,
  } = useFetchTickets({
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    priority: priorityFilter !== "ALL" ? priorityFilter : undefined,
    department: departmentFilter !== "ALL" ? departmentFilter : undefined,
  });

  // Manager's own raised tickets (as an employee)
  const {
    data: myRaisedTickets,
    isLoading: myRaisedLoading,
    refetch: refetchMyRaised,
    isFetching: myRaisedFetching,
  } = useFetchTickets({ my_tickets: true });

  const activeTickets = activeTab === "dept_tickets" ? deptTickets : myRaisedTickets;
  const isCurrentLoading = activeTab === "dept_tickets" ? deptLoading : myRaisedLoading;
  const isCurrentFetching = deptFetching || myRaisedFetching;

  // KPI Calculations on Department queue
  const totalTickets = deptTickets?.length || 0;
  const openTickets =
    deptTickets?.filter((t) =>
      ["OPEN", "IN_PROGRESS", "PENDING"].includes(t.status?.toUpperCase())
    ).length || 0;
  const inProgressTickets =
    deptTickets?.filter((t) => t.status?.toUpperCase() === "IN_PROGRESS").length || 0;
  const resolvedTickets =
    deptTickets?.filter((t) =>
      ["RESOLVED", "CLOSED"].includes(t.status?.toUpperCase())
    ).length || 0;
  const criticalTickets =
    deptTickets?.filter(
      (t) =>
        ["CRITICAL", "HIGH"].includes(t.priority?.toUpperCase()) &&
        !["RESOLVED", "CLOSED"].includes(t.status?.toUpperCase())
    ).length || 0;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "OPEN":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-500" />
            Open
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200">
            <Clock className="w-3 h-3 text-blue-500" />
            In Progress
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-semibold border border-purple-200">
            <Clock className="w-3 h-3 text-purple-500" />
            Pending
          </span>
        );
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Resolved
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-semibold border border-gray-200">
            Closed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-primary-red text-[10px] font-semibold border border-red-200">
            <XCircle className="w-3 h-3 text-primary-red" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50 text-gray-600 text-[10px] font-semibold border border-gray-200">
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "CRITICAL":
        return (
          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-800">
            CRITICAL
          </span>
        );
      case "HIGH":
        return (
          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-800">
            HIGH
          </span>
        );
      case "MEDIUM":
        return (
          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
            LOW
          </span>
        );
    }
  };

  const filteredTickets = activeTickets?.filter((ticket) => {
    const term = searchTerm.toLowerCase();
    return (
      ticket.subject?.toLowerCase().includes(term) ||
      ticket.ticket_number?.toLowerCase().includes(term) ||
      ticket.requester_name?.toLowerCase().includes(term) ||
      ticket.requester_email?.toLowerCase().includes(term) ||
      ticket.requester_payroll_no?.toLowerCase().includes(term) ||
      ticket.assigned_to_name?.toLowerCase().includes(term) ||
      ticket.issue_name?.toLowerCase().includes(term) ||
      ticket.category_name?.toLowerCase().includes(term) ||
      ticket.department_name?.toLowerCase().includes(term)
    );
  });

  const handleRefresh = () => {
    if (activeTab === "dept_tickets") refetchDept();
    else refetchMyRaised();
  };

  return (
    <div className="space-y-5 pb-8 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-manager-orange/10 flex items-center justify-center text-manager-orange">
              <Briefcase className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              Department Operations &amp; Oversight
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Oversee department service requests, assign or reassign technicians, monitor SLAs, and raise employee tickets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={isCurrentFetching}
            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded border border-gray-200 text-xs font-semibold transition flex items-center gap-1 shadow-sm"
            title="Refresh tickets"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCurrentFetching ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Department Manager is also an employee: Raise Ticket Button */}
          <Link
            href="/tickets/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-blue hover:bg-primary-blue/95 text-white rounded text-xs font-semibold transition shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Raise a Request</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-gray-500 font-medium">Department Requests</p>
            <p className="text-xl font-semibold text-gray-900 mt-0.5">{totalTickets}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Total tickets in scope</p>
          </div>
          <div className="w-9 h-9 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <TicketIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-amber-600 font-medium">Open &amp; Triage</p>
            <p className="text-xl font-semibold text-amber-700 mt-0.5 flex items-center gap-2">
              {openTickets}
              {openTickets > 0 && (
                <span className="inline-block w-2 h-2 rounded bg-amber-500 animate-ping" />
              )}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Awaiting resolution</p>
          </div>
          <div className="w-9 h-9 rounded bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-emerald-600 font-medium">Resolved / Closed</p>
            <p className="text-xl font-semibold text-emerald-700 mt-0.5">{resolvedTickets}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Completed requests</p>
          </div>
          <div className="w-9 h-9 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-red-600 font-medium">High / Critical</p>
            <p className="text-xl font-semibold text-primary-red mt-0.5">{criticalTickets}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Priority escalations</p>
          </div>
          <div className="w-9 h-9 rounded bg-red-50 border border-red-100 flex items-center justify-center text-primary-red shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-gray-200 bg-white px-3 pt-2 rounded-t shadow-sm">
        <button
          onClick={() => setActiveTab("dept_tickets")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === "dept_tickets"
              ? "border-primary-blue text-primary-blue"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Department Requests Queue</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-gray-100 text-gray-700 font-mono">
            {totalTickets}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("my_tickets")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === "my_tickets"
              ? "border-primary-blue text-primary-blue"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <TicketIcon className="w-3.5 h-3.5" />
          <span>My Raised Requests</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-gray-100 text-gray-700 font-mono">
            {myRaisedTickets?.length || 0}
          </span>
        </button>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-white p-3.5 rounded border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tickets by subject, #, requester..."
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-primary-blue focus:bg-white transition"
          />
        </div>

        {activeTab === "dept_tickets" && (
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Department Filter */}
            {departments && departments.length > 1 && (
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-primary-blue focus:bg-white transition text-gray-700 font-medium"
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-primary-blue focus:bg-white transition text-gray-700 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-primary-blue focus:bg-white transition text-gray-700 font-medium"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        )}
      </div>

      {/* Live Department Tickets Stream */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xs font-semibold text-gray-900">
            {activeTab === "dept_tickets" ? "Department Requests Queue" : "My Raised Requests"}
          </h2>
          <span className="text-[11px] text-gray-500">
            Showing <strong className="text-gray-900 font-semibold">{filteredTickets?.length || 0}</strong> of{" "}
            {activeTab === "dept_tickets" ? totalTickets : (myRaisedTickets?.length || 0)} ticket(s)
          </span>
        </div>

        {isCurrentLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary-blue" />
            <p className="text-xs">Loading requests...</p>
          </div>
        ) : deptError && activeTab === "dept_tickets" ? (
          <div className="py-12 text-center text-primary-red text-xs">
            Failed to load department requests. Please check your connection and refresh.
          </div>
        ) : !filteredTickets || filteredTickets.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <TicketIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-xs font-semibold text-gray-700">No requests in queue</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {activeTab === "dept_tickets"
                ? "Incoming department service tickets will appear here for oversight and technician assignment."
                : "You have not raised any requests yet. Click '+ Raise a Request' above."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-600 font-semibold uppercase text-[11px]">
                  <th className="px-4 py-3">Ticket ID &amp; Subject</th>
                  <th className="px-4 py-3">Requester</th>
                  <th className="px-4 py-3">Service / Issue</th>
                  <th className="px-4 py-3">Assigned Handler</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => router.push(`/tickets/${ticket.reference}`)}
                    className="hover:bg-gray-50/70 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 group-hover:text-primary-blue transition-colors">
                        {ticket.subject}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[10px] text-primary-red font-semibold bg-red-50 px-1.5 py-0.2 rounded border border-red-100">
                          {ticket.ticket_number}
                        </span>
                        {ticket.unit_name && (
                          <span className="text-[10px] text-gray-400">
                            {ticket.unit_name}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      <p className="font-medium text-gray-900">
                        {ticket.requester_name || ticket.requester}
                      </p>
                      {ticket.requester_payroll_no && (
                        <p className="text-[10px] text-gray-400">
                          Payroll: {ticket.requester_payroll_no}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      <span className="font-medium text-gray-900">{ticket.issue_name}</span>
                      <p className="text-[10px] text-gray-400">{ticket.category_name}</p>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {ticket.assigned_to_name ? (
                        <div className="flex items-center gap-1 text-gray-900 font-semibold">
                          <UserCheck className="w-3.5 h-3.5 text-technician-green shrink-0" />
                          <span>{ticket.assigned_to_name}</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertCircle className="w-3 h-3" /> Unassigned
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">{getPriorityBadge(ticket.priority)}</td>

                    <td className="px-4 py-3">{getStatusBadge(ticket.status)}</td>

                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      <p>{formatDate(ticket.created_at)}</p>
                      <p className="text-[10px] text-gray-400">{ticket.sla_hours}h SLA</p>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/tickets/${ticket.reference}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-gray-50 text-gray-700 hover:text-primary-blue hover:bg-primary-blue/5 border border-gray-200 transition"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

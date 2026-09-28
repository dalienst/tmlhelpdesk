"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Loader2,
  PlusCircle,
  Ticket as TicketIcon,
  Layers,
  ListTree,
  UserCheck,
  FolderTree,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { useFetchTickets } from "@/hooks/tickets/actions";
import { useFetchIssues } from "@/hooks/issues/actions";
import { Ticket as TicketType } from "@/services/tickets";

export default function TechnicianDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"assigned" | "my_tickets" | "my_issues">("assigned");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Assigned Tickets queue
  const {
    data: assignedTickets,
    isLoading: assignedLoading,
    refetch: refetchAssigned,
    isFetching: assignedFetching,
  } = useFetchTickets({ my_assigned: true });

  // My Raised Tickets (as an employee)
  const {
    data: myRaisedTickets,
    isLoading: myRaisedLoading,
    refetch: refetchMyRaised,
    isFetching: myRaisedFetching,
  } = useFetchTickets({ my_tickets: true });

  // My Handled Issues / Services
  const {
    data: myHandledIssues,
    isLoading: issuesLoading,
    refetch: refetchIssues,
    isFetching: issuesFetching,
  } = useFetchIssues({ my_issues: true });

  // KPI Calculations
  const totalAssigned = assignedTickets?.length || 0;
  const inProgressCount =
    assignedTickets?.filter((t) => t.status?.toUpperCase() === "IN_PROGRESS").length || 0;
  const openCount =
    assignedTickets?.filter((t) => t.status?.toUpperCase() === "OPEN").length || 0;
  const resolvedCount =
    assignedTickets?.filter((t) =>
      ["RESOLVED", "CLOSED"].includes(t.status?.toUpperCase())
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

  const getStatusBadge = (s: string) => {
    switch (s?.toUpperCase()) {
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
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50 text-gray-700 text-[10px] font-semibold border border-gray-200">
            {s}
          </span>
        );
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p?.toUpperCase()) {
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

  // Filter current ticket list
  const activeTicketsList = activeTab === "assigned" ? assignedTickets : myRaisedTickets;
  const filteredTickets = activeTicketsList?.filter((ticket) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      ticket.subject?.toLowerCase().includes(term) ||
      ticket.ticket_number?.toLowerCase().includes(term) ||
      ticket.requester_name?.toLowerCase().includes(term) ||
      ticket.issue_name?.toLowerCase().includes(term) ||
      ticket.category_name?.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "ALL" || ticket.status?.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredIssues = myHandledIssues?.filter((iss) => {
    const term = searchTerm.toLowerCase();
    return (
      iss.name?.toLowerCase().includes(term) ||
      iss.code?.toLowerCase().includes(term) ||
      iss.category_name?.toLowerCase().includes(term) ||
      iss.department_name?.toLowerCase().includes(term)
    );
  });

  const handleRefresh = () => {
    if (activeTab === "assigned") refetchAssigned();
    else if (activeTab === "my_tickets") refetchMyRaised();
    else refetchIssues();
  };

  const isCurrentFetching = assignedFetching || myRaisedFetching || issuesFetching;

  return (
    <div className="space-y-5 pb-8 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-technician-green/10 flex items-center justify-center text-technician-green">
              <Inbox className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              Technician Workspace
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Manage your service queue, update ticket states, review catalog services assigned to you, and raise employee requests.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={isCurrentFetching}
            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded border border-gray-200 text-xs font-semibold transition flex items-center gap-1 shadow-sm"
            title="Refresh current view"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCurrentFetching ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Technician is also an employee: Raise Ticket Button */}
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
            <p className="text-xs text-gray-500 font-medium">Assigned to Me</p>
            <p className="text-xl font-semibold text-gray-900 mt-0.5">{totalAssigned}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Total tickets in queue</p>
          </div>
          <div className="w-9 h-9 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <TicketIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-amber-600 font-medium">Open &amp; Pending</p>
            <p className="text-xl font-semibold text-amber-700 mt-0.5">{openCount}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Awaiting investigation</p>
          </div>
          <div className="w-9 h-9 rounded bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-blue-600 font-medium">In Progress</p>
            <p className="text-xl font-semibold text-blue-700 mt-0.5">{inProgressCount}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Active troubleshooting</p>
          </div>
          <div className="w-9 h-9 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-emerald-600 font-medium">Resolved / Completed</p>
            <p className="text-xl font-semibold text-emerald-700 mt-0.5">{resolvedCount}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Fulfilled service tickets</p>
          </div>
          <div className="w-9 h-9 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-gray-200 bg-white px-3 pt-2 rounded-t shadow-sm">
        <button
          onClick={() => setActiveTab("assigned")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === "assigned"
              ? "border-primary-blue text-primary-blue"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Assigned to Me</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-gray-100 text-gray-700 font-mono">
            {totalAssigned}
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

        <button
          onClick={() => setActiveTab("my_issues")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === "my_issues"
              ? "border-primary-blue text-primary-blue"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <ListTree className="w-3.5 h-3.5" />
          <span>My Handled Services / Issues</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-mono">
            {myHandledIssues?.length || 0}
          </span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeTab === "my_issues"
                ? "Search handled issues by name, code..."
                : "Search tickets by subject, #, requester..."
            }
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-primary-blue focus:bg-white transition"
          />
        </div>

        {activeTab !== "my_issues" && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
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
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === "my_issues" ? (
        /* My Handled Services View */
        <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
          <div className="p-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="text-xs font-semibold text-gray-900">
                Catalog Services Routed to You
              </h2>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Incoming tickets for these request types will be automatically dispatched to you.
              </p>
            </div>
            <span className="text-[11px] text-gray-500">
              Total: <strong className="text-gray-900 font-semibold">{filteredIssues?.length || 0}</strong> service(s)
            </span>
          </div>

          {issuesLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary-blue" />
              <p className="text-xs">Loading assigned services...</p>
            </div>
          ) : !filteredIssues || filteredIssues.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <ListTree className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-xs font-semibold text-gray-700">No services configured yet</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Your department manager or administrator has not assigned specific service issue types to your account.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-600 font-semibold uppercase text-[11px]">
                    <th className="px-4 py-3">Service / Issue Name</th>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Default Priority</th>
                    <th className="px-4 py-3">Target SLA</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredIssues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {issue.name}
                        {issue.description && (
                          <p className="text-[11px] text-gray-400 font-normal mt-0.5">
                            {issue.description}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                          {issue.code}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <span className="inline-flex items-center gap-1">
                          <FolderTree className="w-3 h-3 text-gray-400" />
                          {issue.category_name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <span className="inline-flex items-center gap-1">
                          <Layers className="w-3 h-3 text-gray-400" />
                          {issue.department_name}
                        </span>
                      </td>
                      <td className="px-4 py-3">{getPriorityBadge(issue.default_priority)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-primary-blue font-semibold">
                          <Clock className="w-3 h-3 text-blue-500" />
                          {issue.sla_hours} Hours
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {issue.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-semibold">
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Ticket Queue View (Assigned to Me OR My Raised Requests) */
        <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
          <div className="p-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-xs font-semibold text-gray-900">
              {activeTab === "assigned" ? "Assigned Operational Queue" : "My Raised Support Requests"}
            </h2>
            <span className="text-[11px] text-gray-500">
              Showing <strong className="text-gray-900 font-semibold">{filteredTickets?.length || 0}</strong> ticket(s)
            </span>
          </div>

          {(activeTab === "assigned" ? assignedLoading : myRaisedLoading) ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary-blue" />
              <p className="text-xs">Loading queue...</p>
            </div>
          ) : !filteredTickets || filteredTickets.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <TicketIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-xs font-semibold text-gray-700">No tickets in this view</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {activeTab === "assigned"
                  ? "Tickets routed to your department/services will appear here."
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
                    <th className="px-4 py-3">Service / Request</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date &amp; SLA</th>
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
                            <span className="text-[10px] text-gray-400">{ticket.unit_name}</span>
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
                          <span>Open</span>
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
      )}
    </div>
  );
}

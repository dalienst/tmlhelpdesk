"use client";

import { useState } from "react";
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
  X,
  Edit2,
  AlertCircle,
  XCircle,
  Eye,
  User,
  RefreshCw,
  Building2,
  Layers,
} from "lucide-react";
import { useFetchTickets, useUpdateTicket } from "@/hooks/tickets/actions";
import { useFetchEmployees } from "@/hooks/accounts/actions";
import { Ticket as TicketType } from "@/services/tickets";
import toast from "react-hot-toast";

export default function ManagerDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const { data: tickets, isLoading, error, refetch, isFetching } = useFetchTickets({
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    priority: priorityFilter !== "ALL" ? priorityFilter : undefined,
  });

  const { data: staffMembers } = useFetchEmployees();
  const { mutateAsync: updateTicketMutation, isPending: isUpdating } = useUpdateTicket();

  // Selected ticket for lifecycle management modal
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editAssignedTo, setEditAssignedTo] = useState<string>("");
  const [editPriority, setEditPriority] = useState<string>("");
  const [editResolutionNotes, setEditResolutionNotes] = useState<string>("");

  const openTicketModal = (ticket: TicketType) => {
    setSelectedTicket(ticket);
    setEditStatus(ticket.status);
    setEditAssignedTo(ticket.assigned_to_email || "");
    setEditPriority(ticket.priority);
    setEditResolutionNotes(ticket.resolution_notes || "");
  };

  const closeModal = () => {
    setSelectedTicket(null);
  };

  const handleUpdateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      await updateTicketMutation({
        reference: selectedTicket.reference,
        data: {
          status: editStatus as any,
          assigned_to: editAssignedTo ? editAssignedTo : null,
          priority: editPriority as any,
          resolution_notes: editResolutionNotes || undefined,
        },
      });
      await refetch();
      toast.success("Ticket lifecycle updated successfully!");
      closeModal();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to update ticket. Please try again.");
    }
  };

  const totalTickets = tickets?.length || 0;
  const openTickets =
    tickets?.filter((t) =>
      ["OPEN", "IN_PROGRESS", "PENDING"].includes(t.status?.toUpperCase())
    ).length || 0;
  const inProgressTickets =
    tickets?.filter((t) => t.status?.toUpperCase() === "IN_PROGRESS").length || 0;
  const resolvedTickets =
    tickets?.filter((t) =>
      ["RESOLVED", "CLOSED"].includes(t.status?.toUpperCase())
    ).length || 0;
  const criticalTickets =
    tickets?.filter(
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
            <CheckCircle2 className="w-3 h-3 text-gray-500" />
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
      case "LOW":
      default:
        return (
          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
            LOW
          </span>
        );
    }
  };

  const filteredTickets = tickets?.filter((ticket) => {
    const term = searchTerm.toLowerCase();
    return (
      ticket.subject?.toLowerCase().includes(term) ||
      ticket.ticket_number?.toLowerCase().includes(term) ||
      ticket.requester_name?.toLowerCase().includes(term) ||
      ticket.requester_email?.toLowerCase().includes(term) ||
      ticket.requester_payroll_no?.toLowerCase().includes(term) ||
      ticket.assigned_to_name?.toLowerCase().includes(term) ||
      ticket.issue_name?.toLowerCase().includes(term) ||
      ticket.category_name?.toLowerCase().includes(term)
    );
  });

  // Assignable staff members (technicians, managers, staff)
  const assignableStaff = staffMembers?.filter(
    (u) => u.is_technician || u.is_manager || u.is_admin || u.is_staff
  );

  return (
    <div className="space-y-5 pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-manager-orange/10 flex items-center justify-center text-manager-orange">
              <Briefcase className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              Department Operations & Ticket Lifecycle
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Oversee department service delivery, assign or reassign technicians, track SLAs, and update ticket lifecycle states.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded border border-gray-200 text-xs font-semibold transition flex items-center gap-1 shadow-sm"
            title="Refresh tickets"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
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
            <p className="text-xs text-amber-600 font-medium">Open & Triage</p>
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
      </div>

      {/* Live Department Tickets Stream */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xs font-semibold text-gray-900">Department Requests Queue</h2>
          <span className="text-[11px] text-gray-500">
            Showing <strong className="text-gray-900 font-semibold">{filteredTickets?.length || 0}</strong> of{" "}
            {totalTickets} ticket(s)
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary-blue" />
            <p className="text-xs">Loading department requests...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-primary-red text-xs">
            Failed to load department requests. Please check your connection and refresh.
          </div>
        ) : !filteredTickets || filteredTickets.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <TicketIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-xs font-semibold text-gray-700">No requests in queue</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Incoming service tickets will appear here for oversight, technician assignment, and resolution.
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
                    onClick={() => openTicketModal(ticket)}
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openTicketModal(ticket);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-gray-50 text-gray-700 hover:text-primary-blue hover:bg-primary-blue/5 border border-gray-200 transition"
                      >
                        <Edit2 className="w-3 h-3" /> Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Lifecycle & Management Modal for Manager */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-primary-red font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    {selectedTicket.ticket_number}
                  </span>
                  <span className="text-xs text-gray-400">|</span>
                  <h3 className="text-sm font-semibold text-gray-900">{selectedTicket.subject}</h3>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Created {formatDate(selectedTicket.created_at)} • SLA Target: {selectedTicket.sla_hours} Hours
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Context Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded bg-gray-50 border border-gray-100 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Branch</span>
                  <span className="font-semibold text-gray-900">{selectedTicket.unit_name || "—"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Department</span>
                  <span className="font-semibold text-gray-900">{selectedTicket.department_name || "—"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Category</span>
                  <span className="font-semibold text-gray-900">{selectedTicket.category_name || "—"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Service / Issue</span>
                  <span className="font-semibold text-gray-900">{selectedTicket.issue_name || "—"}</span>
                </div>
              </div>

              {/* Requester Profile */}
              <div className="flex items-center justify-between p-3 rounded bg-blue-50/40 border border-blue-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-primary-blue/10 text-primary-blue flex items-center justify-center font-semibold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedTicket.requester_name || selectedTicket.requester}
                    </p>
                    <p className="text-[11px] text-gray-500">{selectedTicket.requester_email}</p>
                  </div>
                </div>
                {selectedTicket.requester_payroll_no && (
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-white border border-blue-200 rounded text-gray-700">
                    Payroll: {selectedTicket.requester_payroll_no}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Issue Description</label>
                <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selectedTicket.description}
                </div>
              </div>

              {/* Lifecycle Controls */}
              <form id="manager-update-ticket-form" onSubmit={handleUpdateTicket} className="space-y-3 pt-2 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Status update */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Lifecycle Status <span className="text-primary-red">*</span>
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition font-medium"
                    >
                      <option value="OPEN">Open (Awaiting triage)</option>
                      <option value="IN_PROGRESS">In Progress (Active resolution)</option>
                      <option value="PENDING">Pending (Waiting for parts/user)</option>
                      <option value="RESOLVED">Resolved (Service fulfilled)</option>
                      <option value="CLOSED">Closed (Archived)</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  {/* Technician Reassignment */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Assigned Technician
                    </label>
                    <select
                      value={editAssignedTo}
                      onChange={(e) => setEditAssignedTo(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition font-medium"
                    >
                      <option value="">Unassigned (Department Queue)</option>
                      {assignableStaff?.map((s) => (
                        <option key={s.id} value={s.email}>
                          {s.first_name} {s.last_name} ({s.is_technician ? "Technician" : s.is_manager ? "Manager" : "Staff"})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority Adjuster */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Priority Level
                    </label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition font-medium"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                </div>

                {/* Resolution Notes */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Manager Remarks / Resolution Feedback
                  </label>
                  <textarea
                    rows={3}
                    value={editResolutionNotes}
                    onChange={(e) => setEditResolutionNotes(e.target.value)}
                    placeholder="Provide troubleshooting remarks, instructions to technician, or resolution feedback for the employee..."
                    className="w-full p-2.5 bg-white border border-gray-300 rounded text-xs outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={closeModal}
                disabled={isUpdating}
                className="px-3.5 py-2 rounded text-xs font-semibold text-gray-600 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="manager-update-ticket-form"
                disabled={isUpdating}
                className="bg-primary-blue hover:bg-primary-blue/95 text-white px-5 py-2 rounded text-xs font-semibold transition shadow-sm flex items-center gap-1.5 disabled:opacity-70"
              >
                {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

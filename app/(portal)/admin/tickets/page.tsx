"use client";

import { useState } from "react";
import { useFetchTickets, useUpdateTicket } from "@/hooks/tickets/actions";
import { useFetchDepartments } from "@/hooks/departments/actions";
import { useFetchUnits } from "@/hooks/units/actions";
import { useFetchEmployees } from "@/hooks/accounts/actions";
import { Ticket as TicketType } from "@/services/tickets";
import CreateTicket from "@/forms/tickets/CreateTicket";
import {
  Ticket as TicketIcon,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  AlertCircle,
  Loader2,
  X,
  Building2,
  Layers,
  ArrowUpRight,
  Eye,
  RefreshCw,
  FolderTree,
  ListTree,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminTicketsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("");
  const [unitFilter, setUnitFilter] = useState("");

  const { data: tickets, isLoading, error, refetch, isFetching } = useFetchTickets({
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    priority: priorityFilter !== "ALL" ? priorityFilter : undefined,
    department: deptFilter || undefined,
    unit: unitFilter || undefined,
  });

  const { data: departments } = useFetchDepartments();
  const { data: units } = useFetchUnits();
  const { data: staffMembers } = useFetchEmployees();
  const { mutateAsync: updateTicketMutation, isPending: isUpdating } = useUpdateTicket();

  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [modalType, setModalType] = useState<"none" | "create" | "detail">("none");

  // Form states for managing ticket
  const [editStatus, setEditStatus] = useState<string>("");
  const [editAssignedTo, setEditAssignedTo] = useState<string>("");
  const [editResolutionNotes, setEditResolutionNotes] = useState<string>("");

  const closeModal = () => {
    setModalType("none");
    setSelectedTicket(null);
  };

  const openTicketDetail = (ticket: TicketType) => {
    setSelectedTicket(ticket);
    setEditStatus(ticket.status);
    setEditAssignedTo(ticket.assigned_to_email || "");
    setEditResolutionNotes(ticket.resolution_notes || "");
    setModalType("detail");
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
          resolution_notes: editResolutionNotes || undefined,
        },
      });
      await refetch();
      toast.success("Ticket updated successfully!");
      closeModal();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to update ticket. Please try again.");
    }
  };

  const filteredTickets = tickets?.filter((t) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      t.ticket_number?.toLowerCase().includes(term) ||
      t.subject?.toLowerCase().includes(term) ||
      t.requester_name?.toLowerCase().includes(term) ||
      t.requester_email?.toLowerCase().includes(term) ||
      t.requester_payroll_no?.toLowerCase().includes(term) ||
      t.assigned_to_name?.toLowerCase().includes(term) ||
      t.department_name?.toLowerCase().includes(term) ||
      t.unit_name?.toLowerCase().includes(term);

    return matchesSearch;
  });

  // Calculate stats
  const totalCount = tickets?.length || 0;
  const openCount = tickets?.filter((t) => t.status === "OPEN").length || 0;
  const inProgressCount = tickets?.filter((t) => t.status === "IN_PROGRESS").length || 0;
  const resolvedCount = tickets?.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length || 0;
  const criticalCount = tickets?.filter((t) => t.priority === "CRITICAL" || t.priority === "HIGH").length || 0;

  // Technicians list for assignment
  const assignableStaff = staffMembers?.filter(
    (u) => u.is_technician || u.is_manager || u.is_admin || u.is_staff
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-500" /> Open
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-500" /> In Progress
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Clock className="w-3 h-3 text-purple-500" /> Pending
          </span>
        );
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Resolved
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <CheckCircle2 className="w-3 h-3 text-gray-500" /> Closed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-primary-red border border-red-200">
            <XCircle className="w-3 h-3 text-primary-red" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
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

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary-blue/10 flex items-center justify-center text-primary-blue">
              <TicketIcon className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              Organization Tickets
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Monitor, triage, assign technicians, and resolve support requests across all branches and departments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded border border-gray-200 text-xs font-semibold transition flex items-center gap-1"
            title="Refresh tickets"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setModalType("create")}
            className="bg-primary-blue hover:bg-primary-blue/95 text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Raise Ticket
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Total Tickets</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">{totalCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Across entire organization</p>
        </div>

        <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">Open Tickets</p>
          <p className="text-xl font-semibold text-amber-700 mt-1 flex items-center gap-2">
            {openCount}
            {openCount > 0 && (
              <span className="inline-block w-2 h-2 rounded bg-amber-500 animate-ping" />
            )}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Awaiting triage & resolution</p>
        </div>

        <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">In Progress</p>
          <p className="text-xl font-semibold text-blue-700 mt-1">{inProgressCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Assigned to technicians</p>
        </div>

        <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Resolved / Closed</p>
          <p className="text-xl font-semibold text-emerald-700 mt-1">{resolvedCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{criticalCount} high/critical priority</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-3.5 rounded border border-gray-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ticket #, subject, requester..."
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-primary-blue focus:bg-white transition"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-primary-blue focus:bg-white transition text-gray-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-primary-blue focus:bg-white transition text-gray-700"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-primary-blue focus:bg-white transition text-gray-700 truncate"
            >
              <option value="">All Departments</option>
              {departments?.map((d) => (
                <option key={d.id} value={d.reference}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Units row or active filters */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Filter Branch:</span>
            <button
              onClick={() => setUnitFilter("")}
              className={`px-2 py-0.5 rounded border transition ${
                unitFilter === ""
                  ? "bg-primary-blue text-white border-primary-blue"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              All Branches
            </button>
            {units?.map((u) => (
              <button
                key={u.id}
                onClick={() => setUnitFilter(unitFilter === u.reference ? "" : u.reference)}
                className={`px-2 py-0.5 rounded border transition ${
                  unitFilter === u.reference
                    ? "bg-primary-blue text-white border-primary-blue"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {u.name}
              </button>
            ))}
          </div>

          <div>
            Showing <strong className="text-gray-900 font-semibold">{filteredTickets?.length || 0}</strong> of{" "}
            {totalCount} tickets
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-gray-500 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-primary-blue mx-auto mb-2" />
            Loading organization tickets...
          </div>
        ) : error ? (
          <div className="py-12 text-center text-primary-red text-xs">
            Failed to load tickets. Please check your connection and refresh.
          </div>
        ) : !filteredTickets || filteredTickets.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <TicketIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-700">No tickets found</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              No tickets match your filter criteria. Try clearing filters or search terms.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-600 font-semibold uppercase text-[11px]">
                  <th className="px-4 py-3">Ticket ID & Subject</th>
                  <th className="px-4 py-3">Branch & Dept</th>
                  <th className="px-4 py-3">Requester</th>
                  <th className="px-4 py-3">Assigned Technician</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => openTicketDetail(ticket)}
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
                        {ticket.issue_name && (
                          <span className="text-[10px] text-gray-400 truncate max-w-[150px]">
                            {ticket.issue_name}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      <p className="font-medium text-gray-900">{ticket.department_name}</p>
                      <p className="text-[10px] text-gray-400">{ticket.unit_name}</p>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      <p className="font-medium text-gray-900">{ticket.requester_name || ticket.requester}</p>
                      {ticket.requester_payroll_no && (
                        <p className="text-[10px] text-gray-400">PR: {ticket.requester_payroll_no}</p>
                      )}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {ticket.assigned_to_name ? (
                        <div className="flex items-center gap-1.5 text-gray-900 font-semibold">
                          <UserCheck className="w-3.5 h-3.5 text-technician-green shrink-0" />
                          <span>{ticket.assigned_to_name}</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertCircle className="w-3 h-3" /> Unassigned
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">{getStatusBadge(ticket.status)}</td>

                    <td className="px-4 py-3">{getPriorityBadge(ticket.priority)}</td>

                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      <p>{formatDate(ticket.created_at)}</p>
                      <p className="text-[10px] text-gray-400">{ticket.sla_hours}h SLA</p>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openTicketDetail(ticket);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-gray-50 text-gray-600 hover:text-primary-blue hover:bg-primary-blue/5 border border-gray-200 transition"
                      >
                        <Eye className="w-3 h-3" /> Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Details & Manage Modal */}
      {modalType === "detail" && selectedTicket && (
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
                  Raised on {formatDate(selectedTicket.created_at)} • SLA: {selectedTicket.sla_hours} Hours
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

              {/* Requester Info */}
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

              {/* Edit Form */}
              <form id="update-ticket-form" onSubmit={handleUpdateTicket} className="space-y-3 pt-2 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Status update */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Ticket Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition"
                    >
                      <option value="OPEN">Open (Awaiting action)</option>
                      <option value="IN_PROGRESS">In Progress (Active resolution)</option>
                      <option value="PENDING">Pending (Awaiting user feedback/parts)</option>
                      <option value="RESOLVED">Resolved (Work completed)</option>
                      <option value="CLOSED">Closed (Ticket finalized)</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  {/* Assignee update */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Assigned Handler / Technician</label>
                    <select
                      value={editAssignedTo}
                      onChange={(e) => setEditAssignedTo(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition"
                    >
                      <option value="">Unassigned (Department Queue)</option>
                      {assignableStaff?.map((s) => (
                        <option key={s.id} value={s.email}>
                          {s.first_name} {s.last_name} ({s.is_technician ? "Technician" : s.is_manager ? "Manager" : "Staff"})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Resolution Notes */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Resolution / Action Notes
                  </label>
                  <textarea
                    rows={3}
                    value={editResolutionNotes}
                    onChange={(e) => setEditResolutionNotes(e.target.value)}
                    placeholder="Provide details on action taken, troubleshooting steps, or resolution remarks..."
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
                form="update-ticket-form"
                disabled={isUpdating}
                className="bg-primary-blue hover:bg-primary-blue/95 text-white px-5 py-2 rounded text-xs font-semibold transition shadow-sm flex items-center gap-1.5 disabled:opacity-70"
              >
                {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {modalType === "create" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-xs font-semibold text-gray-700">Raise Ticket on Behalf</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <CreateTicket onSuccess={closeModal} onCancel={closeModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

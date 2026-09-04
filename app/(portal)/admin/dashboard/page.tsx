"use client";

import { useFetchEmployees } from "@/hooks/accounts/actions";
import { useFetchDepartments } from "@/hooks/departments/actions";
import { useFetchUnits } from "@/hooks/units/actions";
import { useFetchCategories } from "@/hooks/categories/actions";
import { useFetchIssues } from "@/hooks/issues/actions";
import { useFetchTickets } from "@/hooks/tickets/actions";
import { User } from "@/services/accounts";
import { Ticket as TicketType } from "@/services/tickets";
import {
  Loader2,
  Users,
  Shield,
  CheckCircle2,
  XCircle,
  Search,
  Building2,
  Plus,
  UserPlus,
  Upload,
  X,
  ChevronDown,
  Edit2,
  Filter,
  Ticket as TicketIcon,
  Layers,
  Clock,
  AlertCircle,
  UserCheck,
  FolderTree,
  ListTree,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import CreateEmployee from "@/forms/accounts/CreateEmployee";
import CreateEmployeeBulk from "@/forms/accounts/CreateEmployeeBulk";
import CreateEmployeeBulkUpload from "@/forms/accounts/CreateEmployeeBulkUpload";
import UpdateUser from "@/forms/accounts/UpdateUser";
import CreateUnit from "@/forms/units/CreateUnit";
import CreateDepartment from "@/forms/departments/CreateDepartment";
import CreateCategory from "@/forms/categories/CreateCategory";
import CreateIssue from "@/forms/issues/CreateIssue";

export default function AdminDashboard() {
  const { data: users, isLoading: usersLoading, isError: usersError } = useFetchEmployees();
  const { data: departments } = useFetchDepartments();
  const { data: units } = useFetchUnits();
  const { data: categories } = useFetchCategories();
  const { data: issues } = useFetchIssues();
  const { data: tickets, isLoading: ticketsLoading } = useFetchTickets();

  const [activeTab, setActiveTab] = useState<"catalog" | "tickets" | "users">("catalog");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "none" | "single_user" | "bulk_user" | "csv_user" | "edit_user" | "unit" | "dept" | "cat" | "issue"
  >("none");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (quickAddRef.current && !quickAddRef.current.contains(event.target as Node)) {
        setIsQuickAddOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeModal = () => {
    setModalType("none");
    setTimeout(() => setSelectedUser(null), 200);
  };

  if (usersLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-red-600" />
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="text-center p-6 bg-red-50 border border-red-200 rounded">
          <XCircle className="w-6 h-6 text-red-600 mx-auto mb-3" />
          <h3 className="text-gray-900 text-sm font-semibold">Failed to load system data</h3>
          <p className="text-xs text-gray-500 mt-1">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const activeUsersCount = users?.filter((u) => u.is_active)?.length || 0;
  const totalUnits = units?.length || 0;
  const totalDepts = departments?.length || 0;
  const totalCats = categories?.length || 0;
  const totalIssues = issues?.length || 0;
  const totalTickets = tickets?.length || 0;
  const openTicketsCount =
    tickets?.filter((t) =>
      ["OPEN", "IN_PROGRESS", "PENDING"].includes(t.status?.toUpperCase())
    ).length || 0;

  // Filtered Issues for Service Routing Matrix Tab
  const filteredIssues = issues?.filter((iss) => {
    const term = searchTerm.toLowerCase();
    const matchesDept = selectedDeptFilter
      ? iss.department_name?.toLowerCase() === selectedDeptFilter.toLowerCase()
      : true;
    const matchesSearch =
      iss.name?.toLowerCase().includes(term) ||
      iss.code?.toLowerCase().includes(term) ||
      iss.category_name?.toLowerCase().includes(term) ||
      iss.department_name?.toLowerCase().includes(term) ||
      iss.technician_name?.toLowerCase().includes(term);
    return matchesDept && matchesSearch;
  });

  // Filtered Users
  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.payroll_no?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesRole = true;
    if (roleFilter !== "all") {
      switch (roleFilter) {
        case "admin":
          matchesRole = !!user.is_admin;
          break;
        case "manager":
          matchesRole = !!user.is_manager;
          break;
        case "technician":
          matchesRole = !!user.is_technician;
          break;
        case "employee":
          matchesRole = !!user.is_employee;
          break;
        case "hod":
          matchesRole = !!user.is_hod;
          break;
      }
    }

    return matchesSearch && matchesRole;
  });

  // Filtered Tickets
  const filteredTickets = tickets?.filter((ticket) => {
    const term = searchTerm.toLowerCase();
    return (
      ticket.ticket_number?.toLowerCase().includes(term) ||
      ticket.subject?.toLowerCase().includes(term) ||
      ticket.department_name?.toLowerCase().includes(term) ||
      ticket.issue_name?.toLowerCase().includes(term) ||
      ticket.requester_name?.toLowerCase().includes(term) ||
      ticket.assigned_to_name?.toLowerCase().includes(term)
    );
  });

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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-semibold uppercase tracking-wider border border-blue-200">
            <AlertCircle className="w-3 h-3" /> Open
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-semibold uppercase tracking-wider border border-amber-200">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      case "RESOLVED":
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-semibold uppercase tracking-wider border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50 text-gray-600 text-[10px] font-semibold uppercase tracking-wider border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            System Administration & Setup Center
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure branches, departments, service categories, and automated technician routing.
          </p>
        </div>

        {/* Global Quick Action Popover */}
        <div className="relative" ref={quickAddRef}>
          <button
            onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Setup & Add New</span>
            <ChevronDown
              className={`w-3.5 h-3.5 opacity-70 transition-transform ${
                isQuickAddOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isQuickAddOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Service Catalog Configuration
              </div>
              <button
                onClick={() => {
                  setIsQuickAddOpen(false);
                  setModalType("issue");
                }}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 font-semibold"
              >
                <ListTree className="w-4 h-4 text-red-600" />
                <span>Add Issue Type & Assign Handler</span>
              </button>
              <button
                onClick={() => {
                  setIsQuickAddOpen(false);
                  setModalType("cat");
                }}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
              >
                <FolderTree className="w-4 h-4 text-amber-600" />
                <span>Add Service Category</span>
              </button>
              <button
                onClick={() => {
                  setIsQuickAddOpen(false);
                  setModalType("dept");
                }}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
              >
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Add Department</span>
              </button>
              <button
                onClick={() => {
                  setIsQuickAddOpen(false);
                  setModalType("unit");
                }}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
              >
                <Building2 className="w-4 h-4 text-gray-600" />
                <span>Add Branch Unit</span>
              </button>

              <div className="px-3 py-1.5 border-t border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-1">
                User Management
              </div>
              <button
                onClick={() => {
                  setIsQuickAddOpen(false);
                  setModalType("single_user");
                }}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
              >
                <UserPlus className="w-4 h-4 text-purple-600" />
                <span>Add Single User</span>
              </button>
              <button
                onClick={() => {
                  setIsQuickAddOpen(false);
                  setModalType("csv_user");
                }}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Upload Users CSV</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4-Step Interactive Hierarchy Engine Hub */}
      <div className="bg-white border border-gray-200 rounded p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-red-600" />
            <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Helpdesk Organizational Architecture
            </h2>
          </div>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200 self-start sm:self-auto">
            ● Intelligent Auto-Routing Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Level 1: Unit */}
          <Link
            href="/admin/units"
            className="group block p-3 rounded border border-gray-200 hover:border-red-300 hover:bg-red-50/20 transition"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Level 1 • Branch</span>
              <Building2 className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition" />
            </div>
            <p className="text-xl font-semibold text-gray-900">{totalUnits}</p>
            <p className="text-[11px] text-gray-500 mt-0.5 flex items-center justify-between">
              <span>Units Configured</span>
              <span className="text-red-600 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition">
                Manage &rarr;
              </span>
            </p>
          </Link>

          {/* Level 2: Department */}
          <Link
            href="/admin/departments"
            className="group block p-3 rounded border border-gray-200 hover:border-red-300 hover:bg-red-50/20 transition"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Level 2 • Dept</span>
              <Layers className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition" />
            </div>
            <p className="text-xl font-semibold text-gray-900">{totalDepts}</p>
            <p className="text-[11px] text-gray-500 mt-0.5 flex items-center justify-between">
              <span>Operational Depts</span>
              <span className="text-red-600 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition">
                Manage &rarr;
              </span>
            </p>
          </Link>

          {/* Level 3: Category */}
          <Link
            href="/admin/categories"
            className="group block p-3 rounded border border-gray-200 hover:border-red-300 hover:bg-red-50/20 transition"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Level 3 • Section</span>
              <FolderTree className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition" />
            </div>
            <p className="text-xl font-semibold text-gray-900">{totalCats}</p>
            <p className="text-[11px] text-gray-500 mt-0.5 flex items-center justify-between">
              <span>Service Categories</span>
              <span className="text-red-600 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition">
                Manage &rarr;
              </span>
            </p>
          </Link>

          {/* Level 4: Issue & Handler */}
          <Link
            href="/admin/issues"
            className="group block p-3 rounded border border-red-200 bg-red-50/30 hover:bg-red-50/50 transition"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">Level 4 • Routing</span>
              <ListTree className="w-4 h-4 text-red-600 transition" />
            </div>
            <p className="text-xl font-semibold text-gray-900">{totalIssues}</p>
            <p className="text-[11px] text-red-700 mt-0.5 flex items-center justify-between font-medium">
              <span>Auto-Routed Services</span>
              <span className="text-red-600 text-[10px]">Configure &rarr;</span>
            </p>
          </Link>
        </div>
      </div>

      {/* Main Integrated Hub with Switchable Views */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 px-4 pt-3 flex items-center justify-between bg-gray-50/50 flex-wrap gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setActiveTab("catalog");
                setSearchTerm("");
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-t border-b-2 transition flex items-center gap-1.5 ${
                activeTab === "catalog"
                  ? "border-red-600 text-red-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Service Catalog & Routing Matrix ({totalIssues})
            </button>
            <button
              onClick={() => {
                setActiveTab("tickets");
                setSearchTerm("");
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-t border-b-2 transition flex items-center gap-1.5 ${
                activeTab === "tickets"
                  ? "border-red-600 text-red-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <TicketIcon className="w-3.5 h-3.5" />
              Organization Tickets ({totalTickets})
            </button>
            <button
              onClick={() => {
                setActiveTab("users");
                setSearchTerm("");
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-t border-b-2 transition flex items-center gap-1.5 ${
                activeTab === "users"
                  ? "border-red-600 text-red-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Staff & User Directory ({users?.length || 0})
            </button>
          </div>

          {/* Filtering and Search Controls */}
          <div className="pb-2 flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {activeTab === "catalog" && (
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="bg-white border border-gray-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded px-2.5 py-1.5 text-xs outline-none text-gray-700 font-medium"
              >
                <option value="">All Departments</option>
                {departments?.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            )}

            {activeTab === "users" && (
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-white border border-gray-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded px-2.5 py-1.5 text-xs outline-none text-gray-700 font-medium"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="manager">Managers</option>
                <option value="technician">Technicians</option>
                <option value="employee">Employees</option>
                <option value="hod">HODs</option>
              </select>
            )}

            <div className="relative w-48 sm:w-60">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  activeTab === "catalog"
                    ? "Search issues, technician, category..."
                    : activeTab === "tickets"
                      ? "Search tickets by ID, subject..."
                      : "Search users by name, email..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded pl-8 pr-3 py-1.5 text-xs outline-none"
              />
            </div>
          </div>
        </div>

        {/* Tab 1: Service Catalog & Routing Matrix */}
        {activeTab === "catalog" && (
          <div className="overflow-x-auto">
            <div className="p-3 bg-red-50/40 border-b border-red-100 flex items-center justify-between text-xs">
              <p className="text-gray-700">
                <strong>How tickets route:</strong> Staff pick a <em>Department</em> &rarr; <em>Category</em> &rarr; <em>Issue</em>. The ticket is immediately assigned to the designated technician.
              </p>
              <button
                onClick={() => setModalType("issue")}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition shrink-0 ml-2"
              >
                <Plus className="w-3 h-3" /> Add Service Issue
              </button>
            </div>

            {!filteredIssues || filteredIssues.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <ListTree className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-xs font-semibold text-gray-700">No service issues configured</p>
                <p className="text-[11px] text-gray-400 mt-0.5 mb-3">
                  Define requests like P9 Forms, Laptop repairs, or POS issues and assign technicians.
                </p>
                <button
                  onClick={() => setModalType("issue")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Define First Issue Type
                </button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-semibold">
                    <th className="px-4 py-2.5">Specific Request / Issue</th>
                    <th className="px-4 py-2.5">Service Category</th>
                    <th className="px-4 py-2.5">Department</th>
                    <th className="px-4 py-2.5">Technician / Officer In Charge</th>
                    <th className="px-4 py-2.5">SLA Turnaround</th>
                    <th className="px-4 py-2.5">Default Priority</th>
                    <th className="px-4 py-2.5 text-right">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredIssues.map((iss) => (
                    <tr key={iss.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-4 py-2.5">
                        <p className="font-semibold text-gray-900">{iss.name}</p>
                        <span className="font-mono text-[10px] text-gray-400">{iss.code}</span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-700 font-medium">
                        {iss.category_name}
                      </td>
                      <td className="px-4 py-2.5 text-gray-700">
                        {iss.department_name}
                      </td>
                      <td className="px-4 py-2.5">
                        {iss.technician_name ? (
                          <div className="flex items-center gap-1 text-gray-900 font-semibold">
                            <UserCheck className="w-3.5 h-3.5 text-red-600 shrink-0" />
                            <span>{iss.technician_name}</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Department HOD Fallback
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" /> {iss.sla_hours} hours
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            iss.default_priority === "CRITICAL"
                              ? "bg-red-100 text-red-800"
                              : iss.default_priority === "HIGH"
                                ? "bg-orange-100 text-orange-800"
                                : iss.default_priority === "MEDIUM"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {iss.default_priority}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <Link
                          href="/admin/issues"
                          className="text-red-600 hover:text-red-700 text-xs font-semibold hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: Organization Tickets */}
        {activeTab === "tickets" && (
          <div className="overflow-x-auto">
            {ticketsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                <p className="text-xs">Loading organization tickets...</p>
              </div>
            ) : !filteredTickets || filteredTickets.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <TicketIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-xs font-semibold text-gray-700">No tickets found</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Tickets submitted across all branches will appear here.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-semibold">
                    <th className="px-4 py-2.5">Ticket ID & Subject</th>
                    <th className="px-4 py-2.5">Department & Branch</th>
                    <th className="px-4 py-2.5">Requester</th>
                    <th className="px-4 py-2.5">Assigned Handler</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Priority</th>
                    <th className="px-4 py-2.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-2.5">
                        <p className="font-semibold text-gray-900">{ticket.subject}</p>
                        <p className="font-mono text-[10px] text-red-600 font-medium mt-0.5">
                          {ticket.ticket_number}
                        </p>
                      </td>
                      <td className="px-4 py-2.5 text-gray-700">
                        <span className="font-medium text-gray-900">{ticket.department_name}</span>
                        <p className="text-[10px] text-gray-400">{ticket.unit_name}</p>
                      </td>
                      <td className="px-4 py-2.5 text-gray-700">
                        <p className="font-medium text-gray-900">{ticket.requester_name || ticket.requester}</p>
                        {ticket.requester_payroll_no && (
                          <p className="text-[10px] text-gray-400">Payroll: {ticket.requester_payroll_no}</p>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-gray-600">
                        {ticket.assigned_to_name ? (
                          <div className="flex items-center gap-1 text-gray-900 font-semibold">
                            <UserCheck className="w-3 h-3 text-red-600" />
                            <span>{ticket.assigned_to_name}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Department Queue</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            ticket.priority === "CRITICAL"
                              ? "bg-red-100 text-red-800"
                              : ticket.priority === "HIGH"
                                ? "bg-orange-100 text-orange-800"
                                : ticket.priority === "MEDIUM"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-500">
                        {formatDate(ticket.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 3: User Directory */}
        {activeTab === "users" && (
          <div className="overflow-x-auto">
            <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">Manage staff access roles, payroll numbers, and permissions.</span>
              <button
                onClick={() => setModalType("single_user")}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition"
              >
                <UserPlus className="w-3 h-3" /> Add Employee
              </button>
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-semibold">
                  <th className="px-4 py-2.5">User</th>
                  <th className="px-4 py-2.5">Payroll No</th>
                  <th className="px-4 py-2.5">Roles</th>
                  <th className="px-4 py-2.5 text-center">Status</th>
                  <th className="px-4 py-2.5 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-xs">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers?.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/70 transition-colors group">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-red-50 border border-red-100 flex items-center justify-center text-red-600 text-xs font-semibold shrink-0">
                            {user.first_name?.[0] || "U"}
                            {user.last_name?.[0] || ""}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.first_name} {user.last_name}
                            </p>
                            <span className="text-[11px] text-gray-400">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-gray-600 font-mono text-[11px]">
                        {user.payroll_no || <span className="text-gray-300 italic">N/A</span>}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {user.is_admin && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold uppercase">
                              <Shield className="w-2.5 h-2.5" /> Admin
                            </span>
                          )}
                          {user.is_technician && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 text-[10px] font-semibold uppercase">
                              Technician
                            </span>
                          )}
                          {user.is_manager && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold uppercase">
                              Manager
                            </span>
                          )}
                          {user.is_employee && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold uppercase">
                              Employee
                            </span>
                          )}
                          {user.is_hod && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-semibold uppercase">
                              HOD
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {user.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-semibold">
                            <XCircle className="w-3 h-3" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setModalType("edit_user");
                          }}
                          className="inline-flex items-center justify-center p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Manage User"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <div>
                <span className="font-mono text-[11px] font-semibold text-red-600">
                  {selectedTicket.ticket_number}
                </span>
                <h3 className="text-xs font-semibold text-gray-900 mt-0.5">
                  {selectedTicket.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2.5 rounded border border-gray-100 text-gray-700">
                <div>
                  <span className="text-gray-400 text-[10px] block font-medium">Department</span>
                  <span className="font-semibold text-gray-900">{selectedTicket.department_name}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block font-medium">Service / Issue</span>
                  <span className="font-semibold text-gray-900">{selectedTicket.issue_name}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block font-medium">Requester</span>
                  <span className="font-semibold text-gray-900">
                    {selectedTicket.requester_name} ({selectedTicket.requester_email})
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block font-medium">Assigned Handler</span>
                  <span className="font-semibold text-gray-900">
                    {selectedTicket.assigned_to_name || "Department HOD"}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Description
                </h4>
                <div className="bg-gray-50/50 p-2.5 rounded border border-gray-100 text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selectedTicket.description}
                </div>
              </div>

              {selectedTicket.resolution_notes && (
                <div className="bg-emerald-50/60 p-2.5 rounded border border-emerald-200 text-emerald-950">
                  <h4 className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider mb-0.5">
                    Resolution Notes
                  </h4>
                  <p className="leading-relaxed">{selectedTicket.resolution_notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end px-4 py-2.5 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Setup Modals */}
      {modalType !== "none" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="relative bg-white rounded shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 border border-gray-200">
            <button
              onClick={closeModal}
              className="absolute top-3.5 right-3.5 p-1 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-5 overflow-y-auto">
              {modalType === "single_user" && <CreateEmployee onSuccess={closeModal} onCancel={closeModal} />}
              {modalType === "bulk_user" && <CreateEmployeeBulk onSuccess={closeModal} onCancel={closeModal} />}
              {modalType === "csv_user" && <CreateEmployeeBulkUpload onSuccess={closeModal} onCancel={closeModal} />}
              {modalType === "edit_user" && selectedUser && (
                <UpdateUser user={selectedUser} onSuccess={closeModal} onCancel={closeModal} />
              )}
              {modalType === "unit" && <CreateUnit onSuccess={closeModal} onCancel={closeModal} />}
              {modalType === "dept" && <CreateDepartment onSuccess={closeModal} onCancel={closeModal} />}
              {modalType === "cat" && <CreateCategory onSuccess={closeModal} onCancel={closeModal} />}
              {modalType === "issue" && <CreateIssue onSuccess={closeModal} onCancel={closeModal} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

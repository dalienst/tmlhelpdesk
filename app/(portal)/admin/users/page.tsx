"use client";

import { useState } from "react";
import { useFetchEmployees, useDownloadTemplate } from "@/hooks/accounts/actions";
import { User } from "@/services/accounts";
import CreateEmployee from "@/forms/accounts/CreateEmployee";
import CreateEmployeeBulk from "@/forms/accounts/CreateEmployeeBulk";
import CreateEmployeeBulkUpload from "@/forms/accounts/CreateEmployeeBulkUpload";
import UpdateUser from "@/forms/accounts/UpdateUser";
import {
  Users,
  UserPlus,
  Upload,
  Download,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Loader2,
  X,
  Shield,
  Briefcase,
  Settings,
  User as UserIcon,
  Building2,
  Filter,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const { data: users, isLoading, error, refetch } = useFetchEmployees();
  const { mutateAsync: downloadTemplateMutation, isPending: isDownloading } = useDownloadTemplate();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalType, setModalType] = useState<
    "none" | "single_user" | "bulk_user" | "csv_user" | "edit_user"
  >("none");

  const closeModal = () => {
    setModalType("none");
    setSelectedUser(null);
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await downloadTemplateMutation();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "staff_upload_template.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("CSV template downloaded!");
    } catch {
      toast.error("Failed to download template.");
    }
  };

  const filteredUsers = users?.filter((user) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      user.first_name?.toLowerCase().includes(term) ||
      user.last_name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.payroll_no?.toLowerCase().includes(term);

    const matchesRole =
      roleFilter === "ALL" ||
      (roleFilter === "ADMIN" && (user.is_admin || user.is_superuser)) ||
      (roleFilter === "MANAGER" && user.is_manager) ||
      (roleFilter === "TECHNICIAN" && user.is_technician) ||
      (roleFilter === "EMPLOYEE" && user.is_employee) ||
      (roleFilter === "HOD" && user.is_hod) ||
      (roleFilter === "HR" && user.is_hr);

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && user.is_active) ||
      (statusFilter === "INACTIVE" && !user.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // KPI calculations
  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter((u) => u.is_active).length || 0;
  const techniciansCount = users?.filter((u) => u.is_technician).length || 0;
  const managersCount = users?.filter((u) => u.is_manager).length || 0;
  const adminsCount = users?.filter((u) => u.is_admin || u.is_superuser).length || 0;

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary-blue/10 flex items-center justify-center text-primary-blue">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              User Directory & Staff Management
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Manage organization staff accounts, assign roles (Admin, Manager, Technician, Employee, HOD, HR), and oversee system access.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadTemplate}
            disabled={isDownloading}
            className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded border border-gray-200 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Download CSV Template"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            Template
          </button>
          <button
            onClick={() => setModalType("csv_user")}
            className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded border border-gray-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Upload className="w-3.5 h-3.5 text-gray-500" />
            Upload CSV
          </button>
          <button
            onClick={() => setModalType("bulk_user")}
            className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded border border-gray-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Users className="w-3.5 h-3.5 text-gray-500" />
            Bulk Add
          </button>
          <button
            onClick={() => setModalType("single_user")}
            className="bg-primary-blue hover:bg-primary-blue/95 text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Total Staff</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">{totalUsers}</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">{activeUsers} active accounts</p>
        </div>

        <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-technician-green">Technicians</p>
          <p className="text-xl font-semibold text-technician-green mt-1">{techniciansCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Ticket resolution staff</p>
        </div>

        <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-manager-orange">Managers</p>
          <p className="text-xl font-semibold text-manager-orange mt-1">{managersCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Department heads</p>
        </div>

        <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-admin-purple">Administrators</p>
          <p className="text-xl font-semibold text-admin-purple mt-1">{adminsCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Full system access</p>
        </div>

        <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-employee-blue">Employees</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">
            {users?.filter((u) => u.is_employee).length || 0}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Portal ticketing users</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search staff by name, email, or payroll number..."
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-primary-blue focus:bg-white transition"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-primary-blue focus:bg-white transition text-gray-700"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Administrators</option>
              <option value="MANAGER">Managers</option>
              <option value="TECHNICIAN">Technicians</option>
              <option value="EMPLOYEE">Employees</option>
              <option value="HOD">Head of Department (HOD)</option>
              <option value="HR">Human Resources (HR)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-primary-blue focus:bg-white transition text-gray-700"
            >
              <option value="ALL">All Account Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Deactivated Only</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100 text-[11px] text-gray-500">
          <span>
            Showing <strong className="text-gray-900 font-semibold">{filteredUsers?.length || 0}</strong> of{" "}
            {totalUsers} staff members
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-gray-500 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-primary-blue mx-auto mb-2" />
            Loading staff directory...
          </div>
        ) : error ? (
          <div className="py-12 text-center text-primary-red text-xs">
            Failed to load users. Please refresh the page.
          </div>
        ) : !filteredUsers || filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-700">No staff members found</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Try adjusting your search criteria or add new users.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-600 font-semibold uppercase text-[11px]">
                  <th className="px-4 py-3">Staff Member</th>
                  <th className="px-4 py-3">Payroll No</th>
                  <th className="px-4 py-3">Roles & Permissions</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/70 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-primary-blue/10 border border-primary-blue/20 flex items-center justify-center text-primary-blue font-semibold text-xs shrink-0">
                          {user.first_name?.[0] || "U"}
                          {user.last_name?.[0] || ""}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-[11px] text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] px-2 py-0.5 bg-gray-100 border border-gray-200 rounded font-semibold text-gray-700">
                        {user.payroll_no || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {user.is_admin && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-admin-purple/10 text-admin-purple border border-admin-purple/20">
                            <Shield className="w-2.5 h-2.5" /> Admin
                          </span>
                        )}
                        {user.is_manager && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-manager-orange/10 text-manager-orange border border-manager-orange/20">
                            <Briefcase className="w-2.5 h-2.5" /> Manager
                          </span>
                        )}
                        {user.is_technician && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-technician-green/10 text-technician-green border border-technician-green/20">
                            <Settings className="w-2.5 h-2.5" /> Technician
                          </span>
                        )}
                        {user.is_hod && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-primary-blue/10 text-primary-blue border border-primary-blue/20">
                            <Building2 className="w-2.5 h-2.5" /> HOD
                          </span>
                        )}
                        {user.is_hr && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            HR
                          </span>
                        )}
                        {user.is_employee && !user.is_admin && !user.is_manager && !user.is_technician && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-employee-blue/10 text-employee-blue border border-employee-blue/20">
                            <UserIcon className="w-2.5 h-2.5" /> Employee
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      {user.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                          <XCircle className="w-3 h-3 text-gray-400" /> Deactivated
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setModalType("edit_user");
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-gray-50 text-gray-600 hover:text-primary-blue hover:bg-primary-blue/5 border border-gray-200 transition"
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

      {/* Modals */}
      {modalType !== "none" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-xs font-semibold text-gray-700">
                {modalType === "single_user" && "Create Single User"}
                {modalType === "bulk_user" && "Create Multiple Users"}
                {modalType === "csv_user" && "Upload Users CSV"}
                {modalType === "edit_user" && "Manage User & Permissions"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {modalType === "single_user" && (
                <CreateEmployee onSuccess={closeModal} onCancel={closeModal} />
              )}
              {modalType === "bulk_user" && (
                <CreateEmployeeBulk onSuccess={closeModal} onCancel={closeModal} />
              )}
              {modalType === "csv_user" && (
                <CreateEmployeeBulkUpload onSuccess={closeModal} onCancel={closeModal} />
              )}
              {modalType === "edit_user" && selectedUser && (
                <UpdateUser user={selectedUser} onSuccess={closeModal} onCancel={closeModal} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

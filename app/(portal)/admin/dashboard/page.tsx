"use client";

import { useFetchEmployees } from "@/hooks/accounts/actions";
import { User } from "@/services/accounts";
import { Loader2, Users, Shield, CheckCircle2, XCircle, Search, Mail, Hash, Building2, Briefcase, Plus, UserPlus, Upload, X, ChevronDown, Edit2, Filter } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import CreateEmployee from "@/forms/accounts/CreateEmployee";
import CreateEmployeeBulk from "@/forms/accounts/CreateEmployeeBulk";
import CreateEmployeeBulkUpload from "@/forms/accounts/CreateEmployeeBulkUpload";
import UpdateUser from "@/forms/accounts/UpdateUser";

export default function AdminDashboard() {
  const { data: users, isLoading, isError } = useFetchEmployees();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [modalType, setModalType] = useState<'none' | 'single' | 'bulk' | 'csv' | 'edit'>('none');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeModal = () => {
    setModalType('none');
    setTimeout(() => setSelectedUser(null), 200); // clear after animation
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary-blue" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="text-center p-6 bg-primary-red/5 border border-primary-red/20 rounded">
          <XCircle className="w-6 h-6 text-primary-red mx-auto mb-3" />
          <h3 className="text-gray-900 text-sm font-semibold">Failed to load users</h3>
          <p className="text-sm text-gray-500 mt-1">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const activeUsersCount = users?.filter(u => u.is_active)?.length || 0;
  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesRole = true;
    if (roleFilter !== "all") {
      switch (roleFilter) {
        case "admin": matchesRole = !!user.is_admin; break;
        case "manager": matchesRole = !!user.is_manager; break;
        case "technician": matchesRole = !!user.is_technician; break;
        case "hr": matchesRole = !!user.is_hr; break;
        case "hod": matchesRole = !!user.is_hod; break;
        case "trainer": matchesRole = !!user.is_trainer; break;
        case "employee": matchesRole = !!user.is_employee; break;
      }
    }

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Overview of system users and platform access
        </p>
      </div>
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 shadow-sm rounded px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-primary-blue/10 flex items-center justify-center text-primary-blue shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Total Users</p>
            <p className="text-xl font-semibold text-gray-900 leading-none mt-1">{users?.length || 0}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm rounded px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Active</p>
            <p className="text-xl font-semibold text-gray-900 leading-none mt-1">{activeUsersCount}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm rounded px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-manager-orange/10 flex items-center justify-center text-manager-orange shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Departments</p>
            <p className="text-xl font-semibold text-gray-900 leading-none mt-1">12</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm rounded px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-admin-purple/10 flex items-center justify-center text-admin-purple shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Admins</p>
            <p className="text-xl font-semibold text-gray-900 leading-none mt-1">{users?.filter(u => u.is_admin)?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 focus:border-primary-blue focus:bg-white focus:ring-1 focus:ring-primary-blue rounded pl-9 pr-4 py-2 text-sm outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Role Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-gray-50/50 border border-gray-200 focus:border-primary-blue focus:bg-white focus:ring-1 focus:ring-primary-blue rounded px-3 py-2 text-sm outline-none transition-all text-gray-700 font-medium"
              >
                <option value="all">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="manager">Managers</option>
                <option value="technician">Technicians</option>
                <option value="employee">Employees</option>
                <option value="hr">HR Personnel</option>
                <option value="hod">HODs</option>
                <option value="trainer">Trainers</option>
              </select>
            </div>
          </div>

          {/* Action Popover for Adding Users */}
          <div className="relative" ref={popoverRef}>
            <button
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-blue hover:bg-primary-blue/95 text-white rounded text-sm font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Users</span>
              <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform ${isPopoverOpen ? 'rotate-180' : ''}`} />
            </button>

            {isPopoverOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setIsPopoverOpen(false);
                    setModalType('single');
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors font-medium"
                >
                  <UserPlus className="w-4 h-4 text-primary-blue" />
                  <span>Single User</span>
                </button>
                <button
                  onClick={() => {
                    setIsPopoverOpen(false);
                    setModalType('bulk');
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors font-medium"
                >
                  <Users className="w-4 h-4 text-manager-orange" />
                  <span>Bulk Entry</span>
                </button>
                <button
                  onClick={() => {
                    setIsPopoverOpen(false);
                    setModalType('csv');
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors font-medium"
                >
                  <Upload className="w-4 h-4 text-technician-green" />
                  <span>CSV File Upload</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/70 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3.5 font-medium">User</th>
                <th className="px-6 py-3.5 font-medium">Payroll No</th>
                <th className="px-6 py-3.5 font-medium">Assigned Roles</th>
                <th className="px-6 py-3.5 font-medium text-center">Status</th>
                <th className="px-6 py-3.5 font-medium text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers?.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary-blue/5 border border-primary-blue/10 flex items-center justify-center text-primary-blue text-xs font-semibold shrink-0 group-hover:bg-primary-blue group-hover:text-white transition-colors">
                          {user.first_name?.[0] || 'U'}
                          {user.last_name?.[0] || ''}
                        </div>
                        <div>
                          <p className="text-sm text-gray-900 font-semibold">
                            {user.first_name} {user.last_name}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5 text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span className="text-[11px]">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1 text-gray-600 text-xs">
                        <Hash className="w-3 h-3 text-gray-400" />
                        {user.payroll_no || <span className="text-gray-400 italic">N/A</span>}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {user.is_admin && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-admin-purple/10 text-admin-purple border border-admin-purple/20 text-[10px] font-semibold uppercase">
                            <Shield className="w-2.5 h-2.5" /> Admin
                          </span>
                        )}
                        {user.is_manager && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-manager-orange/10 text-manager-orange border border-manager-orange/20 text-[10px] font-semibold uppercase">
                            Manager
                          </span>
                        )}
                        {user.is_technician && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-technician-green/10 text-technician-green border border-technician-green/20 text-[10px] font-semibold uppercase">
                            Technician
                          </span>
                        )}
                        {user.is_employee && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-employee-blue/10 text-employee-blue border border-employee-blue/20 text-[10px] font-semibold uppercase">
                            Employee
                          </span>
                        )}
                        {user.is_hr && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-pink-50 text-pink-600 border border-pink-200 text-[10px] font-semibold uppercase">
                            HR
                          </span>
                        )}
                        {user.is_hod && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-semibold uppercase">
                            HOD
                          </span>
                        )}
                        {user.is_trainer && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-200 text-[10px] font-semibold uppercase">
                            Trainer
                          </span>
                        )}
                        {!user.is_admin && !user.is_manager && !user.is_technician && !user.is_employee && !user.is_hr && !user.is_hod && !user.is_trainer && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200 text-[10px] font-semibold uppercase">
                            None
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {user.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-semibold uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-semibold uppercase tracking-wider">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setModalType('edit');
                        }}
                        className="inline-flex items-center justify-center p-1.5 rounded text-gray-400 hover:text-primary-blue hover:bg-primary-blue/5 transition-colors border border-transparent"
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
      </div>

      {/* Reusable Modal Overlay */}
      {modalType !== 'none' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
          <div 
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <button
              onClick={closeModal}
              className="absolute top-3.5 right-3.5 p-1.5 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-5 md:p-6 overflow-y-auto">
              {modalType === 'single' && <CreateEmployee onSuccess={closeModal} onCancel={closeModal} />}
              {modalType === 'bulk' && <CreateEmployeeBulk onSuccess={closeModal} onCancel={closeModal} />}
              {modalType === 'csv' && <CreateEmployeeBulkUpload onSuccess={closeModal} onCancel={closeModal} />}
              {modalType === 'edit' && selectedUser && <UpdateUser user={selectedUser} onSuccess={closeModal} onCancel={closeModal} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

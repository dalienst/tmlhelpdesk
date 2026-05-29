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
        <Loader2 className="w-8 h-8 animate-spin text-primary-blue" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="text-center p-6 bg-primary-red/5 border border-primary-red/20 rounded-2xl">
          <XCircle className="w-8 h-8 text-primary-red mx-auto mb-3" />
          <h3 className="text-gray-900 text-textBold">Failed to load users</h3>
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
        <h1 className="text-textBold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 text-textRegular">
          Overview of system users and platform access
        </p>
      </div>
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 text-textBold uppercase tracking-wider">Total Users</p>
            <p className="text-xl text-textBold text-gray-900 leading-none mt-1">{users?.length || 0}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 text-textBold uppercase tracking-wider">Active</p>
            <p className="text-xl text-textBold text-gray-900 leading-none mt-1">{activeUsersCount}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-manager-orange/10 flex items-center justify-center text-manager-orange shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 text-textBold uppercase tracking-wider">Departments</p>
            <p className="text-xl text-textBold text-gray-900 leading-none mt-1">12</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-admin-purple/10 flex items-center justify-center text-admin-purple shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 text-textBold uppercase tracking-wider">Units</p>
            <p className="text-xl text-textBold text-gray-900 leading-none mt-1">5</p>
          </div>
        </div>
      </div>

      {/* Users List Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 rounded-t-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl">
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-primary-blue rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-gray-400 shadow-sm"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            
            <div className="relative w-full sm:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full sm:w-auto bg-white border border-gray-200 focus:border-primary-blue rounded-xl py-2.5 px-4 pr-10 text-sm outline-none transition-all shadow-sm appearance-none cursor-pointer text-gray-700 font-medium"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="technician">Technician</option>
                <option value="hr">HR</option>
                <option value="hod">HOD</option>
                <option value="trainer">Trainer</option>
                <option value="employee">Employee</option>
              </select>
              <Filter className="absolute right-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          {/* Popover Button */}
          <div className="relative" ref={popoverRef}>
            <button 
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              className="bg-primary-blue hover:bg-primary-blue/95 text-white px-4 py-2.5 rounded-xl text-sm text-textBold transition-colors shadow-sm whitespace-nowrap flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New User <ChevronDown className={`w-3 h-3 transition-transform ${isPopoverOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Popover Menu */}
            {isPopoverOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={() => { setModalType('single'); setIsPopoverOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-blue transition-colors text-left"
                >
                  <UserPlus className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-textBold">Single User</p>
                    <p className="text-[10px] text-gray-500">Create one user manually</p>
                  </div>
                </button>
                <button
                  onClick={() => { setModalType('bulk'); setIsPopoverOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-manager-orange transition-colors text-left"
                >
                  <Users className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-textBold">Bulk Creation</p>
                    <p className="text-[10px] text-gray-500">Add up to 15 users at once</p>
                  </div>
                </button>
                <button
                  onClick={() => { setModalType('csv'); setIsPopoverOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors text-left"
                >
                  <Upload className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-textBold">CSV Upload</p>
                    <p className="text-[10px] text-gray-500">Upload spreadsheet (max 100)</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 text-textBold">
                <th className="px-6 py-4 font-medium">User Details</th>
                <th className="px-6 py-4 font-medium">Payroll No</th>
                <th className="px-6 py-4 font-medium">Roles</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Manage</th>
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-blue/5 border border-primary-blue/10 flex items-center justify-center text-primary-blue text-sm text-textBold shrink-0 group-hover:bg-primary-blue group-hover:text-white transition-colors">
                          {user.first_name?.[0] || 'U'}
                          {user.last_name?.[0] || ''}
                        </div>
                        <div>
                          <p className="text-sm text-gray-900 text-textBold">
                            {user.first_name} {user.last_name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5 text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span className="text-[11px]">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                        <Hash className="w-3 h-3 text-gray-400" />
                        {user.payroll_no || <span className="text-gray-400 italic">N/A</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {user.is_admin && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-admin-purple/10 text-admin-purple border border-admin-purple/20 text-[10px] text-textBold uppercase">
                            <Shield className="w-3 h-3" /> Admin
                          </span>
                        )}
                        {user.is_manager && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-manager-orange/10 text-manager-orange border border-manager-orange/20 text-[10px] text-textBold uppercase">
                            Manager
                          </span>
                        )}
                        {user.is_technician && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-technician-green/10 text-technician-green border border-technician-green/20 text-[10px] text-textBold uppercase">
                            Technician
                          </span>
                        )}
                        {user.is_employee && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-employee-blue/10 text-employee-blue border border-employee-blue/20 text-[10px] text-textBold uppercase">
                            Employee
                          </span>
                        )}
                        {user.is_hr && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-pink-50 text-pink-600 border border-pink-200 text-[10px] text-textBold uppercase">
                            HR
                          </span>
                        )}
                        {user.is_hod && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200 text-[10px] text-textBold uppercase">
                            HOD
                          </span>
                        )}
                        {user.is_trainer && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200 text-[10px] text-textBold uppercase">
                            Trainer
                          </span>
                        )}
                        {!user.is_admin && !user.is_manager && !user.is_technician && !user.is_employee && !user.is_hr && !user.is_hod && !user.is_trainer && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200 text-[10px] text-textBold uppercase">
                            None
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {user.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] text-textBold uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200 text-[10px] text-textBold uppercase tracking-wider">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setModalType('edit');
                        }}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-primary-blue hover:bg-primary-blue/5 transition-colors border border-transparent hover:border-primary-blue/20"
                        title="Manage User"
                      >
                        <Edit2 className="w-4 h-4" />
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 md:p-8 overflow-y-auto">
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
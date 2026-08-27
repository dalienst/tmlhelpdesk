"use client";

import { useState } from "react";
import { useFetchDepartments } from "@/hooks/departments/actions";
import { useFetchUnits } from "@/hooks/units/actions";
import { Department } from "@/services/departments";
import CreateDepartment from "@/forms/departments/CreateDepartment";
import UpdateDepartment from "@/forms/departments/UpdateDepartment";
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  X,
  Building2,
  UserCheck,
  Users,
  Loader2,
  Filter,
} from "lucide-react";

export default function DepartmentsManagementPage() {
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>("");
  const {
    data: departments,
    isLoading,
    error,
  } = useFetchDepartments(selectedUnitFilter || undefined);
  const { data: units } = useFetchUnits();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [modalType, setModalType] = useState<"none" | "create" | "edit">("none");

  const closeModal = () => {
    setModalType("none");
    setSelectedDept(null);
  };

  const filteredDepartments = departments?.filter((dept) => {
    const term = searchTerm.toLowerCase();
    return (
      dept.name?.toLowerCase().includes(term) ||
      dept.code?.toLowerCase().includes(term) ||
      dept.unit?.toLowerCase().includes(term) ||
      dept.supervisor?.toLowerCase().includes(term) ||
      dept.description?.toLowerCase().includes(term)
    );
  });

  const totalDepts = departments?.length || 0;
  const activeDepts = departments?.filter((d) => d.is_active).length || 0;
  const uniqueUnitsCount = new Set(departments?.map((d) => d.unit)).size;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl text-textBold text-gray-900 tracking-tight">
            Departments Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage functional service departments, assign heads, and configure technician routing.
          </p>
        </div>

        <button
          onClick={() => setModalType("create")}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-blue hover:bg-primary-blue/95 text-white text-sm text-textBold shadow-md shadow-primary-blue/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>New Department</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-manager-orange/10 text-manager-orange flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase text-textBold tracking-wider">
              Total Departments
            </p>
            <p className="text-2xl text-textBold text-gray-900 mt-0.5">
              {isLoading ? "—" : totalDepts}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase text-textBold tracking-wider">
              Active Departments
            </p>
            <p className="text-2xl text-textBold text-gray-900 mt-0.5">
              {isLoading ? "—" : activeDepts}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-blue/10 text-primary-blue flex items-center justify-center shrink-0 border border-primary-blue/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase text-textBold tracking-wider">
              Units Covered
            </p>
            <p className="text-2xl text-textBold text-gray-900 mt-0.5">
              {isLoading ? "—" : uniqueUnitsCount}
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Filters & Search Toolbar */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by department name, code, supervisor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 focus:border-primary-blue focus:bg-white focus:ring-1 focus:ring-primary-blue rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Unit Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
              <select
                value={selectedUnitFilter}
                onChange={(e) => setSelectedUnitFilter(e.target.value)}
                className="bg-gray-50/50 border border-gray-200 focus:border-primary-blue focus:bg-white focus:ring-1 focus:ring-primary-blue rounded-xl px-3 py-2.5 text-sm outline-none transition-all text-gray-700"
              >
                <option value="">All Units / Branches</option>
                {units
                  ?.filter((u) => u.is_active)
                  .map((u) => (
                    <option key={u.id || u.name} value={u.name}>
                      {u.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <span className="text-xs text-gray-500 text-textRegular">
            Showing <strong className="text-gray-900">{filteredDepartments?.length || 0}</strong> of{" "}
            {totalDepts} departments
          </span>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs text-textBold uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Unit / Branch</th>
                <th className="px-6 py-4 font-medium">Supervisor / Head</th>
                <th className="px-6 py-4 font-medium text-center">Staff Members</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-blue mb-2" />
                    Loading departments...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-primary-red">
                    Failed to load departments. Please refresh the page.
                  </td>
                </tr>
              ) : filteredDepartments?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Layers className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    No departments found.
                  </td>
                </tr>
              ) : (
                filteredDepartments?.map((dept) => (
                  <tr
                    key={dept.id || dept.reference}
                    className="hover:bg-gray-50/60 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-manager-orange/10 border border-manager-orange/20 flex items-center justify-center text-manager-orange font-bold text-sm shrink-0 group-hover:bg-manager-orange group-hover:text-white transition-colors">
                          {dept.name?.[0] || "D"}
                        </div>
                        <div>
                          <p className="text-sm text-gray-900 text-textBold">
                            {dept.name}
                          </p>
                          {dept.description && (
                            <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">
                              {dept.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-mono text-xs font-semibold border border-gray-200">
                        {dept.code}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-blue/5 text-primary-blue border border-primary-blue/15 text-xs text-textBold">
                        <Building2 className="w-3 h-3 shrink-0" />
                        {dept.unit}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {dept.supervisor ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-xs font-semibold shrink-0">
                            <UserCheck className="w-3.5 h-3.5 text-gray-600" />
                          </div>
                          <span className="text-xs text-gray-700 font-medium truncate max-w-[180px]">
                            {dept.supervisor}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-gray-100 text-gray-400 italic">
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                        <Users className="w-3 h-3 text-gray-500" />
                        {dept.staff?.length || 0} {dept.staff?.length === 1 ? "staff" : "staff"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {dept.is_active ? (
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
                          setSelectedDept(dept);
                          setModalType("edit");
                        }}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-primary-blue hover:bg-primary-blue/5 transition-colors border border-transparent hover:border-primary-blue/20"
                        title="Manage Department"
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

      {/* Modal Dialog Overlay */}
      {modalType !== "none" && (
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
              {modalType === "create" && (
                <CreateDepartment
                  defaultUnit={selectedUnitFilter}
                  onSuccess={closeModal}
                  onCancel={closeModal}
                />
              )}
              {modalType === "edit" && selectedDept && (
                <UpdateDepartment
                  department={selectedDept}
                  onSuccess={closeModal}
                  onCancel={closeModal}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

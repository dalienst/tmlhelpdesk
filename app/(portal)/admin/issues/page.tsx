"use client";

import { useState } from "react";
import { useFetchIssues } from "@/hooks/issues/actions";
import { useFetchCategories } from "@/hooks/categories/actions";
import { useFetchDepartments } from "@/hooks/departments/actions";
import { Issue } from "@/services/issues";
import CreateIssue from "@/forms/issues/CreateIssue";
import UpdateIssue from "@/forms/issues/UpdateIssue";
import {
  ListTree,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  X,
  UserCheck,
  Clock,
  AlertCircle,
  Loader2,
  Filter,
} from "lucide-react";

export default function IssuesManagementPage() {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("");
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>("");

  const {
    data: issues,
    isLoading,
    error,
  } = useFetchIssues({
    department: selectedDeptFilter || undefined,
    category: selectedCatFilter || undefined,
  });

  const { data: departments } = useFetchDepartments();
  const { data: categories } = useFetchCategories(selectedDeptFilter || undefined);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [modalType, setModalType] = useState<"none" | "create" | "edit">("none");

  const closeModal = () => {
    setModalType("none");
    setSelectedIssue(null);
  };

  const filteredIssues = issues?.filter((issue) => {
    const term = searchTerm.toLowerCase();
    return (
      issue.name?.toLowerCase().includes(term) ||
      issue.code?.toLowerCase().includes(term) ||
      issue.category_name?.toLowerCase().includes(term) ||
      issue.department_name?.toLowerCase().includes(term) ||
      issue.technician_name?.toLowerCase().includes(term) ||
      issue.technician_email?.toLowerCase().includes(term) ||
      issue.description?.toLowerCase().includes(term)
    );
  });

  const totalIssues = issues?.length || 0;
  const activeIssues = issues?.filter((i) => i.is_active).length || 0;
  const assignedIssuesCount = issues?.filter((i) => i.technician).length || 0;

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Issue Types &amp; Assigned Handlers
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure specific services (e.g., P9 Form Request) and designate the technician/officer in charge.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedIssue(null);
            setModalType("create");
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shadow-sm transition"
        >
          <Plus className="h-4 w-4" />
          Add Issue Type
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Issue Types</p>
            <p className="text-xl font-semibold text-gray-900 mt-0.5">{totalIssues}</p>
          </div>
          <div className="h-9 w-9 bg-gray-50 rounded flex items-center justify-center text-gray-500 border border-gray-100">
            <ListTree className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Auto-Routed to Staff</p>
            <p className="text-xl font-semibold text-blue-600 mt-0.5">{assignedIssuesCount}</p>
          </div>
          <div className="h-9 w-9 bg-blue-50 rounded flex items-center justify-center text-blue-600 border border-blue-100">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Active Services</p>
            <p className="text-xl font-semibold text-green-600 mt-0.5">{activeIssues}</p>
          </div>
          <div className="h-9 w-9 bg-green-50 rounded flex items-center justify-center text-green-600 border border-green-100">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 rounded p-3 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by issue name, code, technician, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <select
            value={selectedDeptFilter}
            onChange={(e) => {
              setSelectedDeptFilter(e.target.value);
              setSelectedCatFilter("");
            }}
            className="w-full sm:w-44 px-2.5 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white"
          >
            <option value="">All Departments</option>
            {departments?.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCatFilter}
            onChange={(e) => setSelectedCatFilter(e.target.value)}
            className="w-full sm:w-44 px-2.5 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white"
          >
            <option value="">All Categories</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-red-600" />
            <p className="text-xs">Loading issue types...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500 text-xs">
            Failed to load issue types. Please try again.
          </div>
        ) : !filteredIssues || filteredIssues.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <ListTree className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-xs font-medium">No issue types found</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Click &quot;Add Issue Type&quot; to specify requests (e.g., P9 Form) and assign responsible officers.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                  <th className="py-2.5 px-3">Issue / Service Name</th>
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Category &amp; Dept</th>
                  <th className="py-2.5 px-3">Technician In Charge</th>
                  <th className="py-2.5 px-3">SLA / Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-2.5 px-3 font-semibold text-gray-900">
                      {issue.name}
                      {issue.description && (
                        <p className="text-[11px] font-normal text-gray-400 line-clamp-1">
                          {issue.description}
                        </p>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-700 font-mono text-[10px] rounded border border-gray-200">
                        {issue.code}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-700">
                      <span className="font-medium text-gray-900">{issue.category_name}</span>
                      <span className="text-gray-400 text-[11px]"> ({issue.department_name})</span>
                    </td>
                    <td className="py-2.5 px-3">
                      {issue.technician_name ? (
                        <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                          <UserCheck className="h-3.5 w-3.5 text-red-600 shrink-0" />
                          <span>{issue.technician_name}</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          <AlertCircle className="h-3 w-3" /> HOD Fallback
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                            issue.default_priority === "CRITICAL"
                              ? "bg-red-100 text-red-800"
                              : issue.default_priority === "HIGH"
                                ? "bg-orange-100 text-orange-800"
                                : issue.default_priority === "MEDIUM"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {issue.default_priority}
                        </span>
                        <span className="text-[11px] text-gray-500 inline-flex items-center gap-0.5">
                          <Clock className="h-3 w-3 text-gray-400" /> {issue.sla_hours}h
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {issue.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                          <XCircle className="h-3 w-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedIssue(issue);
                          setModalType("edit");
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition text-xs font-medium"
                      >
                        <Edit2 className="h-3.5 w-3.5" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {modalType !== "none" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50 sticky top-0 bg-white z-10">
              <h3 className="text-xs font-semibold text-gray-700">
                {modalType === "create" ? "Add Issue Type" : "Edit Issue & Assignee"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4">
              {modalType === "create" ? (
                <CreateIssue
                  onSuccess={closeModal}
                  onCancel={closeModal}
                  defaultCategory={selectedCatFilter}
                />
              ) : (
                selectedIssue && (
                  <UpdateIssue
                    issue={selectedIssue}
                    onSuccess={closeModal}
                    onCancel={closeModal}
                  />
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

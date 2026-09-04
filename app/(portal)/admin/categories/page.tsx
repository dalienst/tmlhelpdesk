"use client";

import { useState } from "react";
import { useFetchCategories } from "@/hooks/categories/actions";
import { useFetchDepartments } from "@/hooks/departments/actions";
import { Category } from "@/services/categories";
import CreateCategory from "@/forms/categories/CreateCategory";
import UpdateCategory from "@/forms/categories/UpdateCategory";
import {
  FolderTree,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  X,
  Layers,
  UserCheck,
  Loader2,
  Filter,
} from "lucide-react";

export default function CategoriesManagementPage() {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("");
  const {
    data: categories,
    isLoading,
    error,
  } = useFetchCategories(selectedDeptFilter || undefined);
  const { data: departments } = useFetchDepartments();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [modalType, setModalType] = useState<"none" | "create" | "edit">("none");

  const closeModal = () => {
    setModalType("none");
    setSelectedCat(null);
  };

  const filteredCategories = categories?.filter((cat) => {
    const term = searchTerm.toLowerCase();
    return (
      cat.name?.toLowerCase().includes(term) ||
      cat.code?.toLowerCase().includes(term) ||
      cat.department_name?.toLowerCase().includes(term) ||
      cat.supervisor_name?.toLowerCase().includes(term) ||
      cat.description?.toLowerCase().includes(term)
    );
  });

  const totalCats = categories?.length || 0;
  const activeCats = categories?.filter((c) => c.is_active).length || 0;
  const uniqueDeptsCount = new Set(categories?.map((c) => c.department_name)).size;

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Service Categories
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Organize service sections under each department (e.g. Payroll, Accounts Payable, Hardware).
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCat(null);
            setModalType("create");
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shadow-sm transition"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Categories</p>
            <p className="text-xl font-semibold text-gray-900 mt-0.5">{totalCats}</p>
          </div>
          <div className="h-9 w-9 bg-gray-50 rounded flex items-center justify-center text-gray-500 border border-gray-100">
            <FolderTree className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Active Categories</p>
            <p className="text-xl font-semibold text-green-600 mt-0.5">{activeCats}</p>
          </div>
          <div className="h-9 w-9 bg-green-50 rounded flex items-center justify-center text-green-600 border border-green-100">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Mapped Departments</p>
            <p className="text-xl font-semibold text-blue-600 mt-0.5">{uniqueDeptsCount}</p>
          </div>
          <div className="h-9 w-9 bg-blue-50 rounded flex items-center justify-center text-blue-600 border border-blue-100">
            <Layers className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 rounded p-3 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by category name, code, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="w-full sm:w-56 px-2.5 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white"
          >
            <option value="">All Departments</option>
            {departments?.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name} ({dept.unit})
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
            <p className="text-xs">Loading categories...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500 text-xs">
            Failed to load categories. Please try again.
          </div>
        ) : !filteredCategories || filteredCategories.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <FolderTree className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-xs font-medium">No service categories found</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Click &quot;Add Category&quot; to define sections like Payroll, Accounts Payable, etc.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                  <th className="py-2.5 px-3">Category Name</th>
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Category Lead</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-2.5 px-3 font-semibold text-gray-900">
                      {cat.name}
                      {cat.description && (
                        <p className="text-[11px] font-normal text-gray-400 line-clamp-1">
                          {cat.description}
                        </p>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-700 font-mono text-[10px] rounded border border-gray-200">
                        {cat.code}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-gray-700">
                      {cat.department_name || cat.department}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600">
                      {cat.supervisor_name ? (
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="h-3.5 w-3.5 text-blue-500" />
                          <span>{cat.supervisor_name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Department HOD</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {cat.is_active ? (
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
                          setSelectedCat(cat);
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
          <div className="bg-white rounded shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xs font-semibold text-gray-700">
                {modalType === "create" ? "Add Category" : "Manage Category"}
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
                <CreateCategory
                  onSuccess={closeModal}
                  onCancel={closeModal}
                  defaultDepartment={selectedDeptFilter}
                />
              ) : (
                selectedCat && (
                  <UpdateCategory
                    category={selectedCat}
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

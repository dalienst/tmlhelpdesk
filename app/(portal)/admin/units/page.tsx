"use client";

import { useState } from "react";
import { useFetchUnits } from "@/hooks/units/actions";
import { Unit } from "@/services/units";
import CreateUnit from "@/forms/units/CreateUnit";
import UpdateUnit from "@/forms/units/UpdateUnit";
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  X,
  MapPin,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";

export default function UnitsManagementPage() {
  const { data: units, isLoading, error } = useFetchUnits();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [modalType, setModalType] = useState<"none" | "create" | "edit">("none");

  const closeModal = () => {
    setModalType("none");
    setSelectedUnit(null);
  };

  const filteredUnits = units?.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.code?.toLowerCase().includes(term) ||
      u.location?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
  });

  const totalUnits = units?.length || 0;
  const activeUnits = units?.filter((u) => u.is_active).length || 0;
  const inactiveUnits = totalUnits - activeUnits;

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Units Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage organization branches, hotel properties, and operational units.
          </p>
        </div>

        <button
          onClick={() => setModalType("create")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary-blue hover:bg-primary-blue/95 text-white text-sm font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Unit</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded p-4 border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary-blue/10 text-primary-blue flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500 uppercase font-semibold tracking-wider">
              Total Units
            </p>
            <p className="text-xl font-semibold text-gray-900 mt-0.5">
              {isLoading ? "—" : totalUnits}
            </p>
          </div>
        </div>

        <div className="bg-white rounded p-4 border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500 uppercase font-semibold tracking-wider">
              Active Units
            </p>
            <p className="text-xl font-semibold text-gray-900 mt-0.5">
              {isLoading ? "—" : activeUnits}
            </p>
          </div>
        </div>

        <div className="bg-white rounded p-4 border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 border border-gray-200">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500 uppercase font-semibold tracking-wider">
              Inactive Units
            </p>
            <p className="text-xl font-semibold text-gray-900 mt-0.5">
              {isLoading ? "—" : inactiveUnits}
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
        {/* Search Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search units by name, code, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 focus:border-primary-blue focus:bg-white focus:ring-1 focus:ring-primary-blue rounded pl-9 pr-4 py-2 text-sm outline-none transition-all placeholder:text-gray-400"
            />
          </div>
          <span className="text-xs text-gray-500">
            Showing <strong className="text-gray-900 font-semibold">{filteredUnits?.length || 0}</strong> of{" "}
            {totalUnits} units
          </span>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/70 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3.5 font-medium">Unit Info</th>
                <th className="px-6 py-3.5 font-medium">Code</th>
                <th className="px-6 py-3.5 font-medium">Location</th>
                <th className="px-6 py-3.5 font-medium">Contact</th>
                <th className="px-6 py-3.5 font-medium text-center">Status</th>
                <th className="px-6 py-3.5 font-medium text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500 text-sm">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary-blue mb-2" />
                    Loading units...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-primary-red text-sm">
                    Failed to load units. Please refresh the page.
                  </td>
                </tr>
              ) : filteredUnits?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500 text-sm">
                    <Building2 className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                    No units found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUnits?.map((unit) => (
                  <tr
                    key={unit.id || unit.reference}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary-blue/5 border border-primary-blue/10 flex items-center justify-center text-primary-blue font-semibold text-xs shrink-0 group-hover:bg-primary-blue group-hover:text-white transition-colors">
                          {unit.name?.[0] || "U"}
                        </div>
                        <div>
                          <p className="text-sm text-gray-900 font-semibold">
                            {unit.name}
                          </p>
                          {unit.description && (
                            <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">
                              {unit.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-mono text-xs font-semibold border border-gray-200">
                        {unit.code}
                      </span>
                    </td>

                    <td className="px-6 py-3.5">
                      {unit.location ? (
                        <div className="flex items-center gap-1 text-gray-600 text-xs">
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{unit.location}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-xs">—</span>
                      )}
                    </td>

                    <td className="px-6 py-3.5">
                      <div className="space-y-0.5">
                        {unit.email && (
                          <div className="flex items-center gap-1 text-gray-600 text-xs">
                            <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                            <span>{unit.email}</span>
                          </div>
                        )}
                        {unit.phone && (
                          <div className="flex items-center gap-1 text-gray-600 text-xs">
                            <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                            <span>{unit.phone}</span>
                          </div>
                        )}
                        {!unit.email && !unit.phone && (
                          <span className="text-gray-400 italic text-xs">—</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-3.5 text-center">
                      {unit.is_active ? (
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
                          setSelectedUnit(unit);
                          setModalType("edit");
                        }}
                        className="inline-flex items-center justify-center p-1.5 rounded text-gray-400 hover:text-primary-blue hover:bg-primary-blue/5 transition-colors border border-transparent"
                        title="Manage Unit"
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

      {/* Modal Dialog Overlay */}
      {modalType !== "none" && (
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
              {modalType === "create" && (
                <CreateUnit onSuccess={closeModal} onCancel={closeModal} />
              )}
              {modalType === "edit" && selectedUnit && (
                <UpdateUnit
                  unit={selectedUnit}
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

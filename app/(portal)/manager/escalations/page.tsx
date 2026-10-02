"use client";

import { useState } from "react";
import { useFetchDepartments } from "@/hooks/departments/actions";
import { useFetchDepartmentEscalationRule } from "@/hooks/escalations/actions";
import ConfigureEscalationRule from "@/forms/escalations/ConfigureEscalationRule";
import {
  ShieldAlert,
  Clock,
  AlertTriangle,
  Building2,
  Layers,
  Loader2,
  CheckCircle2,
  XCircle,
  Mail,
  Sliders,
} from "lucide-react";

export default function ManagerEscalationsPage() {
  const { data: departments, isLoading: deptsLoading } = useFetchDepartments();
  const [selectedDeptRef, setSelectedDeptRef] = useState<string>("");

  const activeDept =
    departments?.find((d) => d.reference === selectedDeptRef) ||
    departments?.[0] ||
    null;

  const currentRef = activeDept?.reference || "";

  const {
    data: escalationRule,
    isLoading: ruleLoading,
    refetch: refetchRule,
  } = useFetchDepartmentEscalationRule(currentRef);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-manager-orange" />
            Manager Escalation Rules
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure automated SLA warning thresholds, breach escalation, GM alerts, and emergency notifications for your operational departments.
          </p>
        </div>
      </div>

      {deptsLoading ? (
        <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary-blue mb-2" />
          <p className="text-xs">Loading department profiles...</p>
        </div>
      ) : !departments || departments.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded border border-gray-200">
          <Layers className="w-10 h-10 mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-semibold text-gray-700">No Managed Departments</p>
          <p className="text-xs text-gray-400 mt-1">
            You do not have assigned departments to configure escalation rules.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Selection Column */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Select Department
            </h2>
            <div className="space-y-2">
              {departments.map((dept) => {
                const isSelected =
                  (selectedDeptRef || departments[0]?.reference) === dept.reference;
                return (
                  <button
                    key={dept.id || dept.reference}
                    onClick={() => setSelectedDeptRef(dept.reference)}
                    className={`w-full text-left p-3.5 rounded border transition-all ${
                      isSelected
                        ? "bg-primary-blue text-white border-primary-blue shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{dept.name}</span>
                      <span
                        className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {dept.code}
                      </span>
                    </div>
                    <div
                      className={`text-xs mt-1 flex items-center gap-1.5 ${
                        isSelected ? "text-blue-100" : "text-gray-400"
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{dept.unit}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Escalation Rules Editor Column */}
          <div className="lg:col-span-2">
            {activeDept && (
              <div className="bg-white rounded border border-gray-200 p-6 shadow-sm">
                {ruleLoading ? (
                  <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-blue mb-2" />
                    <p className="text-xs">Loading escalation rules...</p>
                  </div>
                ) : (
                  <ConfigureEscalationRule
                    key={activeDept.reference}
                    departmentReference={activeDept.reference}
                    departmentName={activeDept.name}
                    initialRule={escalationRule}
                    onSuccess={() => refetchRule()}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

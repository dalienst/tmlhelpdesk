"use client";

import { useState } from "react";
import { useFetchGroups, useDeleteGroup } from "@/hooks/groups/actions";
import { Group } from "@/services/groups";
import CreateGroup from "@/forms/groups/CreateGroup";
import UpdateGroup from "@/forms/groups/UpdateGroup";
import {
  Users2,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  X,
  Layers,
  Building2,
  UserCheck,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function GroupsManagementPage() {
  const { data: groups, isLoading, error, refetch } = useFetchGroups();
  const { mutateAsync: deleteGroup } = useDeleteGroup();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [modalType, setModalType] = useState<"none" | "create" | "edit">("none");
  const [deletingRef, setDeletingRef] = useState<string | null>(null);

  const closeModal = () => {
    setModalType("none");
    setSelectedGroup(null);
  };

  const handleDelete = async (group: Group) => {
    if (
      !confirm(
        `Are you sure you want to delete the functional group "${group.name}"? This will unlink all associated departments.`
      )
    ) {
      return;
    }
    setDeletingRef(group.reference);
    try {
      await deleteGroup(group.reference);
      toast.success(`Group "${group.name}" removed successfully`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete group");
    } finally {
      setDeletingRef(null);
    }
  };

  const filteredGroups = groups?.filter((g) => {
    const term = searchTerm.toLowerCase();
    return (
      g.name?.toLowerCase().includes(term) ||
      g.code?.toLowerCase().includes(term) ||
      g.manager_name?.toLowerCase().includes(term) ||
      g.manager?.toLowerCase().includes(term) ||
      g.description?.toLowerCase().includes(term)
    );
  });

  const totalGroups = groups?.length || 0;
  const activeGroups = groups?.filter((g) => g.is_active).length || 0;
  const totalDeptsLinked =
    groups?.reduce((acc, g) => acc + (g.departments_count || 0), 0) || 0;

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users2 className="w-6 h-6 text-primary-blue" />
            Functional Groups
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Group departments across all Tamarind properties into corporate functional domains (e.g. Group IT, Group Maintenance) overseen by Group Managers.
          </p>
        </div>

        <button
          onClick={() => setModalType("create")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-blue hover:bg-primary-blue/95 text-white rounded text-xs font-semibold transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Functional Group</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Groups
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalGroups}</p>
          </div>
          <div className="w-10 h-10 rounded bg-blue-50 text-primary-blue flex items-center justify-center">
            <Users2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Active Domains
            </p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{activeGroups}</p>
          </div>
          <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Linked Departments
            </p>
            <p className="text-2xl font-bold text-admin-purple mt-1">
              {totalDeptsLinked}
            </p>
          </div>
          <div className="w-10 h-10 rounded bg-purple-50 text-admin-purple flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded border border-gray-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search functional groups by name, code, manager, or scope..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50/50 border border-gray-200 rounded focus:bg-white focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Groups Table */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary-blue mb-2" />
            <p className="text-xs">Loading functional groups...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 flex flex-col items-center justify-center">
            <AlertTriangle className="w-6 h-6 mb-2 text-red-500" />
            <p className="text-xs font-semibold">Failed to load groups</p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-xs text-primary-blue underline"
            >
              Try again
            </button>
          </div>
        ) : filteredGroups?.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users2 className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-700">No Groups Found</p>
            <p className="text-xs text-gray-400 mt-1">
              {searchTerm
                ? "No functional groups match your search criteria."
                : "Create your first cross-unit functional group to organize departments."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Group Name & Code</th>
                  <th className="py-3 px-4">Group Manager</th>
                  <th className="py-3 px-4">Linked Departments</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredGroups?.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900">{group.name}</div>
                      <div className="text-[11px] text-gray-400 font-mono">
                        {group.code}
                      </div>
                      {group.description && (
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1 max-w-sm">
                          {group.description}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {group.manager ? (
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-primary-blue shrink-0" />
                          <div>
                            <span className="font-medium text-gray-800 block">
                              {group.manager_name || group.manager}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {group.manager}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-primary-blue border border-blue-200">
                          {group.departments_count ?? 0} dept(s)
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {group.is_active ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-400 font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedGroup(group);
                            setModalType("edit");
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-primary-blue transition-colors"
                          title="Edit Group"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(group)}
                          disabled={deletingRef === group.reference}
                          className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-primary-red transition-colors disabled:opacity-50"
                          title="Delete Group"
                        >
                          {deletingRef === group.reference ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {modalType === "create" ? "Create Group" : "Update Group"}
              </span>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-200/60 rounded text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              {modalType === "create" && (
                <CreateGroup
                  onSuccess={() => {
                    closeModal();
                    refetch();
                  }}
                  onCancel={closeModal}
                />
              )}
              {modalType === "edit" && selectedGroup && (
                <UpdateGroup
                  group={selectedGroup}
                  onSuccess={() => {
                    closeModal();
                    refetch();
                  }}
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

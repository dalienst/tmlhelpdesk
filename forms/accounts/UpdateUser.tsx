"use client";

import { updateUserByAdmin, User } from "@/services/accounts";
import { Formik, Form, Field } from "formik";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, Shield, Briefcase, Settings } from "lucide-react";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";

interface UpdateUserProps {
  user: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function UpdateUser({ user, onSuccess, onCancel }: UpdateUserProps) {
  const axios = useAxiosAuth();
  const queryClient = useQueryClient();

  const initialValues = {
    is_active: !!user.is_active,
    is_admin: !!user.is_admin,
    is_manager: !!user.is_manager,
    is_employee: !!user.is_employee,
    is_technician: !!user.is_technician,
    is_hr: !!user.is_hr,
    is_hod: !!user.is_hod,
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Manage User</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Update roles and account status for {user.first_name} {user.last_name}
        </p>
      </div>

      <div className="bg-gray-50 rounded p-3 mb-4 border border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded bg-primary-blue/10 text-primary-blue flex items-center justify-center text-xs font-semibold">
          {user.first_name?.[0] || 'U'}{user.last_name?.[0] || ''}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{user.first_name} {user.last_name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const payload: any = {};
            if (Boolean(values.is_active) !== initialValues.is_active) payload.is_active = Boolean(values.is_active);
            if (Boolean(values.is_admin) !== initialValues.is_admin) payload.is_admin = Boolean(values.is_admin);
            if (Boolean(values.is_manager) !== initialValues.is_manager) payload.is_manager = Boolean(values.is_manager);
            if (Boolean(values.is_technician) !== initialValues.is_technician) payload.is_technician = Boolean(values.is_technician);
            if (Boolean(values.is_hr) !== initialValues.is_hr) payload.is_hr = Boolean(values.is_hr);
            if (Boolean(values.is_hod) !== initialValues.is_hod) payload.is_hod = Boolean(values.is_hod);

            if (Object.keys(payload).length === 0) {
              toast.success("No changes made.");
              onSuccess?.();
              return;
            }

            await updateUserByAdmin(user.reference, payload, axios);
            await queryClient.refetchQueries({ queryKey: ["employees"] });
            toast.success("User updated successfully!");
            onSuccess?.();
          } catch (error: any) {
            const errorData = error?.response?.data;
            const errorMsg = errorData ? (typeof errorData === 'object' ? JSON.stringify(errorData) : errorData) : "Failed to update user. Please try again.";
            toast.error(errorMsg, { duration: 6000 });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-4">
            {/* Account Status */}
            <div>
              <h3 className="text-xs font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-1.5">Account Status</h3>
              <label className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded border transition-all hover:bg-gray-50 border-gray-200">
                <Field type="checkbox" name="is_active" className="w-4 h-4 text-primary-blue rounded border-gray-300 focus:ring-primary-blue" />
                <div className="flex-1">
                  <p className={`text-xs font-semibold ${values.is_active ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {values.is_active ? "Active Account" : "Deactivated Account"}
                  </p>
                  <p className="text-[11px] text-gray-500">Allow or prevent this user from logging in</p>
                </div>
              </label>
            </div>

            {/* Roles */}
            <div>
              <h3 className="text-xs font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-1.5">Roles & Permissions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded border border-gray-200 hover:border-admin-purple/30 hover:bg-admin-purple/5 transition-all">
                  <Field type="checkbox" name="is_admin" className="mt-0.5 w-3.5 h-3.5 text-admin-purple rounded border-gray-300 focus:ring-admin-purple" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-admin-purple" /> Admin</p>
                    <p className="text-[11px] text-gray-500">Full system access</p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded border border-gray-200 hover:border-manager-orange/30 hover:bg-manager-orange/5 transition-all">
                  <Field type="checkbox" name="is_manager" className="mt-0.5 w-3.5 h-3.5 text-manager-orange rounded border-gray-300 focus:ring-manager-orange" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-manager-orange" /> Manager</p>
                    <p className="text-[11px] text-gray-500">Department oversight</p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded border border-gray-200 hover:border-technician-green/30 hover:bg-technician-green/5 transition-all">
                  <Field type="checkbox" name="is_technician" className="mt-0.5 w-3.5 h-3.5 text-technician-green rounded border-gray-300 focus:ring-technician-green" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 flex items-center gap-1.5"><Settings className="w-3.5 h-3.5 text-technician-green" /> Technician</p>
                    <p className="text-[11px] text-gray-500">Handles support tickets</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2.5 border-t border-gray-100 mt-4">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="px-3.5 py-2 rounded text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-blue hover:bg-primary-blue/95 text-white px-5 py-2 rounded text-xs font-semibold transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[110px]"
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

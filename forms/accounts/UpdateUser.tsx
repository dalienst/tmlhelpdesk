"use client";

import { useUpdateUserByAdmin } from "@/hooks/accounts/actions";
import { updateUserByAdmin, User } from "@/services/accounts";
import { Formik, Form, Field } from "formik";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, Shield, User as UserIcon, Settings, Briefcase, Hash } from "lucide-react";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";

interface UpdateUserProps {
  user: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function UpdateUser({ user, onSuccess, onCancel }: UpdateUserProps) {
  const { mutateAsync: updateUser } = useUpdateUserByAdmin(); // kept for reference, but unused based on user request
  const axios = useAxiosAuth()
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
      <div className="mb-6">
        <h2 className="text-2xl text-textBold text-gray-900 tracking-tight">Manage User</h2>
        <p className="text-sm text-gray-500 mt-1">Update roles and account status for {user.first_name} {user.last_name}</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary-blue/10 text-primary-blue flex items-center justify-center text-lg text-textBold">
          {user.first_name?.[0] || 'U'}{user.last_name?.[0] || ''}
        </div>
        <div>
          <p className="text-textBold text-gray-900">{user.first_name} {user.last_name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const payload = {
              is_active: Boolean(values.is_active),
              is_admin: Boolean(values.is_admin),
              is_manager: Boolean(values.is_manager),
              is_employee: Boolean(values.is_employee),
              is_technician: Boolean(values.is_technician),
              is_hr: Boolean(values.is_hr),
              is_hod: Boolean(values.is_hod),
            };
            await updateUserByAdmin(user.reference, payload, axios);
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            toast.success("User updated successfully!");
            onSuccess?.();
          } catch (error: any) {
            const errorData = error?.response?.data;
            const errorMsg = errorData ? (typeof errorData === 'object' ? JSON.stringify(errorData) : errorData) : "Failed to update user. Please try again.";
            toast.error(errorMsg, { duration: 6000 });
            console.log("Backend error:", errorData);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-6">
            
            {/* Account Status */}
            <div>
              <h3 className="text-sm text-textBold text-gray-900 mb-3 border-b border-gray-100 pb-2">Account Status</h3>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-all hover:bg-gray-50 border-gray-200">
                <Field type="checkbox" name="is_active" className="w-5 h-5 text-primary-blue rounded border-gray-300 focus:ring-primary-blue" />
                <div className="flex-1">
                  <p className={`text-sm text-textBold ${values.is_active ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {values.is_active ? "Active Account" : "Deactivated Account"}
                  </p>
                  <p className="text-xs text-gray-500">Allow or prevent this user from logging in</p>
                </div>
              </label>
            </div>

            {/* Roles */}
            <div>
              <h3 className="text-sm text-textBold text-gray-900 mb-3 border-b border-gray-100 pb-2">Roles & Permissions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-admin-purple/30 hover:bg-admin-purple/5 transition-all">
                  <Field type="checkbox" name="is_admin" className="mt-0.5 w-4 h-4 text-admin-purple rounded border-gray-300 focus:ring-admin-purple" />
                  <div>
                    <p className="text-sm text-textBold text-gray-900 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-admin-purple" /> Admin</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Full system access</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-manager-orange/30 hover:bg-manager-orange/5 transition-all">
                  <Field type="checkbox" name="is_manager" className="mt-0.5 w-4 h-4 text-manager-orange rounded border-gray-300 focus:ring-manager-orange" />
                  <div>
                    <p className="text-sm text-textBold text-gray-900 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-manager-orange" /> Manager</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Department oversight</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-technician-green/30 hover:bg-technician-green/5 transition-all">
                  <Field type="checkbox" name="is_technician" className="mt-0.5 w-4 h-4 text-technician-green rounded border-gray-300 focus:ring-technician-green" />
                  <div>
                    <p className="text-sm text-textBold text-gray-900 flex items-center gap-1.5"><Settings className="w-3.5 h-3.5 text-technician-green" /> Technician</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Handles support tickets</p>
                  </div>
                </label>


              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-lg text-sm text-textBold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 border border-transparent"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-blue hover:bg-primary-blue/95 text-white px-6 py-2.5 rounded-lg text-sm text-textBold transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[120px]"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

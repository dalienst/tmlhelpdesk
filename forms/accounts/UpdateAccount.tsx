"use client";

import { useSession } from "next-auth/react";
import { updateAccount } from "@/services/accounts";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { Formik, Form, Field } from "formik";
import toast from "react-hot-toast";
import { Loader2, User as UserIcon, Mail, Hash } from "lucide-react";

export default function UpdateAccount() {
  const { data: session, update } = useSession();
  const axios = useAxiosAuth();
  const user = session?.user;

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary-blue" />
      </div>
    );
  }

  const initialValues = {
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-4 border-b border-gray-100 pb-3">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Personal Information</h2>
        <p className="text-xs text-gray-500 mt-0.5">Update your basic profile details and email address.</p>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const formData = new FormData();
            if (values.first_name !== initialValues.first_name) formData.append("first_name", values.first_name);
            if (values.last_name !== initialValues.last_name) formData.append("last_name", values.last_name);
            if (values.email !== initialValues.email) formData.append("email", values.email);

            let hasChanges = false;
            for (let [key, value] of formData.entries()) {
              hasChanges = true;
              break;
            }

            if (!hasChanges) {
              toast.success("No changes made.");
              return;
            }

            const res = await updateAccount(user.id as string, formData, axios);
            
            await update({
              ...session,
              user: {
                ...session?.user,
                first_name: res.first_name,
                last_name: res.last_name,
                email: res.email,
              }
            });

            toast.success("Profile updated successfully!");
          } catch (error: any) {
            const errorData = error?.response?.data;
            const errorMsg = errorData ? (typeof errorData === 'object' ? JSON.stringify(errorData) : errorData) : "Failed to update profile. Please try again.";
            toast.error(errorMsg, { duration: 6000 });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="first_name" className="text-xs font-semibold text-gray-700">First Name</label>
                <div className="relative">
                  <Field
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="Enter your first name"
                    className="w-full bg-white border border-gray-200 focus:border-primary-blue rounded py-2 pl-9 pr-3 text-sm outline-none transition-all placeholder:text-gray-400"
                  />
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Last Name Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="last_name" className="text-xs font-semibold text-gray-700">Last Name</label>
                <div className="relative">
                  <Field
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Enter your last name"
                    className="w-full bg-white border border-gray-200 focus:border-primary-blue rounded py-2 pl-9 pr-3 text-sm outline-none transition-all placeholder:text-gray-400"
                  />
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5 max-w-md">
              <label htmlFor="email" className="text-xs font-semibold text-gray-700">Email Address</label>
              <div className="relative">
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white border border-gray-200 focus:border-primary-blue rounded py-2 pl-9 pr-3 text-sm outline-none transition-all placeholder:text-gray-400"
                />
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-blue hover:bg-primary-blue/95 text-white px-5 py-2 rounded text-xs font-semibold transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[120px]"
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Read-Only Account Details */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h2 className="text-base font-semibold text-gray-900 tracking-tight mb-4">Account Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-100 rounded p-3.5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Payroll Number</p>
            <p className="text-sm text-gray-900 font-semibold font-mono">
              {(user as any).payroll_no || "N/A"}
            </p>
          </div>
          
          <div className="bg-gray-50 border border-gray-100 rounded p-3.5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Assigned Roles</p>
            <div className="flex flex-wrap gap-1.5">
              {(user as any).is_admin && (
                <span className="inline-flex items-center gap-1 bg-admin-purple/10 text-admin-purple border border-admin-purple/20 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
                  Admin
                </span>
              )}
              {(user as any).is_manager && (
                <span className="inline-flex items-center gap-1 bg-manager-orange/10 text-manager-orange border border-manager-orange/20 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
                  Manager
                </span>
              )}
              {(user as any).is_technician && (
                <span className="inline-flex items-center gap-1 bg-technician-green/10 text-technician-green border border-technician-green/20 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
                  Technician
                </span>
              )}
              {(user as any).is_employee && (
                <span className="inline-flex items-center gap-1 bg-employee-blue/10 text-employee-blue border border-employee-blue/20 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
                  Employee
                </span>
              )}
              {!((user as any).is_admin || (user as any).is_manager || (user as any).is_technician || (user as any).is_employee) && (
                <span className="text-xs text-gray-400 italic">No roles assigned</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCreateEmployee } from "@/hooks/accounts/actions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Loader2, Shield, Briefcase, Settings, User, Building2, Users } from "lucide-react";

interface CreateEmployeeProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  payroll_no: Yup.string().required("Payroll number is required"),
});

export default function CreateEmployee({ onSuccess, onCancel }: CreateEmployeeProps) {
  const { mutateAsync: createEmployee } = useCreateEmployee();

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    payroll_no: "",
    is_employee: true,
    is_technician: false,
    is_manager: false,
    is_admin: false,
    is_hod: false,
    is_hr: false,
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Create Single User</h2>
        <p className="text-xs text-gray-500 mt-0.5">Add a new user and assign their roles and permissions.</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await createEmployee(values);
            toast.success("User created successfully!");
            resetForm();
            onSuccess?.();
          } catch (error: any) {
            const errorData = error?.response?.data;
            const errorMsg = errorData
              ? typeof errorData === "object"
                ? Object.entries(errorData)
                    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
                    .join(" | ")
                : errorData
              : "Failed to create user. Please try again.";
            toast.error(errorMsg, { duration: 6000 });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="first_name" className="text-xs font-semibold text-gray-700">
                  First Name <span className="text-primary-red">*</span>
                </label>
                <Field
                  id="first_name"
                  name="first_name"
                  placeholder="e.g. Jane"
                  className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400"
                />
                <ErrorMessage name="first_name" component="div" className="text-primary-red text-xs mt-0.5" />
              </div>

              <div className="space-y-1">
                <label htmlFor="last_name" className="text-xs font-semibold text-gray-700">
                  Last Name <span className="text-primary-red">*</span>
                </label>
                <Field
                  id="last_name"
                  name="last_name"
                  placeholder="e.g. Doe"
                  className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400"
                />
                <ErrorMessage name="last_name" component="div" className="text-primary-red text-xs mt-0.5" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold text-gray-700">
                Email Address <span className="text-primary-red">*</span>
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="jane.doe@tamarind.co.ke"
                className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400"
              />
              <ErrorMessage name="email" component="div" className="text-primary-red text-xs mt-0.5" />
            </div>

            <div className="space-y-1">
              <label htmlFor="payroll_no" className="text-xs font-semibold text-gray-700">
                Payroll Number <span className="text-primary-red">*</span>
              </label>
              <Field
                id="payroll_no"
                name="payroll_no"
                placeholder="e.g. PR-1002"
                className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400"
              />
              <ErrorMessage name="payroll_no" component="div" className="text-primary-red text-xs mt-0.5" />
            </div>

            {/* Roles & Permissions */}
            <div>
              <div className="flex items-center justify-between mb-2 border-b border-gray-100 pb-1.5">
                <h3 className="text-xs font-semibold text-gray-900">Roles & Permissions</h3>
                <span className="text-[11px] text-gray-400">Select all that apply</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Employee (Default selected) */}
                <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded border border-gray-200 hover:border-employee-blue/30 hover:bg-employee-blue/5 transition-all">
                  <Field
                    type="checkbox"
                    name="is_employee"
                    className="mt-0.5 w-3.5 h-3.5 text-employee-blue rounded border-gray-300 focus:ring-employee-blue"
                  />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-employee-blue" /> Employee
                    </p>
                    <p className="text-[11px] text-gray-500">Standard portal & self-service</p>
                  </div>
                </label>

                {/* Technician */}
                <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded border border-gray-200 hover:border-technician-green/30 hover:bg-technician-green/5 transition-all">
                  <Field
                    type="checkbox"
                    name="is_technician"
                    className="mt-0.5 w-3.5 h-3.5 text-technician-green rounded border-gray-300 focus:ring-technician-green"
                  />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5 text-technician-green" /> Technician
                    </p>
                    <p className="text-[11px] text-gray-500">Handles support tickets</p>
                  </div>
                </label>

                {/* Manager */}
                <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded border border-gray-200 hover:border-manager-orange/30 hover:bg-manager-orange/5 transition-all">
                  <Field
                    type="checkbox"
                    name="is_manager"
                    className="mt-0.5 w-3.5 h-3.5 text-manager-orange rounded border-gray-300 focus:ring-manager-orange"
                  />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-manager-orange" /> Manager
                    </p>
                    <p className="text-[11px] text-gray-500">Department oversight</p>
                  </div>
                </label>

                {/* Admin */}
                <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded border border-gray-200 hover:border-admin-purple/30 hover:bg-admin-purple/5 transition-all">
                  <Field
                    type="checkbox"
                    name="is_admin"
                    className="mt-0.5 w-3.5 h-3.5 text-admin-purple rounded border-gray-300 focus:ring-admin-purple"
                  />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-admin-purple" /> Admin
                    </p>
                    <p className="text-[11px] text-gray-500">Full system configuration</p>
                  </div>
                </label>

                {/* HOD */}
                <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded border border-gray-200 hover:border-primary-blue/30 hover:bg-primary-blue/5 transition-all">
                  <Field
                    type="checkbox"
                    name="is_hod"
                    className="mt-0.5 w-3.5 h-3.5 text-primary-blue rounded border-gray-300 focus:ring-primary-blue"
                  />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-primary-blue" /> HOD
                    </p>
                    <p className="text-[11px] text-gray-500">Head of department</p>
                  </div>
                </label>

                {/* HR */}
                <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded border border-gray-200 hover:border-staff-yellow/40 hover:bg-staff-yellow/5 transition-all">
                  <Field
                    type="checkbox"
                    name="is_hr"
                    className="mt-0.5 w-3.5 h-3.5 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                  />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-600" /> HR
                    </p>
                    <p className="text-[11px] text-gray-500">Human resources personnel</p>
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
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Create User"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

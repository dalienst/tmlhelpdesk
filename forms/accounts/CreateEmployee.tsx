"use client";

import { useCreateEmployee } from "@/hooks/accounts/actions";
import { useFetchUnits } from "@/hooks/units/actions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {
  Loader2,
  Shield,
  Briefcase,
  Settings,
  User,
  Building2,
  Users,
  Compass,
  Layers,
  Crown,
} from "lucide-react";

interface CreateEmployeeProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  payroll_no: Yup.string().required("Payroll number is required"),
  is_general_manager: Yup.boolean(),
  managed_unit: Yup.string().when("is_general_manager", {
    is: true,
    then: (schema) => schema.required("Please select the managed property/unit for the General Manager"),
    otherwise: (schema) => schema.nullable().notRequired(),
  }),
});

export default function CreateEmployee({ onSuccess, onCancel }: CreateEmployeeProps) {
  const { mutateAsync: createEmployee } = useCreateEmployee();
  const { data: units, isLoading: unitsLoading } = useFetchUnits();
  const activeUnits = units?.filter((u) => u.is_active) || [];

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
    is_group_manager: false,
    is_general_manager: false,
    is_director: false,
    managed_unit: "",
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Create Single User</h2>
        <p className="text-xs text-gray-500 mt-0.5">Add a new staff member and configure their roles, leadership status, and permissions.</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const payload = {
              ...values,
              managed_unit:
                values.is_general_manager && values.managed_unit
                  ? values.managed_unit
                  : null,
            };
            await createEmployee(payload);
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

            {/* Standard Roles & Permissions */}
            <div>
              <div className="flex items-center justify-between mb-2 border-b border-gray-100 pb-1.5">
                <h3 className="text-xs font-semibold text-gray-900">Standard Roles & Permissions</h3>
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
                    <p className="text-[11px] text-gray-500">Resolves support tickets</p>
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
                      <Briefcase className="w-3.5 h-3.5 text-manager-orange" /> Department Manager
                    </p>
                    <p className="text-[11px] text-gray-500">Department team oversight</p>
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
                <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded border border-gray-200 hover:border-amber-200 hover:bg-amber-50/40 transition-all">
                  <Field
                    type="checkbox"
                    name="is_hr"
                    className="mt-0.5 w-3.5 h-3.5 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                  />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-600" /> HR Personnel
                    </p>
                    <p className="text-[11px] text-gray-500">Human resources management</p>
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
                      <Shield className="w-3.5 h-3.5 text-admin-purple" /> Administrator
                    </p>
                    <p className="text-[11px] text-gray-500">Full system configuration</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Executive & Leadership Roles */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2 border-b border-gray-100 pb-1.5">
                <div>
                  <h3 className="text-xs font-semibold text-gray-900">Executive & Leadership Roles</h3>
                  <p className="text-[11px] text-gray-500">High-level governance, escalation hierarchy, and cross-branch operations.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Group Operations Manager */}
                <label className={`flex items-start gap-2.5 cursor-pointer p-2.5 rounded border transition-all ${
                  values.is_group_manager ? 'border-indigo-400 bg-indigo-50/50 shadow-xs' : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/20'
                }`}>
                  <Field
                    type="checkbox"
                    name="is_group_manager"
                    className="mt-0.5 w-3.5 h-3.5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" /> Group Manager
                    </p>
                    <p className="text-[11px] text-gray-500">Oversees functional groups across all units</p>
                  </div>
                </label>

                {/* Unit General Manager */}
                <label className={`flex items-start gap-2.5 cursor-pointer p-2.5 rounded border transition-all ${
                  values.is_general_manager ? 'border-teal-400 bg-teal-50/50 shadow-xs' : 'border-gray-200 hover:border-teal-200 hover:bg-teal-50/20'
                }`}>
                  <Field
                    type="checkbox"
                    name="is_general_manager"
                    className="mt-0.5 w-3.5 h-3.5 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                  />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-teal-600" /> General Manager
                    </p>
                    <p className="text-[11px] text-gray-500">Unit/Property-level executive oversight</p>
                  </div>
                </label>

                {/* Executive Director */}
                <label className={`flex items-start gap-2.5 cursor-pointer p-2.5 rounded border transition-all ${
                  values.is_director ? 'border-purple-400 bg-purple-50/50 shadow-xs' : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/20'
                }`}>
                  <Field
                    type="checkbox"
                    name="is_director"
                    className="mt-0.5 w-3.5 h-3.5 text-purple-700 rounded border-gray-300 focus:ring-purple-600"
                  />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-purple-700" /> Executive Director
                    </p>
                    <p className="text-[11px] text-gray-500">Corporate-wide executive governance</p>
                  </div>
                </label>
              </div>

              {/* Conditional Unit Selection for General Manager */}
              {values.is_general_manager && (
                <div className="mt-2.5 p-3 bg-teal-50/60 border border-teal-200 rounded animate-in fade-in duration-150">
                  <label htmlFor="managed_unit" className="text-xs font-semibold text-teal-950 block mb-1">
                    Assigned Property / Unit <span className="text-primary-red">*</span>
                  </label>
                  <Field
                    as="select"
                    id="managed_unit"
                    name="managed_unit"
                    className="w-full bg-white border border-teal-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded px-3 py-2 text-xs outline-none transition-all"
                  >
                    <option value="">
                      {unitsLoading ? "Loading units..." : "Select the property this General Manager oversees"}
                    </option>
                    {activeUnits.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.code}) {u.location ? `— ${u.location}` : ""}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="managed_unit" component="div" className="text-primary-red text-xs mt-1" />
                  <p className="text-[11px] text-teal-800/80 mt-1">
                    Tickets, escalations, and performance dashboards for this property will be under this General Manager's authority.
                  </p>
                </div>
              )}
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

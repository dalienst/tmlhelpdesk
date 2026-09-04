"use client";

import { useCreateEmployee } from "@/hooks/accounts/actions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

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

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Create Single User</h2>
        <p className="text-xs text-gray-500 mt-0.5">Add a new user to the system.</p>
      </div>

      <Formik
        initialValues={{ first_name: "", last_name: "", email: "", payroll_no: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await createEmployee(values);
            toast.success("User created successfully!");
            resetForm();
            onSuccess?.();
          } catch (error: any) {
            toast.error(error?.response?.data?.detail || "Failed to create user. Please try again.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="first_name" className="text-xs font-semibold text-gray-700">First Name</label>
                <Field
                  id="first_name"
                  name="first_name"
                  placeholder="e.g. Jane"
                  className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400"
                />
                <ErrorMessage name="first_name" component="div" className="text-primary-red text-xs mt-0.5" />
              </div>

              <div className="space-y-1">
                <label htmlFor="last_name" className="text-xs font-semibold text-gray-700">Last Name</label>
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
              <label htmlFor="email" className="text-xs font-semibold text-gray-700">Email Address</label>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="jane.doe@example.com"
                className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400"
              />
              <ErrorMessage name="email" component="div" className="text-primary-red text-xs mt-0.5" />
            </div>

            <div className="space-y-1">
              <label htmlFor="payroll_no" className="text-xs font-semibold text-gray-700">Payroll Number</label>
              <Field
                id="payroll_no"
                name="payroll_no"
                placeholder="e.g. PR-1002"
                className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400"
              />
              <ErrorMessage name="payroll_no" component="div" className="text-primary-red text-xs mt-0.5" />
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

"use client";

import { useCreateBulkEmployees } from "@/hooks/accounts/actions";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface CreateEmployeeBulkProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const employeeSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  payroll_no: Yup.string().required("Payroll NO is required"),
});

const validationSchema = Yup.object().shape({
  employees: Yup.array()
    .of(employeeSchema)
    .min(1, "At least one employee must be added")
    .max(15, "You can only add up to 15 employees at once"),
});

const emptyEmployee = { first_name: "", last_name: "", email: "", payroll_no: "" };

export default function CreateEmployeeBulk({ onSuccess, onCancel }: CreateEmployeeBulkProps) {
  const { mutateAsync: createBulkEmployees } = useCreateBulkEmployees();

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl text-textBold text-gray-900">Create Multiple Users</h2>
        <p className="text-sm text-gray-500 mt-1">Add up to 15 new users at once manually.</p>
      </div>

      <Formik
        initialValues={{ employees: [{ ...emptyEmployee }] }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await createBulkEmployees({ employees: values.employees });
            toast.success("Users created successfully!");
            resetForm();
            onSuccess?.();
          } catch (error: any) {
            toast.error(error?.response?.data?.detail || "Failed to create users. Please try again.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, isSubmitting }) => (
          <Form className="flex flex-col h-full max-h-[70vh]">
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              <FieldArray name="employees">
                {({ push, remove }) => (
                  <div className="space-y-6">
                    {values.employees.map((employee, index) => (
                      <div key={index} className="relative bg-gray-50 border border-gray-200 rounded-xl p-4 pt-5 group">
                        {values.employees.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary-red hover:border-primary-red transition-colors z-10"
                            title="Remove user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs text-textBold text-gray-700">First Name</label>
                            <Field
                              name={`employees.${index}.first_name`}
                              placeholder="First Name"
                              className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded-lg px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400"
                            />
                            <ErrorMessage name={`employees.${index}.first_name`} component="div" className="text-primary-red text-[11px] mt-1" />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs text-textBold text-gray-700">Last Name</label>
                            <Field
                              name={`employees.${index}.last_name`}
                              placeholder="Last Name"
                              className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded-lg px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400"
                            />
                            <ErrorMessage name={`employees.${index}.last_name`} component="div" className="text-primary-red text-[11px] mt-1" />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs text-textBold text-gray-700">Email</label>
                            <Field
                              name={`employees.${index}.email`}
                              type="email"
                              placeholder="Email Address"
                              className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded-lg px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400"
                            />
                            <ErrorMessage name={`employees.${index}.email`} component="div" className="text-primary-red text-[11px] mt-1" />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs text-textBold text-gray-700">Payroll Number</label>
                            <Field
                              name={`employees.${index}.payroll_no`}
                              placeholder="Payroll NO"
                              className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded-lg px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400"
                            />
                            <ErrorMessage name={`employees.${index}.payroll_no`} component="div" className="text-primary-red text-[11px] mt-1" />
                          </div>
                        </div>
                      </div>
                    ))}

                    {typeof ErrorMessage === 'function' && <ErrorMessage name="employees" component="div" className="text-primary-red text-sm" />}

                    {values.employees.length < 15 && (
                      <button
                        type="button"
                        onClick={() => push({ ...emptyEmployee })}
                        className="w-full py-3 border-2 border-dashed border-gray-300 hover:border-primary-blue text-gray-500 hover:text-primary-blue rounded-xl flex items-center justify-center gap-2 text-sm text-textBold transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add Another User
                      </button>
                    )}
                    {values.employees.length >= 15 && (
                      <p className="text-xs text-center text-manager-orange mt-2">Maximum limit of 15 users reached.</p>
                    )}
                  </div>
                )}
              </FieldArray>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4 shrink-0">
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
                className="bg-primary-blue hover:bg-primary-blue/95 text-white px-6 py-2.5 rounded-lg text-sm text-textBold transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[150px]"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : `Create ${values.employees.length} Users`}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
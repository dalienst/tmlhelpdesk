"use client";

import { useUpdateIssue, useDeleteIssue } from "@/hooks/issues/actions";
import { useFetchCategories } from "@/hooks/categories/actions";
import { useFetchEmployees } from "@/hooks/accounts/actions";
import { Issue } from "@/services/issues";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

interface UpdateIssueProps {
  issue: Issue;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  category: Yup.string().required("Category is required"),
  name: Yup.string().required("Issue/Service name is required"),
  code: Yup.string().required("Issue code is required"),
  description: Yup.string().nullable(),
  technician: Yup.string().nullable(),
  default_priority: Yup.string().required("Default priority is required"),
  sla_hours: Yup.number().min(1, "SLA must be at least 1 hour").required("SLA hours required"),
  requires_approval: Yup.boolean(),
  is_active: Yup.boolean(),
});

export default function UpdateIssue({
  issue,
  onSuccess,
  onCancel,
}: UpdateIssueProps) {
  const { mutateAsync: updateIssue } = useUpdateIssue();
  const { mutateAsync: deleteIssue } = useDeleteIssue();
  const { data: categories, isLoading: catsLoading } = useFetchCategories();
  const { data: employees, isLoading: employeesLoading } = useFetchEmployees();
  const [isDeleting, setIsDeleting] = useState(false);

  const activeCategories = categories?.filter((c) => c.is_active) || [];

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to deactivate this issue?")) return;
    setIsDeleting(true);
    try {
      await deleteIssue(issue.reference);
      toast.success("Issue deactivated successfully!");
      onSuccess?.();
    } catch {
      toast.error("Failed to deactivate issue.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Edit Issue & Assignee</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Modify settings or reassign technician for {issue.name}.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded border border-red-200 transition font-medium"
        >
          {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          Deactivate
        </button>
      </div>

      <Formik
        initialValues={{
          category: issue.category_name || issue.category,
          name: issue.name || "",
          code: issue.code || "",
          description: issue.description || "",
          technician: issue.technician_email || issue.technician || "",
          default_priority: issue.default_priority || "MEDIUM",
          sla_hours: issue.sla_hours || 24,
          requires_approval: issue.requires_approval ?? false,
          is_active: issue.is_active ?? true,
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const payload = {
              category: values.category,
              name: values.name,
              code: values.code,
              description: values.description || undefined,
              technician: values.technician || null,
              default_priority: values.default_priority as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
              sla_hours: Number(values.sla_hours),
              requires_approval: values.requires_approval,
              is_active: values.is_active,
            };
            await updateIssue({ reference: issue.reference, data: payload });
            toast.success("Issue updated successfully!");
            onSuccess?.();
          } catch (err: unknown) {
            const error = err as { response?: { data?: Record<string, string[]> } };
            if (error.response?.data) {
              const messages = Object.entries(error.response.data)
                .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
                .join("\n");
              toast.error(messages || "Failed to update issue");
            } else {
              toast.error("An unexpected error occurred while updating issue.");
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Parent Category <span className="text-red-500">*</span>
              </label>
              {catsLoading ? (
                <div className="flex items-center gap-2 py-2 text-xs text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading categories...
                </div>
              ) : (
                <Field
                  as="select"
                  name="category"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white"
                >
                  {activeCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name} ({cat.department_name})
                    </option>
                  ))}
                </Field>
              )}
              <ErrorMessage name="category" component="p" className="text-red-500 text-[11px] mt-0.5" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Issue / Request Name <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="name"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                />
                <ErrorMessage name="name" component="p" className="text-red-500 text-[11px] mt-0.5" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Issue Code <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="code"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 uppercase"
                />
                <ErrorMessage name="code" component="p" className="text-red-500 text-[11px] mt-0.5" />
              </div>
            </div>

            {/* Technician in charge! */}
            <div className="bg-red-50/50 p-3 rounded border border-red-100">
              <label className="block text-xs font-semibold text-gray-900 mb-1">
                Technician / Officer In Charge
              </label>
              <p className="text-[11px] text-gray-500 mb-2">
                Tickets for this issue automatically assign to this individual.
              </p>
              {employeesLoading ? (
                <div className="flex items-center gap-2 py-1 text-xs text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading staff...
                </div>
              ) : (
                <Field
                  as="select"
                  name="technician"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white"
                >
                  <option value="">No dedicated technician (routes to department HOD)</option>
                  {employees?.map((emp) => (
                    <option key={emp.id} value={emp.email}>
                      {emp.first_name} {emp.last_name} ({emp.payroll_no})
                    </option>
                  ))}
                </Field>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Default Priority
                </label>
                <Field
                  as="select"
                  name="default_priority"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </Field>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Expected SLA (Hours)
                </label>
                <Field
                  type="number"
                  name="sla_hours"
                  min={1}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Description & Instructions
              </label>
              <Field
                as="textarea"
                rows={2}
                name="description"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.is_active}
                  onChange={(e) => setFieldValue("is_active", e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-600 h-3.5 w-3.5"
                />
                Active
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.requires_approval}
                  onChange={(e) => setFieldValue("requires_approval", e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-600 h-3.5 w-3.5"
                />
                Requires Approval
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded transition font-medium"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs font-medium disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

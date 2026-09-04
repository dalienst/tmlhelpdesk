"use client";

import { useUpdateCategory, useDeleteCategory } from "@/hooks/categories/actions";
import { useFetchDepartments } from "@/hooks/departments/actions";
import { useFetchEmployees } from "@/hooks/accounts/actions";
import { Category } from "@/services/categories";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

interface UpdateCategoryProps {
  category: Category;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  department: Yup.string().required("Department is required"),
  name: Yup.string().required("Category name is required"),
  code: Yup.string().required("Category code is required"),
  description: Yup.string().nullable(),
  supervisor: Yup.string().nullable(),
  is_active: Yup.boolean(),
});

export default function UpdateCategory({
  category,
  onSuccess,
  onCancel,
}: UpdateCategoryProps) {
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const { mutateAsync: deleteCategory } = useDeleteCategory();
  const { data: departments, isLoading: deptsLoading } = useFetchDepartments();
  const { data: employees, isLoading: employeesLoading } = useFetchEmployees();
  const [isDeleting, setIsDeleting] = useState(false);

  const activeDepartments = departments?.filter((d) => d.is_active) || [];

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to deactivate this category?")) return;
    setIsDeleting(true);
    try {
      await deleteCategory(category.reference);
      toast.success("Category deactivated successfully!");
      onSuccess?.();
    } catch {
      toast.error("Failed to deactivate category.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Edit Category</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Modify settings for {category.name} ({category.code}).
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
          department: category.department_name || category.department,
          name: category.name || "",
          code: category.code || "",
          description: category.description || "",
          supervisor: category.supervisor || "",
          is_active: category.is_active ?? true,
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const payload = {
              department: values.department,
              name: values.name,
              code: values.code,
              description: values.description || undefined,
              supervisor: values.supervisor || null,
              is_active: values.is_active,
            };
            await updateCategory({ reference: category.reference, data: payload });
            toast.success("Category updated successfully!");
            onSuccess?.();
          } catch (err: unknown) {
            const error = err as { response?: { data?: Record<string, string[]> } };
            if (error.response?.data) {
              const messages = Object.entries(error.response.data)
                .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
                .join("\n");
              toast.error(messages || "Failed to update category");
            } else {
              toast.error("An unexpected error occurred while updating category.");
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
                Department <span className="text-red-500">*</span>
              </label>
              {deptsLoading ? (
                <div className="flex items-center gap-2 py-2 text-xs text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading departments...
                </div>
              ) : (
                <Field
                  as="select"
                  name="department"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white"
                >
                  {activeDepartments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name} ({dept.unit})
                    </option>
                  ))}
                </Field>
              )}
              <ErrorMessage name="department" component="p" className="text-red-500 text-[11px] mt-0.5" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
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
                  Category Code <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="code"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 uppercase"
                />
                <ErrorMessage name="code" component="p" className="text-red-500 text-[11px] mt-0.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category Lead / Supervisor (Optional)
              </label>
              {employeesLoading ? (
                <div className="flex items-center gap-2 py-2 text-xs text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading employees...
                </div>
              ) : (
                <Field
                  as="select"
                  name="supervisor"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white"
                >
                  <option value="">No specific lead (defaults to department HOD)</option>
                  {employees?.map((emp) => (
                    <option key={emp.id} value={emp.email}>
                      {emp.first_name} {emp.last_name} ({emp.payroll_no})
                    </option>
                  ))}
                </Field>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Description (Optional)
              </label>
              <Field
                as="textarea"
                rows={2}
                name="description"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.is_active}
                  onChange={(e) => setFieldValue("is_active", e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-600 h-3.5 w-3.5"
                />
                Active (available for tickets)
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

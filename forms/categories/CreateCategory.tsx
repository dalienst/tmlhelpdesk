"use client";

import { useCreateCategory } from "@/hooks/categories/actions";
import { useFetchGroups } from "@/hooks/groups/actions";
import { useFetchEmployees } from "@/hooks/accounts/actions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface CreateCategoryProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultGroup?: string;
}

const validationSchema = Yup.object({
  group: Yup.string().required("Choose the functional group that handles this category"),
  name: Yup.string().required("Category name is required"),
  code: Yup.string().required("Category code is required"),
  description: Yup.string().nullable(),
  supervisor: Yup.string().nullable(),
});

export default function CreateCategory({
  onSuccess,
  onCancel,
  defaultGroup,
}: CreateCategoryProps) {
  const { mutateAsync: createCategory } = useCreateCategory();
  const { data: groups, isLoading: groupsLoading } = useFetchGroups();
  const { data: employees, isLoading: employeesLoading } = useFetchEmployees();

  const activeGroups = groups?.filter((g) => g.is_active) || [];

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Create Service Category</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Create a category once for a functional group (e.g. &quot;POS &amp; Systems&quot; under ICT). Every unit&apos;s department in that group handles it, so you never repeat it per unit.
        </p>
      </div>

      <Formik
        initialValues={{
          group: defaultGroup || "",
          name: "",
          code: "",
          description: "",
          supervisor: "",
        }}
        enableReinitialize={false}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const payload = {
              group: values.group,
              name: values.name,
              code: values.code,
              description: values.description || undefined,
              supervisor: values.supervisor || null,
            };
            await createCategory(payload);
            toast.success("Category created successfully!");
            resetForm();
            onSuccess?.();
          } catch (err: unknown) {
            const error = err as { response?: { data?: Record<string, string[]> } };
            if (error.response?.data) {
              const messages = Object.entries(error.response.data)
                .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
                .join("\n");
              toast.error(messages || "Failed to create category");
            } else {
              toast.error("An unexpected error occurred while creating category.");
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Functional Group <span className="text-red-500">*</span>
              </label>
              {groupsLoading ? (
                <div className="flex items-center gap-2 py-2 text-xs text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading groups...
                </div>
              ) : (
                <Field
                  as="select"
                  name="group"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white"
                >
                  <option value="">Select Group</option>
                  {activeGroups.map((g) => (
                    <option key={g.id} value={g.reference}>
                      {g.name} ({g.code})
                    </option>
                  ))}
                </Field>
              )}
              <ErrorMessage name="group" component="p" className="text-red-500 text-[11px] mt-0.5" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="name"
                  placeholder="e.g., Payroll"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value;
                    setFieldValue("name", val);
                    if (!values.code) {
                      const autoCode = val
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "")
                        .slice(0, 8);
                      setFieldValue("code", autoCode);
                    }
                  }}
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
                  placeholder="e.g., FIN-PAY"
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
                  <option value="">No specific lead (each unit&apos;s department head handles it)</option>
                  {employees?.map((emp) => (
                    <option key={emp.id} value={emp.email}>
                      {emp.first_name} {emp.last_name} ({emp.email})
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
                placeholder="Scope of issues covered under this category..."
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
              />
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
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Creating...
                  </>
                ) : (
                  "Create Category"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

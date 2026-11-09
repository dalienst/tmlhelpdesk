"use client";

import { useUpdateGroup } from "@/hooks/groups/actions";
import { useFetchEmployees } from "@/hooks/accounts/actions";
import { Group } from "@/services/groups";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Loader2, Users2 } from "lucide-react";

interface UpdateGroupProps {
  group: Group;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Group name is required"),
  code: Yup.string().required("Group code is required"),
  description: Yup.string().nullable(),
  manager: Yup.string().nullable(),
  is_active: Yup.boolean().required(),
});

export default function UpdateGroup({ group, onSuccess, onCancel }: UpdateGroupProps) {
  const { mutateAsync: updateGroup } = useUpdateGroup();
  const { data: employees, isLoading: employeesLoading } = useFetchEmployees();
  const groupManagers = employees?.filter((emp) => emp.is_group_manager || emp.email === group.manager) || [];

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users2 className="w-5 h-5 text-primary-blue" />
          Edit Functional Group
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Update group leadership, status, or configuration for {group.name}.
        </p>
      </div>

      <Formik
        initialValues={{
          name: group.name || "",
          code: group.code || "",
          description: group.description || "",
          manager: group.manager || "",
          is_active: group.is_active ?? true,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await updateGroup({
              reference: group.reference,
              data: {
                name: values.name.trim(),
                code: values.code.trim().toUpperCase(),
                description: values.description?.trim() || undefined,
                manager: values.manager ? values.manager : null,
                is_active: values.is_active,
              },
            });
            toast.success("Functional group updated successfully");
            onSuccess?.();
          } catch (error: any) {
            const errorData = error.response?.data;
            const errorMsg = errorData
              ? typeof errorData === "object"
                ? Object.entries(errorData)
                    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
                    .join(" | ")
                : errorData
              : "Failed to update group. Please try again.";
            toast.error(errorMsg);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label htmlFor="name" className="text-xs font-semibold text-gray-700">
                  Group Name *
                </label>
                <Field
                  id="name"
                  name="name"
                  className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400"
                />
                <ErrorMessage name="name" component="div" className="text-primary-red text-xs mt-0.5" />
              </div>

              <div className="space-y-1">
                <label htmlFor="code" className="text-xs font-semibold text-gray-700">
                  Group Code *
                </label>
                <Field
                  id="code"
                  name="code"
                  className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 uppercase"
                />
                <ErrorMessage name="code" component="div" className="text-primary-red text-xs mt-0.5" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="manager" className="text-xs font-semibold text-gray-700">
                Group Manager / Head of Group
              </label>
              <Field
                as="select"
                id="manager"
                name="manager"
                className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded px-3 py-2 text-sm outline-none transition-all"
              >
                <option value="">None (Unassigned)</option>
                {employeesLoading ? (
                  <option disabled>Loading group managers...</option>
                ) : (
                  groupManagers.map((emp) => (
                    <option key={emp.id || emp.email} value={emp.email}>
                      {emp.first_name} {emp.last_name} ({emp.email})
                    </option>
                  ))
                )}
              </Field>

              {!employeesLoading && groupManagers.length === 0 && (
                <p className="text-[11px] text-amber-700 mt-1">
                  No users currently have the <strong>Group Manager</strong> role. Assign it via the User Directory.
                </p>
              )}
              <ErrorMessage name="manager" component="div" className="text-primary-red text-xs mt-0.5" />
            </div>

            <div className="space-y-1">
              <label htmlFor="description" className="text-xs font-semibold text-gray-700">
                Description / Strategic Scope
              </label>
              <Field
                as="textarea"
                rows={3}
                id="description"
                name="description"
                className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded px-3 py-2 text-sm outline-none transition-all resize-none"
              />
              <ErrorMessage name="description" component="div" className="text-primary-red text-xs mt-0.5" />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={values.is_active}
                onChange={(e) => setFieldValue("is_active", e.target.checked)}
                className="w-4 h-4 text-primary-blue rounded border-gray-300 focus:ring-primary-blue"
              />
              <label htmlFor="is_active" className="text-xs font-semibold text-gray-700 cursor-pointer">
                Group is Active
              </label>
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
                className="bg-primary-blue hover:bg-primary-blue/95 text-white px-5 py-2 rounded text-xs font-semibold transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[120px]"
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

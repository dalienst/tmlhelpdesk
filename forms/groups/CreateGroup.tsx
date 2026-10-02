"use client";

import { useCreateGroup } from "@/hooks/groups/actions";
import { useFetchEmployees } from "@/hooks/accounts/actions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Loader2, Users2, ShieldAlert } from "lucide-react";

interface CreateGroupProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Group name is required"),
  code: Yup.string().required("Group code is required"),
  description: Yup.string().nullable(),
  manager: Yup.string().nullable(),
});

export default function CreateGroup({ onSuccess, onCancel }: CreateGroupProps) {
  const { mutateAsync: createGroup } = useCreateGroup();
  const { data: employees, isLoading: employeesLoading } = useFetchEmployees();

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users2 className="w-5 h-5 text-primary-blue" />
          Create Functional Group
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Establish an organization-wide functional domain (e.g. Group IT, Group Maintenance) spanning all units.
        </p>
      </div>

      <Formik
        initialValues={{
          name: "",
          code: "",
          description: "",
          manager: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await createGroup({
              name: values.name.trim(),
              code: values.code.trim().toUpperCase(),
              description: values.description?.trim() || undefined,
              manager: values.manager ? values.manager : null,
            });
            toast.success("Functional group created successfully");
            onSuccess?.();
          } catch (error: any) {
            const errorData = error.response?.data;
            const errorMsg = errorData
              ? typeof errorData === "object"
                ? Object.entries(errorData)
                    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
                    .join(" | ")
                : errorData
              : "Failed to create group. Please check details and try again.";
            toast.error(errorMsg);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label htmlFor="name" className="text-xs font-semibold text-gray-700">
                  Group Name *
                </label>
                <Field
                  id="name"
                  name="name"
                  placeholder="e.g. Group Information Technology"
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
                  placeholder="e.g. GRP-IT, GRP-MAINT"
                  className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 uppercase"
                />
                <ErrorMessage name="code" component="div" className="text-primary-red text-xs mt-0.5" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="manager" className="text-xs font-semibold text-gray-700">
                Group Manager / Head of Group (Optional)
              </label>
              <Field
                as="select"
                id="manager"
                name="manager"
                className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded px-3 py-2 text-sm outline-none transition-all"
              >
                <option value="">None (Unassigned)</option>
                {employeesLoading ? (
                  <option disabled>Loading staff directory...</option>
                ) : (
                  employees?.map((emp) => (
                    <option key={emp.id || emp.email} value={emp.email}>
                      {emp.first_name} {emp.last_name} ({emp.email})
                    </option>
                  ))
                )}
              </Field>
              <p className="text-[11px] text-gray-400">
                The Group Manager gains oversight over all departments linked to this group across properties.
              </p>
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
                placeholder="Operational remit, policies, and cross-property responsibilities..."
                className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 resize-none"
              />
              <ErrorMessage name="description" component="div" className="text-primary-red text-xs mt-0.5" />
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
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Create Group"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

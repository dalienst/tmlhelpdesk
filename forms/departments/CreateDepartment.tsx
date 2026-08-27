"use client";

import { useCreateDepartment } from "@/hooks/departments/actions";
import { useFetchUnits } from "@/hooks/units/actions";
import { useFetchEmployees } from "@/hooks/accounts/actions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Loader2, Users } from "lucide-react";

interface CreateDepartmentProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultUnit?: string;
}

const validationSchema = Yup.object({
  unit: Yup.string().required("Unit is required"),
  name: Yup.string().required("Department name is required"),
  code: Yup.string().required("Department code is required"),
  description: Yup.string().nullable(),
  supervisor: Yup.string().nullable(),
  staff: Yup.array().of(Yup.string()),
});

export default function CreateDepartment({
  onSuccess,
  onCancel,
  defaultUnit,
}: CreateDepartmentProps) {
  const { mutateAsync: createDepartment } = useCreateDepartment();
  const { data: units, isLoading: unitsLoading } = useFetchUnits();
  const { data: employees, isLoading: employeesLoading } = useFetchEmployees();

  const activeUnits = units?.filter((u) => u.is_active) || [];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl text-textBold text-gray-900">Create New Department</h2>
        <p className="text-sm text-gray-500 mt-1">
          Add an operational department within a branch/unit.
        </p>
      </div>

      <Formik
        initialValues={{
          unit: defaultUnit || (activeUnits[0]?.name || ""),
          name: "",
          code: "",
          description: "",
          supervisor: "",
          staff: [] as string[],
        }}
        enableReinitialize={false}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const payload = {
              unit: values.unit,
              name: values.name,
              code: values.code,
              description: values.description || undefined,
              supervisor: values.supervisor || null,
              staff: values.staff,
            };
            await createDepartment(payload);
            toast.success("Department created successfully!");
            resetForm();
            onSuccess?.();
          } catch (error: any) {
            const errorData = error?.response?.data;
            const errorMsg = errorData
              ? typeof errorData === "object"
                ? Object.entries(errorData)
                    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : v}`)
                    .join(" | ")
                : errorData
              : "Failed to create department. Please try again.";
            toast.error(errorMsg);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="unit" className="text-sm text-textBold text-gray-700">
                  Parent Unit *
                </label>
                <Field
                  as="select"
                  id="unit"
                  name="unit"
                  className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded-lg px-3 py-2.5 text-sm outline-none transition-all"
                >
                  <option value="" disabled>
                    {unitsLoading ? "Loading units..." : "Select Unit"}
                  </option>
                  {activeUnits.map((unit) => (
                    <option key={unit.id || unit.name} value={unit.name}>
                      {unit.name} ({unit.code})
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="unit" component="div" className="text-primary-red text-xs mt-1" />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="code" className="text-sm text-textBold text-gray-700">
                  Department Code *
                </label>
                <Field
                  id="code"
                  name="code"
                  placeholder="e.g. IT-NRB, MAINT-MSA"
                  className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded-lg px-3 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 uppercase"
                />
                <ErrorMessage name="code" component="div" className="text-primary-red text-xs mt-1" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm text-textBold text-gray-700">
                Department Name *
              </label>
              <Field
                id="name"
                name="name"
                placeholder="e.g. Information Technology, Maintenance, Kitchen"
                className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded-lg px-3 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400"
              />
              <ErrorMessage name="name" component="div" className="text-primary-red text-xs mt-1" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="supervisor" className="text-sm text-textBold text-gray-700">
                Supervisor / Department Head (Optional)
              </label>
              <Field
                as="select"
                id="supervisor"
                name="supervisor"
                className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded-lg px-3 py-2.5 text-sm outline-none transition-all"
              >
                <option value="">None (Unassigned)</option>
                {employees?.map((emp) => (
                  <option key={emp.id || emp.email} value={emp.email}>
                    {emp.first_name} {emp.last_name} ({emp.email})
                  </option>
                ))}
              </Field>
              <ErrorMessage name="supervisor" component="div" className="text-primary-red text-xs mt-1" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="description" className="text-sm text-textBold text-gray-700">
                Description / Scope of Work
              </label>
              <Field
                as="textarea"
                rows={2}
                id="description"
                name="description"
                placeholder="Types of requests or operations handled by this department..."
                className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded-lg px-3 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 resize-none"
              />
              <ErrorMessage name="description" component="div" className="text-primary-red text-xs mt-1" />
            </div>

            {/* Staff Members Section */}
            <div className="space-y-2 pt-2">
              <label className="text-sm text-textBold text-gray-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary-blue" /> Assign Staff / Technicians
                </span>
                <span className="text-xs text-gray-400 font-normal">
                  {values.staff.length} selected
                </span>
              </label>

              <div className="max-h-36 overflow-y-auto border border-gray-200 rounded-xl p-3 bg-gray-50/50 space-y-2">
                {employeesLoading ? (
                  <p className="text-xs text-gray-400">Loading staff list...</p>
                ) : employees?.length === 0 ? (
                  <p className="text-xs text-gray-400">No employees found.</p>
                ) : (
                  employees?.map((emp) => {
                    const isSelected = values.staff.includes(emp.email);
                    return (
                      <label
                        key={emp.id || emp.email}
                        className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer text-xs transition-all ${
                          isSelected
                            ? "bg-primary-blue/10 border border-primary-blue/20 text-primary-blue font-semibold"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFieldValue("staff", [...values.staff, emp.email]);
                            } else {
                              setFieldValue(
                                "staff",
                                values.staff.filter((email) => email !== emp.email)
                              );
                            }
                          }}
                          className="w-3.5 h-3.5 text-primary-blue rounded border-gray-300 focus:ring-primary-blue"
                        />
                        <span className="truncate">
                          {emp.first_name} {emp.last_name}
                        </span>
                        <span className="text-[11px] text-gray-400 ml-auto truncate">
                          {emp.email}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
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
                className="bg-primary-blue hover:bg-primary-blue/95 text-white px-6 py-2.5 rounded-lg text-sm text-textBold transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[140px]"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Department"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

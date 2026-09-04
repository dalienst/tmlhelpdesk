"use client";

import { useState, useMemo } from "react";
import { useCreateTicket } from "@/hooks/tickets/actions";
import { useFetchDepartments } from "@/hooks/departments/actions";
import { useFetchCategories } from "@/hooks/categories/actions";
import { useFetchIssues } from "@/hooks/issues/actions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Loader2, ShieldCheck, Clock, UserCheck } from "lucide-react";

interface CreateTicketProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  department: Yup.string().required("Department is required"),
  category: Yup.string().required("Category is required"),
  issue: Yup.string().required("Issue / Request type is required"),
  subject: Yup.string().required("Subject is required"),
  description: Yup.string().required("Detailed description is required"),
  priority: Yup.string().required("Priority is required"),
});

export default function CreateTicket({ onSuccess, onCancel }: CreateTicketProps) {
  const { mutateAsync: createTicket } = useCreateTicket();
  const { data: departments, isLoading: deptsLoading } = useFetchDepartments();
  const { data: categories, isLoading: catsLoading } = useFetchCategories();
  const { data: issues, isLoading: issuesLoading } = useFetchIssues();

  const [selectedDept, setSelectedDept] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedIssueRef, setSelectedIssueRef] = useState("");

  // Filter categories by selected department
  const filteredCategories = useMemo(() => {
    if (!selectedDept || !categories) return [];
    return categories.filter(
      (c) =>
        c.is_active &&
        (c.department_name?.toLowerCase() === selectedDept.toLowerCase() ||
          c.department?.toLowerCase() === selectedDept.toLowerCase())
    );
  }, [selectedDept, categories]);

  // Filter issues by selected category
  const filteredIssues = useMemo(() => {
    if (!selectedCat || !issues) return [];
    return issues.filter(
      (i) =>
        i.is_active &&
        (i.category_name?.toLowerCase() === selectedCat.toLowerCase() ||
          i.category?.toLowerCase() === selectedCat.toLowerCase())
    );
  }, [selectedCat, issues]);

  // Selected issue details for live dispatch preview
  const currentIssue = useMemo(() => {
    if (!selectedIssueRef || !issues) return null;
    return issues.find((i) => i.name === selectedIssueRef || i.reference === selectedIssueRef);
  }, [selectedIssueRef, issues]);

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Raise a Request / Ticket</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Select the department and service. The ticket will be automatically dispatched to the technician in charge.
        </p>
      </div>

      <Formik
        initialValues={{
          department: "",
          category: "",
          issue: "",
          subject: "",
          description: "",
          priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const payload = {
              department: values.department,
              category: values.category,
              issue: values.issue,
              subject: values.subject,
              description: values.description,
              priority: values.priority,
            };
            await createTicket(payload);
            toast.success("Ticket submitted successfully! Assigned to technician.");
            resetForm();
            onSuccess?.();
          } catch (err: unknown) {
            const error = err as { response?: { data?: Record<string, string[]> } };
            if (error.response?.data) {
              const messages = Object.entries(error.response.data)
                .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
                .join("\n");
              toast.error(messages || "Failed to submit ticket");
            } else {
              toast.error("An unexpected error occurred while submitting ticket.");
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-4">
            {/* Step 1: Department */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                1. Target Department <span className="text-red-500">*</span>
              </label>
              {deptsLoading ? (
                <div className="flex items-center gap-2 py-2 text-xs text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading departments...
                </div>
              ) : (
                <Field
                  as="select"
                  name="department"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const dept = e.target.value;
                    setFieldValue("department", dept);
                    setSelectedDept(dept);
                    setFieldValue("category", "");
                    setSelectedCat("");
                    setFieldValue("issue", "");
                    setSelectedIssueRef("");
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white"
                >
                  <option value="">Select Department (e.g. Finance, IT, HR)</option>
                  {departments
                    ?.filter((d) => d.is_active)
                    .map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name} ({dept.unit})
                      </option>
                    ))}
                </Field>
              )}
              <ErrorMessage name="department" component="p" className="text-red-500 text-[11px] mt-0.5" />
            </div>

            {/* Step 2: Category (Cascading) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  2. Service Category <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="category"
                  disabled={!selectedDept || catsLoading}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const cat = e.target.value;
                    setFieldValue("category", cat);
                    setSelectedCat(cat);
                    setFieldValue("issue", "");
                    setSelectedIssueRef("");
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">
                    {!selectedDept ? "Select a department first" : "Select Category (e.g. Payroll)"}
                  </option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="p" className="text-red-500 text-[11px] mt-0.5" />
              </div>

              {/* Step 3: Issue (Cascading) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  3. Specific Issue / Request <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="issue"
                  disabled={!selectedCat || issuesLoading}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const issueName = e.target.value;
                    setFieldValue("issue", issueName);
                    setSelectedIssueRef(issueName);
                    const matching = issues?.find((i) => i.name === issueName);
                    if (matching) {
                      setFieldValue("priority", matching.default_priority || "MEDIUM");
                      if (!values.subject) {
                        setFieldValue("subject", matching.name);
                      }
                    }
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">
                    {!selectedCat ? "Select a category first" : "Select Request (e.g. P9 Form Request)"}
                  </option>
                  {filteredIssues.map((iss) => (
                    <option key={iss.id} value={iss.name}>
                      {iss.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="issue" component="p" className="text-red-500 text-[11px] mt-0.5" />
              </div>
            </div>

            {/* Intelligent Dispatch Preview Card */}
            {currentIssue && (
              <div className="bg-red-50/50 border border-red-100 rounded p-3 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-red-800 font-semibold">
                  <ShieldCheck className="h-4 w-4 text-red-600" />
                  <span>Automatic Technician Routing</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-700 pt-1">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-gray-400" />
                    <span>
                      In charge:{" "}
                      <strong className="text-gray-900">
                        {currentIssue.technician_name || "Department Supervisor"}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span>
                      SLA: <strong className="text-gray-900">{currentIssue.sla_hours} hrs</strong>
                    </span>
                  </div>
                  <div>
                    Priority: <strong className="text-gray-900">{currentIssue.default_priority}</strong>
                  </div>
                </div>
                {currentIssue.description && (
                  <p className="text-[11px] text-gray-500 pt-1 border-t border-red-100/60">
                    {currentIssue.description}
                  </p>
                )}
              </div>
            )}

            {/* Subject and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Subject / Summary <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="subject"
                  placeholder="e.g., P9 Form Request for Tax Year 2025"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                />
                <ErrorMessage name="subject" component="p" className="text-red-500 text-[11px] mt-0.5" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Priority
                </label>
                <Field
                  as="select"
                  name="priority"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </Field>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Detailed Information / Notes <span className="text-red-500">*</span>
              </label>
              <Field
                as="textarea"
                rows={3}
                name="description"
                placeholder="Provide all relevant details (e.g., Year, KRA PIN, staff number, room/location, or specific requirement)..."
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
              />
              <ErrorMessage name="description" component="p" className="text-red-500 text-[11px] mt-0.5" />
            </div>

            {/* Actions */}
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
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs font-medium disabled:opacity-50 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting...
                  </>
                ) : (
                  "Submit Ticket"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

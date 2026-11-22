"use client";

import { useState, useMemo } from "react";
import { useCreateTicket } from "@/hooks/tickets/actions";
import type { createTicket as CreateTicketPayload } from "@/services/tickets";
import { useFetchCategories } from "@/hooks/categories/actions";
import { useFetchIssues } from "@/hooks/issues/actions";
import { useFetchEmployees } from "@/hooks/accounts/actions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Clock, ShieldCheck } from "lucide-react";

interface CreateTicketProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Unit and department come from the requester's profile; the subject
// defaults to the issue name and the priority to the issue's default.
const validationSchema = Yup.object({
  category: Yup.string().required("Choose a service"),
  issue: Yup.string().required("Choose the issue"),
  description: Yup.string().required("Describe the problem"),
});

const selectClass =
  "w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white disabled:bg-gray-50 disabled:text-gray-400";

export default function CreateTicket({ onSuccess, onCancel }: CreateTicketProps) {
  const { mutateAsync: createTicket } = useCreateTicket();
  const { data: categories, isLoading: catsLoading } = useFetchCategories();
  const { data: issues, isLoading: issuesLoading } = useFetchIssues();
  const { data: employees } = useFetchEmployees();

  const [selectedCat, setSelectedCat] = useState("");
  const [selectedIssueRef, setSelectedIssueRef] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");

  const activeCategories = useMemo(
    () => (categories || []).filter((c) => c.is_active && c.group_reference),
    [categories]
  );
  const filteredIssues = useMemo(
    () => (issues || []).filter((i) => i.is_active && i.category_reference === selectedCat),
    [selectedCat, issues]
  );
  const currentIssue = useMemo(
    () => (issues || []).find((i) => i.reference === selectedIssueRef) || null,
    [selectedIssueRef, issues]
  );
  const requester = useMemo(
    () => (employees || []).find((e) => e.email === requesterEmail) || null,
    [requesterEmail, employees]
  );

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Raise a Request / Ticket</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Pick the service and issue. The ticket goes to the requester&apos;s unit team and the least-busy
          technician there.
        </p>
      </div>

      <Formik
        initialValues={{ requester: "", category: "", issue: "", subject: "", description: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const payload: Record<string, string> = {
              issue: values.issue,
              description: values.description,
            };
            if (values.subject.trim()) payload.subject = values.subject.trim();
            if (values.requester) payload.requester = values.requester;
            await createTicket(payload as unknown as CreateTicketPayload);
            toast.success("Ticket submitted and assigned.");
            resetForm();
            setSelectedCat("");
            setSelectedIssueRef("");
            setRequesterEmail("");
            onSuccess?.();
          } catch (err: unknown) {
            const error = err as { response?: { data?: Record<string, string[] | string> } };
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
        {({ isSubmitting, setFieldValue }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Raise for <span className="text-gray-400 font-normal">(leave empty for yourself)</span>
              </label>
              <Field
                as="select"
                name="requester"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setFieldValue("requester", e.target.value);
                  setRequesterEmail(e.target.value);
                }}
                className={selectClass}
              >
                <option value="">Myself</option>
                {(employees || [])
                  .filter((e) => e.is_active)
                  .map((e) => (
                    <option key={e.id} value={e.email}>
                      {e.first_name} {e.last_name}
                      {e.department_name ? ` (${e.department_name}${e.unit_name ? `, ${e.unit_name}` : ""})` : ""}
                    </option>
                  ))}
              </Field>
              {requester && !requester.unit && (
                <p className="text-amber-600 text-[11px] mt-1">
                  This person has no unit set, so the request cannot be routed. Set it under Staff &amp; Users first.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  1. Service <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="category"
                  disabled={catsLoading}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFieldValue("category", e.target.value);
                    setSelectedCat(e.target.value);
                    setFieldValue("issue", "");
                    setSelectedIssueRef("");
                  }}
                  className={selectClass}
                >
                  <option value="">{catsLoading ? "Loading..." : "Select a service"}</option>
                  {activeCategories.map((c) => (
                    <option key={c.id} value={c.reference}>
                      {c.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="p" className="text-red-500 text-[11px] mt-0.5" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  2. Issue <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="issue"
                  disabled={!selectedCat || issuesLoading}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFieldValue("issue", e.target.value);
                    setSelectedIssueRef(e.target.value);
                  }}
                  className={selectClass}
                >
                  <option value="">{!selectedCat ? "Select a service first" : "Select the issue"}</option>
                  {filteredIssues.map((i) => (
                    <option key={i.id} value={i.reference}>
                      {i.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="issue" component="p" className="text-red-500 text-[11px] mt-0.5" />
              </div>
            </div>

            {currentIssue && (
              <div className="flex flex-wrap gap-3 text-[11px] text-gray-600 bg-gray-50 border border-gray-100 rounded p-2.5">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {currentIssue.group_name || "Service team"}
                  {requester?.unit_name ? `, ${requester.unit_name}` : ""}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" /> {currentIssue.sla_hours}h SLA &middot;{" "}
                  {currentIssue.default_priority}
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                3. Describe the problem <span className="text-red-500">*</span>
              </label>
              <Field
                as="textarea"
                name="description"
                rows={4}
                placeholder="Where is it, what happened, and anything the technician should know"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 resize-none"
              />
              <ErrorMessage name="description" component="p" className="text-red-500 text-[11px] mt-0.5" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Short title <span className="text-gray-400 font-normal">(optional, defaults to the issue name)</span>
              </label>
              <Field
                type="text"
                name="subject"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded transition"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || (!!requester && !requester.unit)}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

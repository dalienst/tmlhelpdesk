"use client";

import { useUpdateDepartmentEscalationRule } from "@/hooks/escalations/actions";
import { EscalationRule } from "@/services/escalations";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Loader2, ShieldAlert, Clock, AlertTriangle, Mail } from "lucide-react";

interface ConfigureEscalationRuleProps {
  departmentReference: string;
  departmentName: string;
  initialRule?: EscalationRule | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  warning_threshold_pct: Yup.number()
    .min(10, "Minimum 10%")
    .max(99, "Maximum 99%")
    .required("Warning threshold is required"),
  auto_escalate_on_breach: Yup.boolean().required(),
  escalate_to_gm_after_hours: Yup.number()
    .min(0, "Must be positive")
    .max(168, "Max 168 hours (1 week)")
    .required("Hours required"),
  immediate_critical_alert: Yup.boolean().required(),
  notify_emails_str: Yup.string().nullable(),
});

export default function ConfigureEscalationRule({
  departmentReference,
  departmentName,
  initialRule,
  onSuccess,
  onCancel,
}: ConfigureEscalationRuleProps) {
  const { mutateAsync: updateRule } = useUpdateDepartmentEscalationRule();

  const currentEmails = initialRule?.notify_emails || "";

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-manager-orange" />
          Escalation Engine Settings
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure proactive SLA breach alerts and tiered escalation parameters for <span className="font-semibold text-gray-800">{departmentName}</span>.
        </p>
      </div>

      <Formik
        initialValues={{
          warning_threshold_pct: initialRule?.warning_threshold_pct ?? 75,
          auto_escalate_on_breach: initialRule?.auto_escalate_on_breach ?? true,
          escalate_to_gm_after_hours: initialRule?.escalate_to_gm_after_hours ?? 4,
          immediate_critical_alert: initialRule?.immediate_critical_alert ?? true,
          notify_emails_str: currentEmails,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const emailList = values.notify_emails_str
              ? values.notify_emails_str
                  .split(",")
                  .map((e) => e.trim())
                  .filter((e) => e.length > 0)
              : [];

            await updateRule({
              departmentRef: departmentReference,
              data: {
                warning_threshold_pct: Number(values.warning_threshold_pct),
                auto_escalate_on_breach: values.auto_escalate_on_breach,
                escalate_to_gm_after_hours: Number(values.escalate_to_gm_after_hours),
                immediate_critical_alert: values.immediate_critical_alert,
                notify_emails: values.notify_emails_str?.trim() || undefined,
              },
            });
            toast.success("Escalation rules updated successfully");
            onSuccess?.();
          } catch (error: any) {
            const errorMsg =
              error.response?.data?.error ||
              "Failed to update escalation rules. Please try again.";
            toast.error(errorMsg);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-4">
            {/* Warning Threshold */}
            <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/60 space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="warning_threshold_pct"
                  className="text-xs font-semibold text-gray-800 flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  SLA Warning Alert Threshold (%)
                </label>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  {values.warning_threshold_pct}% of SLA Elapsed
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Notifies assigned technicians and supervisor when a ticket reaches this fraction of resolution SLA before breaching.
              </p>
              <Field
                type="range"
                min="25"
                max="95"
                step="5"
                id="warning_threshold_pct"
                name="warning_threshold_pct"
                className="w-full accent-amber-600 cursor-pointer"
              />
              <ErrorMessage
                name="warning_threshold_pct"
                component="div"
                className="text-primary-red text-xs mt-0.5"
              />
            </div>

            {/* Auto Escalate on Breach */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                id="auto_escalate_on_breach"
                name="auto_escalate_on_breach"
                checked={values.auto_escalate_on_breach}
                onChange={(e) => setFieldValue("auto_escalate_on_breach", e.target.checked)}
                className="w-4 h-4 mt-0.5 text-primary-blue rounded border-gray-300 focus:ring-primary-blue"
              />
              <div>
                <label
                  htmlFor="auto_escalate_on_breach"
                  className="text-xs font-semibold text-gray-800 cursor-pointer block"
                >
                  Auto-Escalate to Department Head on Breach
                </label>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  When the SLA timer expires, immediately elevate ticket status to ESCALATED and notify the HOD.
                </p>
              </div>
            </div>

            {/* Escalate to GM After Hours */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1.5">
              <label
                htmlFor="escalate_to_gm_after_hours"
                className="text-xs font-semibold text-gray-800 flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-primary-blue" />
                Escalate to General Manager (Hours Unresolved After Breach)
              </label>
              <div className="flex items-center gap-2">
                <Field
                  type="number"
                  id="escalate_to_gm_after_hours"
                  name="escalate_to_gm_after_hours"
                  min="0"
                  max="168"
                  className="w-24 bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded px-3 py-1.5 text-sm outline-none"
                />
                <span className="text-xs text-gray-500">hours after SLA breach</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Set to 0 to disable automated General Manager notification.
              </p>
              <ErrorMessage
                name="escalate_to_gm_after_hours"
                component="div"
                className="text-primary-red text-xs mt-0.5"
              />
            </div>

            {/* Immediate Critical Alert */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                id="immediate_critical_alert"
                name="immediate_critical_alert"
                checked={values.immediate_critical_alert}
                onChange={(e) => setFieldValue("immediate_critical_alert", e.target.checked)}
                className="w-4 h-4 mt-0.5 text-primary-blue rounded border-gray-300 focus:ring-primary-blue"
              />
              <div>
                <label
                  htmlFor="immediate_critical_alert"
                  className="text-xs font-semibold text-gray-800 cursor-pointer block"
                >
                  Immediate High / Critical Priority Alert
                </label>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Sends instant notifications to the entire management chain whenever a Critical ticket is created.
                </p>
              </div>
            </div>

            {/* Additional Notification Emails */}
            <div className="space-y-1">
              <label
                htmlFor="notify_emails_str"
                className="text-xs font-semibold text-gray-800 flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-primary-blue" />
                Additional Notification Recipients (Optional)
              </label>
              <Field
                id="notify_emails_str"
                name="notify_emails_str"
                placeholder="manager.cc@tamarind.co.ke, supervisor2@tamarind.co.ke"
                className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded px-3 py-2 text-sm outline-none placeholder:text-gray-400"
              />
              <p className="text-[11px] text-gray-400">
                Comma-separated email addresses to receive all escalation digests.
              </p>
              <ErrorMessage
                name="notify_emails_str"
                component="div"
                className="text-primary-red text-xs mt-0.5"
              />
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
                className="bg-manager-orange hover:bg-manager-orange/95 text-white px-5 py-2 rounded text-xs font-semibold transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[130px]"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Save Escalation Rules"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

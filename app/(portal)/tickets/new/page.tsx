"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Ticket as TicketIcon,
  ShieldCheck,
  Clock,
  UserCheck,
  Building2,
  Layers,
  FolderTree,
  ListTree,
  AlertCircle,
  FileText,
  UploadCloud,
  CheckCircle2,
  X,
  HelpCircle,
  Loader2,
  Paperclip,
} from "lucide-react";
import { useCreateTicket } from "@/hooks/tickets/actions";
import { useCreateAttachment } from "@/hooks/attachments/actions";
import { primaryRole } from "@/lib/roles";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { useFetchCategories } from "@/hooks/categories/actions";
import { useFetchIssues } from "@/hooks/issues/actions";

// Minimal form: unit and department come from the requester's profile,
// subject defaults to the issue name and priority to the issue default.
const validationSchema = Yup.object({
  category: Yup.string().required("Choose a service"),
  issue: Yup.string().required("Choose the issue"),
  description: Yup.string().required("Tell us briefly what is wrong"),
});

export default function NewTicketPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { mutateAsync: createTicketMutation, isPending: isSubmitting } = useCreateTicket();
  const { mutateAsync: createAttachmentMutation } = useCreateAttachment();

  const { data: account, isLoading: accountLoading } = useFetchAccount();
  const { data: categories, isLoading: catsLoading } = useFetchCategories();
  const { data: issues, isLoading: issuesLoading } = useFetchIssues();

  const [selectedCat, setSelectedCat] = useState<string>("");
  const [selectedIssueRef, setSelectedIssueRef] = useState<string>("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const profileMissing = !accountLoading && !account?.unit;

  // One list of services for everyone; only categories linked to a group can be routed
  const activeCategories = useMemo(
    () => (categories || []).filter((c) => c.is_active && c.group_reference),
    [categories]
  );

  // Issues of the chosen category
  const filteredIssues = useMemo(() => {
    if (!selectedCat || !issues) return [];
    return issues.filter((i) => i.is_active && i.category_reference === selectedCat);
  }, [selectedCat, issues]);

  // Selected issue details for the preview panel
  const currentIssue = useMemo(() => {
    if (!selectedIssueRef || !issues) return null;
    return issues.find((i) => i.reference === selectedIssueRef) || null;
  }, [selectedIssueRef, issues]);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles = filesArray.filter((file) => {
        if (file.size > 15 * 1024 * 1024) {
          toast.error(`${file.name} exceeds maximum file size (15MB)`);
          return false;
        }
        return true;
      });
      setAttachedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const rolePrefix = primaryRole(session?.user);

  const handleSubmit = async (values: any) => {
    try {
      let uploadedFilesMeta: Array<{ url: string; name: string; size: number; type: string }> = [];

      // Step 1: Upload files to MinIO storage if any
      if (attachedFiles.length > 0) {
        const formData = new FormData();
        attachedFiles.forEach((file) => formData.append("files", file));

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData?.error || "Failed to upload attachments to MinIO storage");
        }

        const uploadJson = await uploadRes.json();
        uploadedFilesMeta = uploadJson.files || [];
      }

      // Step 2: Create ticket
      const payload: any = {
        issue: values.issue,
        description: values.description,
      };

      const newTicket = await createTicketMutation(payload);

      // Step 3: Create attachment records in backend for each uploaded file
      let failedAttachments = 0;
      if (uploadedFilesMeta.length > 0 && newTicket?.id) {
        for (const meta of uploadedFilesMeta) {
          try {
            await createAttachmentMutation({
              ticket: newTicket.id,
              file_url: meta.url,
              file_name: meta.name,
              file_size: meta.size,
              file_type: meta.type,
              attachment_type: "REQUEST_ATTACHMENT",
            });
          } catch (e) {
            failedAttachments += 1;
            console.error("Failed to link attachment:", e);
          }
        }
      }
      if (failedAttachments > 0) {
        toast.error(
          `${failedAttachments} attachment(s) could not be linked. You can re-attach them from the ticket page.`
        );
      }

      toast.success(
        `Ticket #${newTicket?.ticket_number || "created"} submitted successfully!`
      );

      // Redirect to the ticket workspace or role dashboard
      if (newTicket?.reference) {
        router.push(`/tickets/${newTicket.reference}`);
      } else {
        router.push(`/${rolePrefix}/dashboard`);
      }
    } catch (err: any) {
      toast.error(
        err?.message ||
          err?.response?.data?.detail ||
          "Failed to submit ticket. Please check your connection."
      );
    }
  };

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* Top Header & Breadcrumbs */}
      <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5 font-medium">
              <Link
                href={`/${rolePrefix}/dashboard`}
                className="hover:text-primary-blue flex items-center gap-1 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </Link>
              <span>/</span>
              <span className="text-gray-700">Tickets</span>
              <span>/</span>
              <span className="text-primary-blue font-semibold">New Request</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary-blue/10 flex items-center justify-center text-primary-blue">
                <TicketIcon className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                Raise a Support Request / Incident
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1 max-w-2xl">
              Pick the service and issue, then describe the problem. We route it to your unit&apos;s team and the least-busy technician picks it up.
            </p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
            <Formik
              initialValues={{
                category: "",
                issue: "",
                description: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue }) => (
                <Form className="space-y-5">
                  {/* Who this request is for: taken from the profile, never asked */}
                  <div
                    className={`flex items-start gap-2.5 p-3 rounded border text-xs ${
                      profileMissing
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-gray-50 border-gray-200 text-gray-700"
                    }`}
                  >
                    <Building2 className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                    {accountLoading ? (
                      <span>Loading your profile...</span>
                    ) : profileMissing ? (
                      <span>
                        Your profile has no unit set yet, so requests cannot be routed. Ask an administrator to set
                        your unit and department under Staff &amp; Users.
                      </span>
                    ) : (
                      <span>
                        Raising as <strong>{account?.first_name} {account?.last_name}</strong>
                        {account?.department_name ? `, ${account.department_name}` : ""} &middot;{" "}
                        <strong>{account?.unit_name}</strong>. It goes to your unit&apos;s team automatically.
                      </span>
                    )}
                  </div>

                  {/* Step 1: Category & Issue */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                        <FolderTree className="w-3.5 h-3.5 text-gray-400" />
                        1. What do you need help with? <span className="text-primary-red">*</span>
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
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition text-gray-800 disabled:bg-gray-50 disabled:text-gray-400"
                      >
                        <option value="">
                          {catsLoading ? "Loading categories..." : "Select a service (e.g. IT Support, Maintenance)"}
                        </option>
                        {activeCategories.map((c) => (
                          <option key={c.id} value={c.reference}>
                            {c.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="category" component="p" className="text-primary-red text-[11px] mt-1" />
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                        <ListTree className="w-3.5 h-3.5 text-gray-400" />
                        2. Which issue? <span className="text-primary-red">*</span>
                      </label>
                      <Field
                        as="select"
                        name="issue"
                        disabled={!selectedCat || issuesLoading}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          setFieldValue("issue", e.target.value);
                          setSelectedIssueRef(e.target.value);
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition text-gray-800 disabled:bg-gray-50 disabled:text-gray-400"
                      >
                        <option value="">
                          {!selectedCat
                            ? "Select a service first"
                            : issuesLoading
                              ? "Loading issues..."
                              : "Select the issue (e.g. POS Fault, AC Leak)"}
                        </option>
                        {filteredIssues.map((i) => (
                          <option key={i.id} value={i.reference}>
                            {i.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="issue" component="p" className="text-primary-red text-[11px] mt-1" />
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      3. Describe the problem <span className="text-primary-red">*</span>
                    </label>
                    <Field
                      as="textarea"
                      rows={5}
                      name="description"
                      placeholder="Where is it, what happened, and anything the technician should know (e.g. Bar station 2 till frozen since 10am)..."
                      className="w-full p-3 text-xs bg-white border border-gray-200 rounded outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition text-gray-800 leading-relaxed"
                    />
                    <ErrorMessage name="description" component="p" className="text-primary-red text-[11px] mt-1" />
                  </div>

                  {/* Attachments Section */}
                  <div className="pt-2 border-t border-gray-100">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Supporting Documents / Attachments <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <p className="text-[11px] text-gray-500 mb-3">
                      Attach photos of faulty equipment, error screenshots, diagnostic logs, invoices, or specifications (Max 15MB per file).
                    </p>

                    <div className="border-2 border-dashed border-gray-200 rounded p-5 text-center hover:border-primary-blue/50 hover:bg-gray-50/50 transition cursor-pointer relative">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center gap-1.5 text-gray-500">
                        <UploadCloud className="w-7 h-7 text-primary-blue" />
                        <p className="text-xs font-medium text-gray-700">
                          Click to browse or drag and drop files here
                        </p>
                        <p className="text-[10px] text-gray-400">
                          PDF, Word, Excel, PNG, JPG (up to 15MB each)
                        </p>
                      </div>
                    </div>

                    {/* Selected files preview */}
                    {attachedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-semibold text-gray-700">
                          Selected Files ({attachedFiles.length}):
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {attachedFiles.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-200 text-xs"
                            >
                              <div className="flex items-center gap-2 truncate pr-2">
                                <Paperclip className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span className="truncate font-medium text-gray-800">
                                  {file.name}
                                </span>
                                <span className="text-[10px] text-gray-400 shrink-0">
                                  ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(idx)}
                                className="text-gray-400 hover:text-primary-red p-1 transition"
                                title="Remove file"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Form Footer Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <Link
                      href={`/${rolePrefix}/dashboard`}
                      className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded transition"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting || profileMissing}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-primary-blue hover:bg-primary-blue/95 text-white rounded text-xs font-semibold transition shadow-sm disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Submitting Ticket...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Submit Support Ticket
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Right Column: Routing Intelligence & Guidelines (1 Col) */}
        <div className="space-y-4">
          {/* Live Dispatch Preview */}
          <div className="bg-white p-5 rounded border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-gray-900 border-b border-gray-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-semibold uppercase tracking-wider">
                Dispatch Intelligence
              </h2>
            </div>

            {currentIssue ? (
              <div className="space-y-3">
                <div className="p-3 rounded bg-emerald-50/50 border border-emerald-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-emerald-800">
                      Service Verified
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-emerald-700 border border-emerald-200 font-semibold">
                      {currentIssue.code}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-gray-900">{currentIssue.name}</p>
                  {currentIssue.description && (
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {currentIssue.description}
                    </p>
                  )}
                </div>

                {/* Routing & SLA metrics */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-technician-green" />
                      Handled by:
                    </span>
                    <span className="font-semibold text-gray-900 text-right">
                      {currentIssue.group_name || "Service team"}
                      {account?.unit_name ? `, ${account.unit_name}` : ""}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      Resolution SLA:
                    </span>
                    <span className="font-semibold text-primary-blue">
                      {currentIssue.sla_hours} Hours Turnaround
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded bg-gray-50 border border-gray-100">
                    <span className="text-gray-500">Default Priority:</span>
                    <span className="font-semibold text-gray-900">
                      {currentIssue.default_priority}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-gray-400 space-y-1.5">
                <TicketIcon className="w-8 h-8 mx-auto text-gray-300" />
                <p className="text-xs font-semibold text-gray-600">No Service Selected</p>
                <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                  Choose a service and issue to see who handles it and how fast.
                </p>
              </div>
            )}
          </div>

          {/* Resolution Tips */}
          <div className="bg-blue-50/40 p-5 rounded border border-blue-100 shadow-sm text-xs space-y-3">
            <div className="flex items-center gap-2 text-primary-blue font-semibold">
              <HelpCircle className="w-4 h-4" />
              <span>Guidelines for Faster Resolution</span>
            </div>
            <ul className="space-y-2 text-[11px] text-gray-600 leading-relaxed list-disc list-inside">
              <li>
                <strong>Purchasing / LPO Requests</strong>: Always attach the vendor's official quotation for the purchasing officer.
              </li>
              <li>
                <strong>Equipment / Maintenance</strong>: Specify the exact branch location, room number, or serial tag.
              </li>
              <li>
                <strong>System Issues</strong>: Include error screenshots or exact error messages encountered.
              </li>
            </ul>
            <div className="pt-2 border-t border-blue-100">
              <Link
                href="/guides"
                className="text-[11px] font-semibold text-primary-blue hover:underline inline-flex items-center gap-1"
              >
                Browse Knowledge Guides &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

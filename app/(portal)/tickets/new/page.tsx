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
import { useFetchUnits } from "@/hooks/units/actions";
import { useFetchDepartments } from "@/hooks/departments/actions";
import { useFetchCategories } from "@/hooks/categories/actions";
import { useFetchIssues } from "@/hooks/issues/actions";

const validationSchema = Yup.object({
  department: Yup.string().required("Department is required"),
  category: Yup.string().required("Category is required"),
  issue: Yup.string().required("Issue / Request type is required"),
  subject: Yup.string().required("Subject summary is required"),
  description: Yup.string().required("Detailed description is required"),
  priority: Yup.string().required("Priority is required"),
});

export default function NewTicketPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { mutateAsync: createTicketMutation, isPending: isSubmitting } = useCreateTicket();

  const { data: units, isLoading: unitsLoading } = useFetchUnits();
  const { data: departments, isLoading: deptsLoading } = useFetchDepartments();
  const { data: categories, isLoading: catsLoading } = useFetchCategories();
  const { data: issues, isLoading: issuesLoading } = useFetchIssues();

  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [selectedCat, setSelectedCat] = useState<string>("");
  const [selectedIssueName, setSelectedIssueName] = useState<string>("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Filter categories by selected department
  const filteredCategories = useMemo(() => {
    if (!selectedDept || !categories) return [];
    return categories.filter(
      (c) =>
        c.is_active &&
        (c.department_name?.toLowerCase() === selectedDept.toLowerCase() ||
          c.department?.toLowerCase() === selectedDept.toLowerCase() ||
          c.department_reference === selectedDept)
    );
  }, [selectedDept, categories]);

  // Filter issues by selected category
  const filteredIssues = useMemo(() => {
    if (!selectedCat || !issues) return [];
    return issues.filter(
      (i) =>
        i.is_active &&
        (i.category_name?.toLowerCase() === selectedCat.toLowerCase() ||
          i.category?.toLowerCase() === selectedCat.toLowerCase() ||
          i.category_reference === selectedCat)
    );
  }, [selectedCat, issues]);

  // Selected issue details for live dispatch preview
  const currentIssue = useMemo(() => {
    if (!selectedIssueName || !issues) return null;
    return issues.find(
      (i) => i.name === selectedIssueName || i.reference === selectedIssueName
    );
  }, [selectedIssueName, issues]);

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

  const rolePrefix = session?.user?.is_admin
    ? "admin"
    : session?.user?.is_technician
      ? "technician"
      : session?.user?.is_manager
        ? "manager"
        : "employee";

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
        unit: values.unit || undefined,
        department: values.department,
        category: values.category,
        issue: values.issue,
        subject: values.subject,
        description: values.description,
        priority: values.priority,
      };

      const newTicket = await createTicketMutation(payload);

      // Step 3: Create attachment records in backend for each uploaded file
      if (uploadedFilesMeta.length > 0 && newTicket?.id) {
        for (const meta of uploadedFilesMeta) {
          try {
            await fetch("/api/v1/attachments/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ticket: newTicket.id,
                file_url: meta.url,
                file_name: meta.name,
                file_size: meta.size,
                file_type: meta.type,
                attachment_type: "REQUEST_ATTACHMENT",
              }),
            });
          } catch (e) {
            console.error("Failed to link attachment:", e);
          }
        }
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
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
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
              Fill in the details below. Requests are automatically routed to the designated technician with SLA monitoring.
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
                unit: "",
                department: "",
                category: "",
                issue: "",
                subject: "",
                description: "",
                priority: "MEDIUM",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form className="space-y-5">
                  {/* Step 1: Unit & Department */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Unit / Branch */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        1. Branch / Unit <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <Field
                        as="select"
                        name="unit"
                        disabled={unitsLoading}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const unitVal = e.target.value;
                          setFieldValue("unit", unitVal);
                          setSelectedUnit(unitVal);
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition text-gray-800"
                      >
                        <option value="">Select Branch (or default)</option>
                        {units?.map((u) => (
                          <option key={u.id} value={u.name}>
                            {u.name} ({u.code})
                          </option>
                        ))}
                      </Field>
                    </div>

                    {/* Department */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                        <Layers className="w-3.5 h-3.5 text-gray-400" />
                        2. Target Department <span className="text-primary-red">*</span>
                      </label>
                      <Field
                        as="select"
                        name="department"
                        disabled={deptsLoading}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const dept = e.target.value;
                          setFieldValue("department", dept);
                          setSelectedDept(dept);
                          setFieldValue("category", "");
                          setSelectedCat("");
                          setFieldValue("issue", "");
                          setSelectedIssueName("");
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition text-gray-800"
                      >
                        <option value="">
                          {deptsLoading ? "Loading departments..." : "Select Department (e.g. IT, Purchasing)"}
                        </option>
                        {departments?.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name} ({d.code})
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="department" component="p" className="text-primary-red text-[11px] mt-1" />
                    </div>
                  </div>

                  {/* Step 2: Category & Issue */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                        <FolderTree className="w-3.5 h-3.5 text-gray-400" />
                        3. Service Category <span className="text-primary-red">*</span>
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
                          setSelectedIssueName("");
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition text-gray-800 disabled:bg-gray-50 disabled:text-gray-400"
                      >
                        <option value="">
                          {!selectedDept
                            ? "Select a department first"
                            : catsLoading
                              ? "Loading categories..."
                              : "Select Category (e.g. Procurement, Hardware)"}
                        </option>
                        {filteredCategories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="category" component="p" className="text-primary-red text-[11px] mt-1" />
                    </div>

                    {/* Specific Issue */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                        <ListTree className="w-3.5 h-3.5 text-gray-400" />
                        4. Specific Request / Issue <span className="text-primary-red">*</span>
                      </label>
                      <Field
                        as="select"
                        name="issue"
                        disabled={!selectedCat || issuesLoading}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const issName = e.target.value;
                          setFieldValue("issue", issName);
                          setSelectedIssueName(issName);
                          const matching = issues?.find((i) => i.name === issName);
                          if (matching) {
                            setFieldValue("priority", matching.default_priority || "MEDIUM");
                            if (!values.subject) {
                              setFieldValue("subject", matching.name);
                            }
                          }
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition text-gray-800 disabled:bg-gray-50 disabled:text-gray-400"
                      >
                        <option value="">
                          {!selectedCat
                            ? "Select a category first"
                            : issuesLoading
                              ? "Loading service types..."
                              : "Select Service Request (e.g. POS Fault, AC Leak, Uniform Request)"}
                        </option>
                        {filteredIssues.map((i) => (
                          <option key={i.id} value={i.name}>
                            {i.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="issue" component="p" className="text-primary-red text-[11px] mt-1" />
                    </div>
                  </div>

                  {/* Subject and Priority */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Subject / Summary <span className="text-primary-red">*</span>
                      </label>
                      <Field
                        type="text"
                        name="subject"
                        placeholder="e.g. POS terminal frozen at Bar Station 2, AC dripping in Room 204, or Uniform Replacement"
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition text-gray-800"
                      />
                      <ErrorMessage name="subject" component="p" className="text-primary-red text-[11px] mt-1" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Priority Level <span className="text-primary-red">*</span>
                      </label>
                      <Field
                        as="select"
                        name="priority"
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition text-gray-800 font-medium"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                      </Field>
                      <ErrorMessage name="priority" component="p" className="text-primary-red text-[11px] mt-1" />
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Detailed Description &amp; Specifications <span className="text-primary-red">*</span>
                    </label>
                    <Field
                      as="textarea"
                      rows={5}
                      name="description"
                      placeholder="Provide clear details (e.g. equipment location, station/room number, fault observed, steps to reproduce, or required items)..."
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
                      disabled={isSubmitting}
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
                      Assigned Handler:
                    </span>
                    <span className="font-semibold text-gray-900">
                      {currentIssue.technician_name || "Department Supervisor"}
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
                  Choose a department and specific request type to preview routing and target resolution SLA.
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

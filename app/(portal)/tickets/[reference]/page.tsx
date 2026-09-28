"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft,
  Ticket as TicketIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  XCircle,
  User,
  UserCheck,
  Building2,
  Layers,
  FolderTree,
  ListTree,
  Calendar,
  FileText,
  UploadCloud,
  Download,
  Paperclip,
  Share2,
  RefreshCw,
  Loader2,
  Send,
  Flag,
  ShieldAlert,
  ChevronDown,
} from "lucide-react";
import { useFetchTicket, useUpdateTicket } from "@/hooks/tickets/actions";
import { useFetchEmployees } from "@/hooks/accounts/actions";
import { useFetchAttachments } from "@/hooks/attachments/actions";
import toast from "react-hot-toast";

export default function TicketWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const reference = (params?.reference as string) || "";
  const { data: session } = useSession();

  const { data: ticket, isLoading, error, refetch, isFetching } = useFetchTicket(reference);
  const { mutateAsync: updateTicketMutation, isPending: isUpdating } = useUpdateTicket();
  const { data: staffMembers } = useFetchEmployees();
  const { data: attachmentsList, refetch: refetchAttachments } = useFetchAttachments(ticket?.reference);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);

  // Form edit states
  const [status, setStatus] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [resolutionNotes, setResolutionNotes] = useState<string>("");

  // Waiting Flow states
  const [pendingReason, setPendingReason] = useState<string>("WAITING_PARTS");
  const [pendingDetails, setPendingDetails] = useState<string>("");
  const [expectedResumeDate, setExpectedResumeDate] = useState<string>("");

  // Escalation Modal / Drawer state
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [escalationReason, setEscationReason] = useState("TECHNICAL_SCOPE");
  const [escalationNotes, setEscalationNotes] = useState("");
  const [isEscalating, setIsEscalating] = useState(false);

  // Sync state when ticket loads
  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status || "OPEN");
      setAssignedTo(ticket.assigned_to_email || "");
      setPriority(ticket.priority || "MEDIUM");
      setResolutionNotes(ticket.resolution_notes || "");
    }
  }, [ticket]);

  const isAdmin = Boolean(session?.user?.is_admin || session?.user?.is_superuser);
  const isManager = Boolean(session?.user?.is_manager);
  const isTechnician = Boolean(session?.user?.is_technician);
  const isEmployee = Boolean(session?.user?.is_employee);

  const rolePrefix = isAdmin
    ? "admin"
    : isTechnician
      ? "technician"
      : isManager
        ? "manager"
        : "employee";

  // Check if current user can manage lifecycle
  const canManage = isAdmin || isManager || isTechnician;
  // Check if current user can reassign
  const canReassign = isAdmin || isManager;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s?.toUpperCase()) {
      case "OPEN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            Open (Awaiting Action)
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            In Progress
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
            <Clock className="w-3.5 h-3.5 text-purple-500" />
            On Hold / Pending
          </span>
        );
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Resolved
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-gray-500" />
            Closed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 text-primary-red text-xs font-semibold border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-primary-red" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-gray-50 text-gray-700 text-xs font-semibold border border-gray-200">
            {s}
          </span>
        );
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p?.toUpperCase()) {
      case "CRITICAL":
        return (
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            CRITICAL PRIORITY
          </span>
        );
      case "HIGH":
        return (
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
            HIGH PRIORITY
          </span>
        );
      case "MEDIUM":
        return (
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            MEDIUM PRIORITY
          </span>
        );
      case "LOW":
      default:
        return (
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            LOW PRIORITY
          </span>
        );
    }
  };

  // Save lifecycle updates
  const handleSaveLifecycle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket) return;

    try {
      let finalResolutionNotes = resolutionNotes;
      if (status === "PENDING") {
        const pendingNote = `[HOLD REASON]: ${pendingReason} - ${pendingDetails || "No additional remarks"} ${
          expectedResumeDate ? `(Expected Resume: ${expectedResumeDate})` : ""
        }`;
        finalResolutionNotes = finalResolutionNotes
          ? `${finalResolutionNotes}

${pendingNote}`
          : pendingNote;
      }

      await updateTicketMutation({
        reference: ticket.reference,
        data: {
          status: status as any,
          assigned_to: canReassign ? (assignedTo ? assignedTo : null) : undefined,
          priority: priority as any,
          resolution_notes: finalResolutionNotes || undefined,
        },
      });

      await refetch();
      toast.success("Ticket lifecycle updated successfully!");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail || "Failed to update ticket. Please try again."
      );
    }
  };

  // Handle manual escalation by technician or manager
  const handleTriggerEscalation = async () => {
    if (!ticket) return;
    setIsEscalating(true);
    try {
      const escalationNote = `[ESCALATION INITIATED by ${session?.user?.name || "Staff"}]: Reason: ${escalationReason}. Details: ${
        escalationNotes || "Immediate supervisor intervention requested."
      }`;
      const updatedNotes = ticket.resolution_notes
        ? `${ticket.resolution_notes}

${escalationNote}`
        : escalationNote;

      await updateTicketMutation({
        reference: ticket.reference,
        data: {
          priority: "CRITICAL",
          resolution_notes: updatedNotes,
        },
      });

      await refetch();
      setIsEscalateModalOpen(false);
      toast.success("Ticket has been escalated to Department Management!");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail || "Failed to escalate ticket. Please try again."
      );
    } finally {
      setIsEscalating(false);
    }
  };

  const handleUploadFulfillment = async (e: React.ChangeEvent<HTMLInputElement>, attachmentType: "FULFILLMENT_ATTACHMENT" | "REQUEST_ATTACHMENT" = "FULFILLMENT_ATTACHMENT") => {
    const file = e.target.files?.[0];
    if (!file || !ticket) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error("File exceeds maximum allowed size (15MB)");
      return;
    }

    setIsUploadingAttachment(true);
    const toastId = toast.loading(`Uploading ${file.name} to MinIO storage...`);

    try {
      const formData = new FormData();
      formData.append("files", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({}));
        throw new Error(errData?.error || "Failed to upload file to MinIO");
      }

      const uploadJson = await uploadRes.json();
      const uploadedFile = uploadJson.files?.[0];

      if (!uploadedFile) throw new Error("Upload did not return file details");

      // Save attachment in backend
      await fetch("/api/v1/attachments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket: ticket.id,
          file_url: uploadedFile.url,
          file_name: uploadedFile.name,
          file_size: uploadedFile.size,
          file_type: uploadedFile.type,
          attachment_type: attachmentType,
        }),
      });

      await refetchAttachments();
      await refetch();
      toast.success(`${attachmentType === "FULFILLMENT_ATTACHMENT" ? "Fulfillment document / LPO" : "File"} attached successfully!`, { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || "Failed to attach file. Please try again.", { id: toastId });
    } finally {
      setIsUploadingAttachment(false);
      e.target.value = "";
    }
  };

  const copyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Ticket link copied to clipboard!");
    }
  };

  // Staff members for assignment
  const assignableStaff = staffMembers?.filter(
    (u) => u.is_technician || u.is_manager || u.is_admin || u.is_staff
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary-blue" />
        <p className="text-xs font-semibold text-gray-700">Loading ticket workspace...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <XCircle className="w-10 h-10 text-primary-red mx-auto" />
        <h2 className="text-base font-semibold text-gray-900">Ticket Not Found</h2>
        <p className="text-xs text-gray-500">
          The requested ticket does not exist or you do not have permission to view it.
        </p>
        <Link
          href={`/${rolePrefix}/dashboard`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-blue text-white rounded text-xs font-semibold transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5 font-medium">
              <Link
                href={`/${rolePrefix}/dashboard`}
                className="hover:text-primary-blue flex items-center gap-1 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Queue
              </Link>
              <span>/</span>
              <span className="text-gray-700">Tickets</span>
              <span>/</span>
              <span className="font-mono text-primary-red font-semibold">
                {ticket.ticket_number}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs text-primary-red font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                {ticket.ticket_number}
              </span>
              <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                {ticket.subject}
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Created {formatDate(ticket.created_at)} • Target SLA: {ticket.sla_hours} Hours Turnaround
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={copyShareLink}
              className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded border border-gray-200 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              title="Copy Ticket URL"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded border border-gray-200 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              title="Refresh Ticket Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Technician / Manager Escalation button */}
            {canManage && (
              <button
                onClick={() => setIsEscalateModalOpen(true)}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-primary-red border border-red-200 rounded text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Escalate</span>
              </button>
            )}
          </div>
        </div>

        {/* Badges Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-xs">
          <div>{getStatusBadge(ticket.status)}</div>
          <div>{getPriorityBadge(ticket.priority)}</div>

          {ticket.unit_name && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-50 border border-gray-200 text-gray-600 text-[11px] font-medium">
              <Building2 className="w-3 h-3 text-gray-400" />
              {ticket.unit_name}
            </span>
          )}
          {ticket.department_name && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-50 border border-gray-200 text-gray-600 text-[11px] font-medium">
              <Layers className="w-3 h-3 text-gray-400" />
              {ticket.department_name}
            </span>
          )}
          {ticket.category_name && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-50 border border-gray-200 text-gray-600 text-[11px] font-medium">
              <FolderTree className="w-3 h-3 text-gray-400" />
              {ticket.category_name}
            </span>
          )}
          {ticket.issue_name && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-medium">
              <ListTree className="w-3 h-3 text-blue-500" />
              {ticket.issue_name}
            </span>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Communication (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Requester Profile Summary */}
          <div className="bg-white p-5 rounded border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary-blue" /> Requester Profile
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded bg-blue-50/40 border border-blue-100 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-primary-blue/10 text-primary-blue flex items-center justify-center font-bold text-sm shrink-0">
                  {ticket.requester_name ? ticket.requester_name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {ticket.requester_name || ticket.requester}
                  </p>
                  <p className="text-xs text-gray-500">{ticket.requester_email}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {ticket.requester_payroll_no && (
                  <span className="font-mono text-xs font-semibold px-2 py-1 bg-white border border-blue-200 rounded text-gray-700">
                    Payroll ID: {ticket.requester_payroll_no}
                  </span>
                )}
                {ticket.unit_name && (
                  <span className="text-xs font-medium px-2 py-1 bg-white border border-blue-200 rounded text-gray-700">
                    {ticket.unit_name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="bg-white p-5 rounded border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-gray-400" /> Request Details &amp; Specifications
            </h2>
            <div className="p-4 bg-gray-50 rounded border border-gray-200 text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </div>
          </div>

          {/* Two-Way Document & Fulfillment Hub */}
          <div className="bg-white p-5 rounded border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-primary-blue" /> Two-Way Attachments &amp; Deliverables
                </h2>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Requesters attach quotations &amp; specs; technicians and purchasing officers attach generated LPOs and proof of service.
                </p>
              </div>
            </div>

            {/* List of Attachments */}
            {attachmentsList && attachmentsList.length > 0 ? (
              <div className="space-y-3">
                {/* 1. Requester Supporting Documents (e.g. Quotations, Invoices) */}
                {attachmentsList.filter(a => a.attachment_type === "REQUEST_ATTACHMENT").length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">
                      Requester Supporting Documents (Quotations / Specs)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {attachmentsList
                        .filter((a) => a.attachment_type === "REQUEST_ATTACHMENT")
                        .map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center justify-between p-3 rounded bg-gray-50 border border-gray-200 text-xs"
                          >
                            <div className="flex items-center gap-2 truncate pr-2">
                              <FileText className="w-4 h-4 text-primary-blue shrink-0" />
                              <div className="truncate">
                                <p className="font-semibold text-gray-900 truncate">{att.file_name}</p>
                                <p className="text-[10px] text-gray-400">
                                  {(att.file_size / (1024 * 1024)).toFixed(2)} MB • {formatDate(att.created_at)}
                                </p>
                              </div>
                            </div>
                            <a
                              href={att.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 rounded text-xs font-semibold text-primary-blue hover:bg-primary-blue/5 transition shrink-0"
                            >
                              <Download className="w-3 h-3" /> Download
                            </a>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* 2. Fulfillment Documents (e.g. Generated LPO, Receipt, Work Evidence) */}
                {attachmentsList.filter(a => a.attachment_type === "FULFILLMENT_ATTACHMENT").length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Fulfillment Deliverables (Generated LPO / Completion Proof)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {attachmentsList
                        .filter((a) => a.attachment_type === "FULFILLMENT_ATTACHMENT")
                        .map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center justify-between p-3 rounded bg-emerald-50/50 border border-emerald-200 text-xs"
                          >
                            <div className="flex items-center gap-2 truncate pr-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div className="truncate">
                                <p className="font-semibold text-gray-900 truncate">{att.file_name}</p>
                                <p className="text-[10px] text-emerald-700">
                                  {(att.file_size / (1024 * 1024)).toFixed(2)} MB • Uploaded by {att.uploaded_by_name || "Purchasing / Tech"}
                                </p>
                              </div>
                            </div>
                            <a
                              href={att.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-emerald-300 rounded text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition shrink-0"
                            >
                              <Download className="w-3 h-3" /> Download LPO
                            </a>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center text-gray-400 text-xs">
                No attachments uploaded for this ticket yet.
              </div>
            )}

            {/* Upload Zone for Fulfillment Document */}
            {canManage && (
              <div className="p-4 rounded border border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center text-center gap-2 pt-3">
                <UploadCloud className="w-7 h-7 text-primary-blue" />
                <p className="text-xs font-semibold text-gray-800">
                  Upload Fulfillment Document / Generated LPO
                </p>
                <p className="text-[10px] text-gray-400">
                  Stored directly on Tamarind MinIO Object Storage (media.tamarind.co.ke / tml-helpdesk)
                </p>
                <label className="mt-1 inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary-blue hover:bg-primary-blue/95 text-white rounded text-xs font-semibold cursor-pointer transition shadow-sm">
                  {isUploadingAttachment ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading to MinIO...
                    </>
                  ) : (
                    <>
                      <Paperclip className="w-3.5 h-3.5" /> Attach LPO / Document
                    </>
                  )}
                  <input
                    type="file"
                    disabled={isUploadingAttachment}
                    className="hidden"
                    onChange={(e) => handleUploadFulfillment(e, "FULFILLMENT_ATTACHMENT")}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Resolution Feedback & Timeline */}
          {ticket.resolution_notes && (
            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm space-y-3">
              <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resolution Notes &amp; Activity Log
              </h2>
              <div className="p-4 bg-emerald-50/30 rounded border border-emerald-100 text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
                {ticket.resolution_notes}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Operational Controls & SLA (1 Col) */}
        <div className="space-y-4">
          {/* Lifecycle Action Card */}
          {canManage ? (
            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Ticket Lifecycle Controls
                </h2>
                <span className="text-[10px] font-semibold text-gray-500 uppercase">
                  {isManager ? "Manager" : isAdmin ? "Admin" : "Technician"} Mode
                </span>
              </div>

              <form onSubmit={handleSaveLifecycle} className="space-y-3.5">
                {/* Status selector */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Lifecycle Status <span className="text-primary-red">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition font-medium"
                  >
                    <option value="OPEN">Open (Awaiting triage / assignment)</option>
                    <option value="IN_PROGRESS">In Progress (Active resolution)</option>
                    <option value="PENDING">Pending (On hold / Waiting for parts/user)</option>
                    <option value="RESOLVED">Resolved (Service delivered)</option>
                    <option value="CLOSED">Closed (Archived)</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                {/* Waiting Flow expandable form */}
                {status === "PENDING" && (
                  <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded space-y-2.5 text-xs animate-in fade-in">
                    <div className="flex items-center gap-1.5 text-purple-800 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                      <span>Waiting Flow Details</span>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                        Reason for Hold:
                      </label>
                      <select
                        value={pendingReason}
                        onChange={(e) => setPendingReason(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-purple-200 rounded text-xs outline-none focus:border-purple-600"
                      >
                        <option value="WAITING_PARTS">Waiting for Spare Parts / Delivery</option>
                        <option value="WAITING_USER">Awaiting Requester Feedback</option>
                        <option value="WAITING_VENDOR">Awaiting Third-Party Vendor Service</option>
                        <option value="WAITING_APPROVAL">Awaiting Budget / Financial Sign-off</option>
                        <option value="SCHEDULED_WINDOW">Scheduled for Future Maintenance</option>
                        <option value="OTHER">Custom Reason (Specify below)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                        Custom Staff Remarks:
                      </label>
                      <input
                        type="text"
                        value={pendingDetails}
                        onChange={(e) => setPendingDetails(e.target.value)}
                        placeholder="e.g. Supplier awaiting shipment from Mombasa hub..."
                        className="w-full px-2.5 py-1.5 bg-white border border-purple-200 rounded text-xs outline-none focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                        Expected Resumption Date:
                      </label>
                      <input
                        type="date"
                        value={expectedResumeDate}
                        onChange={(e) => setExpectedResumeDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-purple-200 rounded text-xs outline-none focus:border-purple-600"
                      />
                    </div>
                    <p className="text-[10px] text-purple-700 italic">
                      * SLA clock is paused during hold periods.
                    </p>
                  </div>
                )}

                {/* Technician Reassignment (Only Manager & Admin) */}
                {canReassign && (
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Assigned Technician
                    </label>
                    <select
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition font-medium"
                    >
                      <option value="">Unassigned (Department Pool)</option>
                      {assignableStaff?.map((s) => (
                        <option key={s.id} value={s.email}>
                          {s.first_name} {s.last_name} ({s.is_technician ? "Technician" : s.is_manager ? "Manager" : "Staff"})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Priority Adjuster */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition font-medium"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                {/* Resolution Notes / Staff Feedback */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Resolution / Troubleshooting Notes
                  </label>
                  <textarea
                    rows={4}
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Provide troubleshooting findings, technician remarks, or resolution instructions..."
                    className="w-full p-2.5 bg-white border border-gray-300 rounded text-xs outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-primary-blue hover:bg-primary-blue/95 text-white py-2 rounded text-xs font-semibold transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-70"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving Changes...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Save Lifecycle Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm space-y-3">
              <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Ticket Status Overview
              </h2>
              <div className="p-3 bg-gray-50 rounded border border-gray-100 text-xs space-y-2">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Current State</span>
                  <div className="mt-1">{getStatusBadge(ticket.status)}</div>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Priority</span>
                  <div className="mt-1">{getPriorityBadge(ticket.priority)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Assigned Technician & SLA Target Card */}
          <div className="bg-white p-5 rounded border border-gray-200 shadow-sm space-y-3 text-xs">
            <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-technician-green" /> Service Delivery Handler
            </h2>

            <div className="space-y-2">
              <div className="p-3 rounded bg-emerald-50/50 border border-emerald-100">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block">
                  Assigned Technician
                </span>
                <p className="font-semibold text-gray-900 mt-0.5">
                  {ticket.assigned_to_name || "Unassigned (Department Pool)"}
                </p>
                {ticket.assigned_to_email && (
                  <p className="text-[11px] text-gray-500">{ticket.assigned_to_email}</p>
                )}
              </div>

              <div className="p-3 rounded bg-blue-50/50 border border-blue-100">
                <span className="text-[10px] text-blue-800 font-bold uppercase block">
                  Target Resolution SLA
                </span>
                <p className="font-semibold text-primary-blue mt-0.5">
                  {ticket.sla_hours} Hours Turnaround
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Escalation Modal */}
      {isEscalateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-red-50/50">
              <div className="flex items-center gap-2 text-primary-red font-semibold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>Escalate Ticket to Management</span>
              </div>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <p className="text-gray-600">
                Escalating this ticket will flag it as <strong>CRITICAL</strong>, alert the Department Manager / HOD, and trigger immediate review.
              </p>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Reason for Escalation <span className="text-primary-red">*</span>
                </label>
                <select
                  value={escalationReason}
                  onChange={(e) => setEscationReason(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs outline-none focus:border-primary-red"
                >
                  <option value="TECHNICAL_SCOPE">Exceeds Technical Scope / Specialist Required</option>
                  <option value="BUDGET_APPROVAL">Requires Management Sign-Off / Budget Exceeded</option>
                  <option value="VENDOR_DISPUTE">Vendor Delay / Supplier Impasse</option>
                  <option value="SLA_BREACH_RISK">High Risk of Severe SLA Breach</option>
                  <option value="CRITICAL_OUTAGE">Critical Operational Service Outage</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Context &amp; Escalation Notes <span className="text-primary-red">*</span>
                </label>
                <textarea
                  rows={3}
                  value={escalationNotes}
                  onChange={(e) => setEscalationNotes(e.target.value)}
                  placeholder="Explain why supervisor intervention is required..."
                  className="w-full p-2.5 bg-white border border-gray-300 rounded text-xs outline-none focus:border-primary-red"
                />
              </div>
            </div>

            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsEscalateModalOpen(false)}
                disabled={isEscalating}
                className="px-3.5 py-1.5 rounded text-xs font-semibold text-gray-600 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTriggerEscalation}
                disabled={isEscalating}
                className="bg-primary-red hover:bg-primary-red/90 text-white px-4 py-1.5 rounded text-xs font-semibold transition shadow-sm flex items-center gap-1.5 disabled:opacity-70"
              >
                {isEscalating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Confirm Escalation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

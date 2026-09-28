"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  HelpCircle,
  Search,
  BookOpen,
  User,
  Wrench,
  Briefcase,
  Shield,
  CheckCircle2,
  Clock,
  Paperclip,
  Flag,
  ArrowRight,
  PlusCircle,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function GuidesHelpPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"universal" | "technician" | "manager" | "admin">("universal");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const isAdmin = Boolean(session?.user?.is_admin || session?.user?.is_superuser);
  const isManager = Boolean(session?.user?.is_manager);
  const isTechnician = Boolean(session?.user?.is_technician);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const universalGuides = [
    {
      title: "Raising a Support Request or Incident",
      icon: PlusCircle,
      description: "How to properly submit requests to IT, Purchasing, Maintenance, or HR.",
      steps: [
        "Click on '+ Raise Request' in the top navigation bar or from your employee dashboard.",
        "Select your Branch/Unit (optional) and the Target Department (e.g., Purchasing, IT).",
        "Choose the Service Category and specific Issue Type. Notice the live SLA turnaround target displayed on the right.",
        "Enter a descriptive subject summary and detailed instructions (including room numbers, serials, or staff IDs).",
        "If you are requesting an LPO from Purchasing, attach the official vendor quotation PDF under Supporting Documents.",
        "Click 'Submit Support Ticket'. You will receive an email confirmation with your unique ticket reference (e.g., TML-PUR-2026-0001).",
      ],
    },
    {
      title: "Understanding Ticket Statuses & Lifecycles",
      icon: Clock,
      description: "What each status means and how your request progresses.",
      steps: [
        "OPEN: Your ticket has been received and is waiting for technician triage or initial review.",
        "IN PROGRESS: A designated technician has accepted the ticket and is actively working on fulfillment or troubleshooting.",
        "PENDING (ON HOLD): Work is temporarily paused due to external factors (e.g., waiting for spare parts shipment, waiting for vendor feedback, or waiting for your clarification). The hold reason and expected resumption date are visible on your ticket.",
        "RESOLVED: The service has been completed or deliverable generated. You can download fulfillment files (such as approved LPOs) directly from the ticket.",
        "CLOSED: The ticket has been confirmed complete and archived.",
      ],
    },
    {
      title: "Downloading Deliverables & LPOs",
      icon: Paperclip,
      description: "Accessing fulfillment documents uploaded by technicians or purchasing officers.",
      steps: [
        "Navigate to 'My Support Requests' from your employee dashboard.",
        "Click on your ticket to open the full ticket workspace.",
        "Scroll down to 'Two-Way Attachments & Deliverables'.",
        "Click the download button next to the generated fulfillment document (e.g., LPO PDF, diagnostic report).",
      ],
    },
  ];

  const technicianGuides = [
    {
      title: "Queue Management & Triaging",
      icon: Wrench,
      description: "Managing assigned tickets and moving them through the lifecycle.",
      steps: [
        "Go to your Technician Workspace (/technician/dashboard).",
        "Review incoming requests under 'Assigned to Me' sorted by priority.",
        "Click on any ticket to open its dedicated workspace (/tickets/[reference]).",
        "Change status from 'OPEN' to 'IN_PROGRESS' once investigation or work commences.",
      ],
    },
    {
      title: "Applying the Waiting Flow (Putting on Hold)",
      icon: Clock,
      description: "Pausing tickets with standardized reasons and expected resumption dates.",
      steps: [
        "Select 'Pending' in the Lifecycle Status dropdown.",
        "The Waiting Flow card will appear: select the preset reason (Waiting for Parts, Awaiting Requester Feedback, Vendor Service, Budget Sign-off, or Custom).",
        "Type brief notes explaining the delay and select the 'Expected Resumption Date'.",
        "Save changes. The SLA breach clock is automatically paused so your metrics are protected.",
      ],
    },
    {
      title: "Escalating Tickets to Department Management",
      icon: Flag,
      description: "When and how to escalate tickets assigned to you.",
      steps: [
        "If a ticket requires manager sign-off, exceeds your technical scope, or faces supplier impasse, click 'Escalate' in the top header.",
        "Select the escalation reason and provide concise context in the escalation notes.",
        "Click 'Confirm Escalation'. The ticket priority elevates to CRITICAL and an alert email is sent to the Department Manager.",
      ],
    },
    {
      title: "Reviewing Your Handled Services Catalog",
      icon: BookOpen,
      description: "Checking which services and issues automatically route to you.",
      steps: [
        "On your Technician Workspace, click the 'My Handled Services / Issues' tab.",
        "Review the catalog of issues where you are the designated technician, along with their SLA turnaround hours and default priority.",
      ],
    },
  ];

  const managerGuides = [
    {
      title: "Department Queue Oversight & Reassignment",
      icon: Briefcase,
      description: "Monitoring all tickets in your department and balancing staff workloads.",
      steps: [
        "Open your Manager Dashboard (/manager/dashboard).",
        "All requests for your department are listed in the 'Department Requests Queue'.",
        "If a ticket is unassigned or assigned to an unavailable technician, click 'Manage' to open the ticket workspace.",
        "Under Lifecycle Controls, select an available team member from the 'Assigned Technician' dropdown and save.",
      ],
    },
    {
      title: "Reviewing Escalations & Vendor Holds",
      icon: Shield,
      description: "Handling tickets flagged with critical priority or extended on-hold dates.",
      steps: [
        "Filter your queue by Priority: 'CRITICAL' to see escalated items requiring supervisory intervention.",
        "Review technician notes, vendor proformas, and quotes.",
        "Provide managerial resolution remarks and coordinate supplier sign-offs.",
      ],
    },
  ];

  const adminGuides = [
    {
      title: "Configuring the 4-Tier Hierarchy",
      icon: Shield,
      description: "Branches, Departments, Categories, and Issue SLAs.",
      steps: [
        "Units / Branches: Configure physical hotels, lodges, or regional offices.",
        "Departments: Create departments and designate their Department Supervisors / Managers.",
        "Categories: Group common service lines (e.g. IT > POS Systems, Purchasing > Food & Beverage).",
        "Issue Types: Define specific services, SLA turnaround hours (e.g. 4h, 24h), and the auto-assigned technician.",
      ],
    },
    {
      title: "User Directory & Role Administration",
      icon: User,
      description: "Onboarding employees, managers, technicians, and assigning payroll numbers.",
      steps: [
        "Navigate to 'User Directory' (/admin/users).",
        "Create single users or use 'Bulk Upload CSV' to import multiple employees simultaneously.",
        "Assign appropriate role flags (is_technician, is_manager, is_admin, is_employee).",
      ],
    },
  ];

  const faqs = [
    {
      q: "Can technicians and managers also raise tickets as employees?",
      a: "Yes! Technicians and managers are also staff members. You can click '+ Raise Request' in the top navbar at any time. Your personal employee requests are tracked under the 'My Raised Requests' tab.",
    },
    {
      q: "What file formats and sizes are supported for attachments?",
      a: "You can upload PDF documents, Word files (.docx), Excel spreadsheets (.xlsx), and images (.png, .jpg) up to 15MB each. Files are stored securely on Tamarind MinIO Object Storage.",
    },
    {
      q: "How does the SLA clock work when a ticket is placed on hold (Pending)?",
      a: "When a technician or manager moves a ticket to 'Pending' with a valid reason (e.g., Waiting for Parts), the SLA breach countdown is paused so staff are not penalized for supplier or shipping delays. The clock resumes once status is moved back to 'In Progress'.",
    },
    {
      q: "Who receives email notifications when a ticket is updated?",
      a: "When a ticket is created, the requester and assigned technician receive email alerts. When status moves to 'Resolved' or when reassigned, automated notifications are dispatched via Tamarind Helpdesk email services.",
    },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary-blue/10 flex items-center justify-center text-primary-blue">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                Helpdesk Knowledge &amp; User Guides
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1 max-w-2xl">
              Comprehensive playbooks, step-by-step procedures, and FAQs for Employees, Technicians, Managers, and System Administrators.
            </p>
          </div>

          <Link
            href="/tickets/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-blue hover:bg-primary-blue/95 text-white rounded text-xs font-semibold transition shadow-sm shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Raise a Request Now</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, procedures, questions, keywords..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-primary-blue focus:bg-white transition"
          />
        </div>
      </div>

      {/* Role Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-white px-3 pt-2 rounded-t shadow-sm">
        <button
          onClick={() => setActiveTab("universal")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === "universal"
              ? "border-primary-blue text-primary-blue"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Universal Staff Guide</span>
        </button>

        {(isTechnician || isAdmin) && (
          <button
            onClick={() => setActiveTab("technician")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "technician"
                ? "border-technician-green text-technician-green"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Technician Playbook</span>
          </button>
        )}

        {(isManager || isAdmin) && (
          <button
            onClick={() => setActiveTab("manager")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "manager"
                ? "border-manager-orange text-manager-orange"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Department Manager Handbook</span>
          </button>
        )}

        {isAdmin && (
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "admin"
                ? "border-admin-purple text-admin-purple"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Administrator System Manual</span>
          </button>
        )}
      </div>

      {/* Guide Content Cards */}
      <div className="space-y-4">
        {activeTab === "universal" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {universalGuides.map((guide, idx) => (
              <div key={idx} className="bg-white p-5 rounded border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-primary-blue">
                    <guide.icon className="w-5 h-5" />
                    <h3 className="text-sm font-semibold text-gray-900">{guide.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{guide.description}</p>
                  <ol className="space-y-2 text-xs text-gray-700 list-decimal list-inside leading-relaxed">
                    {guide.steps.map((step, sIdx) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "technician" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {technicianGuides.map((guide, idx) => (
              <div key={idx} className="bg-white p-5 rounded border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-technician-green">
                    <guide.icon className="w-5 h-5" />
                    <h3 className="text-sm font-semibold text-gray-900">{guide.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{guide.description}</p>
                  <ol className="space-y-2 text-xs text-gray-700 list-decimal list-inside leading-relaxed">
                    {guide.steps.map((step, sIdx) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "manager" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {managerGuides.map((guide, idx) => (
              <div key={idx} className="bg-white p-5 rounded border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-manager-orange">
                    <guide.icon className="w-5 h-5" />
                    <h3 className="text-sm font-semibold text-gray-900">{guide.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{guide.description}</p>
                  <ol className="space-y-2 text-xs text-gray-700 list-decimal list-inside leading-relaxed">
                    {guide.steps.map((step, sIdx) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "admin" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminGuides.map((guide, idx) => (
              <div key={idx} className="bg-white p-5 rounded border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-admin-purple">
                    <guide.icon className="w-5 h-5" />
                    <h3 className="text-sm font-semibold text-gray-900">{guide.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{guide.description}</p>
                  <ol className="space-y-2 text-xs text-gray-700 list-decimal list-inside leading-relaxed">
                    {guide.steps.map((step, sIdx) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Frequently Asked Questions (FAQs)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Quick answers to common questions about ticket routing, SLAs, and attachments.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-4 py-3 text-left text-xs font-semibold text-gray-800 hover:bg-gray-50 flex items-center justify-between gap-3 transition"
              >
                <span>{faq.q}</span>
                {expandedFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </button>

              {expandedFaq === idx && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

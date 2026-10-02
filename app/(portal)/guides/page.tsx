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
  Building2,
  Users2,
  Compass,
  Layers,
  FolderTree,
  ListTree,
  Mail,
  HardDrive,
  BarChart3,
  Sliders,
  ExternalLink,
} from "lucide-react";

export default function GuidesHelpPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<
    "universal" | "technician" | "manager" | "gm" | "group_manager" | "director" | "admin"
  >("universal");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const isAdmin = Boolean(session?.user?.is_admin || session?.user?.is_superuser);
  const isDirector = Boolean(session?.user?.is_director);
  const isGeneralManager = Boolean(session?.user?.is_general_manager);
  const isGroupManager = Boolean(session?.user?.is_group_manager);
  const isManager = Boolean(session?.user?.is_manager || session?.user?.is_hod);
  const isTechnician = Boolean(session?.user?.is_technician);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // ==========================================
  // 1. Universal Staff Guides
  // ==========================================
  const universalGuides = [
    {
      title: "Raising a Support Request or Incident",
      icon: PlusCircle,
      description: "How to properly submit requests to IT, Purchasing, Maintenance, HR, or Accounts.",
      steps: [
        "Click on '+ Raise Request' in the top navigation bar or from your employee dashboard.",
        "Select your Property / Unit (e.g. Tamarind Nairobi, Tamarind Mombasa, Carnivore) and the Target Department (e.g. IT, Purchasing, Maintenance).",
        "Choose the Service Category and specific Issue Type. The target SLA resolution turnaround is displayed live on your screen.",
        "Enter a concise subject summary and detailed description (include room/table numbers, serial numbers, error messages, or staff IDs).",
        "Attach supporting documents or images (e.g. equipment fault photo, vendor quotation, invoice) via the drag-and-drop attachment zone.",
        "Click 'Submit Support Ticket'. You will receive an instant email confirmation with your unique ticket reference (e.g., TML-IT-2026-0042).",
      ],
    },
    {
      title: "Understanding Ticket Statuses & Lifecycles",
      icon: Clock,
      description: "How your support ticket moves through triage, work, and fulfillment.",
      steps: [
        "OPEN: Your request has been logged and is awaiting technician assignment or supervisor triage.",
        "IN PROGRESS: A dedicated technician has accepted the ticket and is actively resolving the issue or processing the requisition.",
        "PENDING (ON HOLD): Work is temporarily paused due to external dependencies (e.g. waiting for spare parts delivery, vendor technician arrival, or user clarification). The hold reason and expected resumption date are clearly displayed on your ticket.",
        "ESCALATED: The request has exceeded the SLA threshold or has been flagged for supervisor/managerial intervention.",
        "RESOLVED: The work has been completed or deliverables generated. You can inspect technician resolution notes and attached documents.",
        "CLOSED: The ticket has been verified and permanently archived.",
      ],
    },
    {
      title: "Two-Way Deliverables & File Attachments",
      icon: Paperclip,
      description: "Accessing fulfillment deliverables (e.g. approved LPOs, signed job cards, diagnostic reports).",
      steps: [
        "Navigate to 'My Support Requests' from your employee dashboard.",
        "Click on any ticket to open the full-page ticket workspace (/tickets/[reference]).",
        "Scroll down to 'Two-Way Attachments & Deliverables'.",
        "Requesters can upload initial quotes or fault photos; responders (technicians, purchasing officers) upload fulfillment deliverables (such as signed LPO PDFs, job completion signoffs, or calibration sheets).",
        "Click the download button next to any file to securely download it from Tamarind MinIO Object Storage.",
      ],
    },
  ];

  // ==========================================
  // 2. Technician Playbook
  // ==========================================
  const technicianGuides = [
    {
      title: "Queue Management & Triaging",
      icon: Wrench,
      description: "Accepting assigned work, managing priorities, and tracking SLA countdowns.",
      steps: [
        "Open your Support Technician Workspace (/technician/dashboard).",
        "Review your ticket queues: 'Assigned to Me' and 'Department Queue' sorted by priority and SLA deadline.",
        "Click on any ticket to launch the full-page workspace (/tickets/[reference]).",
        "Change status from 'OPEN' to 'IN PROGRESS' as soon as diagnostic investigation or service fulfillment begins.",
        "Notice that technicians are also employees: you can raise personal requests anytime via '+ Raise Request' in the top navbar and track them under 'My Raised Requests'.",
      ],
    },
    {
      title: "Applying the Enhanced Waiting Flow (Holding Tickets)",
      icon: Clock,
      description: "Pausing the SLA countdown clock for legitimate delays with standardized reasons.",
      steps: [
        "When work cannot proceed due to external factors, switch ticket status to 'PENDING'.",
        "The Waiting Flow prompt will appear: select a preset reason (Waiting for Parts, Awaiting Requester Feedback, Third-party Vendor Service, Budget / Approval Sign-off, or Custom Reason).",
        "Provide detailed explanatory notes in the text field explaining why the pause is necessary.",
        "Set the 'Expected Resumption Date' so supervisors and requesters know when progress will resume.",
        "While in 'PENDING', the SLA breach timer is paused, ensuring your performance scorecard is not penalized for third-party delays.",
      ],
    },
    {
      title: "Fulfillment Deliverables & Escalations",
      icon: CheckCircle2,
      description: "Uploading completion deliverables and escalating blocked requests.",
      steps: [
        "To escalate a blocked ticket, click the 'Escalate Ticket' button in your workspace. Select the escalation reason (Unresponsive User, Parts Unobtainable, Cross-Departmental Blockage). The HOD will be notified immediately.",
        "When work is complete, upload the deliverable file (e.g. signed physical job card photo, approved LPO PDF, or network certificate) under Attachments.",
        "Add comprehensive resolution notes detailing what action was taken.",
        "Click 'Mark Resolved'. The requester is notified and provided with the deliverable download link.",
      ],
    },
  ];

  // ==========================================
  // 3. Department Manager Handbook
  // ==========================================
  const managerGuides = [
    {
      title: "Department Queue & Workload Oversight",
      icon: Briefcase,
      description: "Monitoring all tickets handled by your department across all assigned staff.",
      steps: [
        "Access the Department Manager Dashboard (/manager/dashboard).",
        "Review the department overview table showing all active tickets, unassigned requests, and technician assignments.",
        "Reassign tickets to alternate technicians if workload is unbalanced or a technician is on leave.",
        "Raise department supply or operational requests directly using '+ Raise Request'. Your personal employee tickets are tracked separately from your managed department queue.",
      ],
    },
    {
      title: "Configuring Department Escalation Rules",
      icon: Sliders,
      description: "Setting automated SLA warning alerts, breach escalation, and GM notifications.",
      steps: [
        "Navigate to 'Manager Escalation Rules' in the menu or visit (/manager/escalations).",
        "Select your managed department from the left column.",
        "SLA Warning Threshold (%): Choose when technicians receive warning alerts (e.g. at 75% of SLA elapsed).",
        "Auto-Escalate on Breach: Toggle ON to automatically escalate tickets to ESCALATED status upon reaching 100% SLA time.",
        "Escalate to General Manager: Define how many hours after breach a ticket remains unresolved before notifying the Unit GM (e.g. 4 hours).",
        "Immediate Critical Alert: Toggle ON to receive instant notifications the moment a Critical priority ticket is submitted.",
        "Additional Notification Recipients: Add comma-separated emails (e.g. assistant HOD, regional lead) to receive escalation digests.",
        "Click 'Save Escalation Rules'. Rules take effect immediately across all incoming tickets.",
      ],
    },
    {
      title: "Departmental SLA & Productivity Analytics",
      icon: BarChart3,
      description: "Reviewing technician MTTR, SLA compliance rates, and backlog aging.",
      steps: [
        "Navigate to 'Reports & Analytics' (/reports).",
        "Select your department to filter metrics specifically for your operational team.",
        "Review Tier 1 (Volume, breach rate, aging backlog under 24h, 3-7d, >14d).",
        "Inspect Tier 2 (Individual technician scorecard: assigned vs resolved, SLA compliance %, MTTR hours).",
        "Export the department tickets register or technician scorecards to CSV for weekly operational meetings.",
      ],
    },
  ];

  // ==========================================
  // 4. General Manager (Unit GM) Property Guide
  // ==========================================
  const gmGuides = [
    {
      title: "Single-Property Unit Health Monitoring",
      icon: Building2,
      description: "Comprehensive operational visibility over your designated hotel, lodge, or branch.",
      steps: [
        "Log into your GM Property Dashboard (/gm/dashboard).",
        "Review key property KPIs: Total Inbound Requests, Property SLA Compliance Rate, Escalated Tickets, and Breaches.",
        "Examine the 'Technician Workload & Performance' scorecard to identify which branch departments are thriving and which require staffing support.",
        "Review tickets that have been escalated to GM level by the automated Escalation Engine (tickets unaddressed by HODs past the escalation threshold).",
        "Raise property-level requests or urgent capital maintenance tickets anytime via '+ Raise Request'.",
      ],
    },
    {
      title: "Cross-Department Auditing & Escalation Review",
      icon: AlertTriangle,
      description: "Resolving inter-departmental bottlenecks and holding supervisors accountable.",
      steps: [
        "In the GM Dashboard, click into any escalated ticket to view the complete audit timeline.",
        "Inspect technician waiting reasons (e.g. are tickets waiting on purchasing approvals, spare parts from stores, or external contractor quotes?).",
        "Intervene directly by reassigning priority or contacting department heads.",
        "Use (/reports) with your Unit filter to generate monthly property performance packs.",
      ],
    },
  ];

  // ==========================================
  // 5. Group Operations Manager Guide
  // ==========================================
  const groupManagerGuides = [
    {
      title: "Cross-Property Functional Domain Oversight",
      icon: Users2,
      description: "Standardizing operations across all Tamarind properties for your functional group (e.g. Group IT, Group Maintenance, Group Purchasing, Group HR).",
      steps: [
        "Navigate to the Group Operations Dashboard (/group-manager/dashboard).",
        "Review aggregated metrics across all Tamarind branches for your functional domain.",
        "Examine the 'Functional Activity Across Properties' benchmark table: compare how IT or Maintenance performs in Nairobi vs. Mombasa vs. Carnivore.",
        "Identify cross-unit disparities in resolution time (MTTR) and SLA compliance rates.",
        "Work with property General Managers and unit supervisors to standardize equipment, supplier contracts, and standard operating procedures (SOPs).",
      ],
    },
    {
      title: "Group Domain Reporting & Analytics",
      icon: BarChart3,
      description: "Benchmarking cross-unit efficiency and exporting corporate intelligence.",
      steps: [
        "Open (/reports) and select your functional group in the filter bar.",
        "View Tier 3 Executive Benchmarks: inspect the 'Cross-Unit Functional Group Health' table.",
        "Export Domain CSV registers to track multi-branch capital expenditure, recurring equipment failures, and vendor warranties.",
      ],
    },
  ];

  // ==========================================
  // 6. Executive Director Overview
  // ==========================================
  const directorGuides = [
    {
      title: "Executive Portfolio Visibility",
      icon: Compass,
      description: "High-level strategic oversight over all properties, groups, and leadership tiers.",
      steps: [
        "Access the Director Executive Dashboard (/director/dashboard).",
        "Review top-line portfolio health: Total Portfolio Requests, Overall SLA Compliance %, Total Breaches, and Mean Resolution Time.",
        "Inspect Property Performance Benchmarks: live comparison of all physical branches (Nairobi, Mombasa, Carnivore, etc.).",
        "Inspect Functional Group Health: corporate comparison of Group IT, Group Maintenance, Group Purchasing, and Group HR.",
        "Switch analysis periods between 7 Days, 30 Days, 90 Days (Quarter), or 1 Year to monitor seasonal operational efficiency.",
        "Access (/reports) for deep-dive multi-tier analytics and CSV exports for Board of Directors presentations.",
      ],
    },
  ];

  // ==========================================
  // 7. System Administrator Manual & Initial Setup Guide
  // ==========================================
  const adminGuides = [
    {
      title: "STEP-BY-STEP INITIAL PLATFORM SETUP (Clean Slate)",
      icon: Shield,
      description: "Mandatory sequential setup order when deploying a fresh Tamarind Helpdesk environment.",
      steps: [
        "STEP 1: UNITS & BRANCHES (/admin/units) — Create all physical operational properties first (e.g. Tamarind Nairobi, Tamarind Mombasa, Carnivore, Tamarind Tree Hotel). Each unit requires Name, unique Code (e.g. TML-NRB), and Location.",
        "STEP 2: FUNCTIONAL GROUPS (/admin/groups) — Establish corporate functional domains spanning properties (e.g. Group Information Technology, Group Maintenance, Group Purchasing & Supplies, Group Human Resources). You can assign Group Managers now or after user creation.",
        "STEP 3: USER DIRECTORY & ROLES (/admin/users) — Provision all staff accounts. Assign correct role flags: Staff Employee (default), Support Technician (is_technician), Department Manager (is_manager / is_hod), Unit General Manager (is_general_manager + set managed_unit to their property), Group Operations Manager (is_group_manager + assign to Group), Executive Director (is_director), or System Administrator (is_admin / is_superuser). Use 'Bulk CSV Upload' for large rosters.",
        "STEP 4: DEPARTMENTS (/admin/departments) — Create operational departments within each Unit (e.g. IT - Nairobi, Kitchen - Carnivore, Maintenance - Mombasa). Assign each department to its Parent Unit, its Functional Group (e.g. IT Group), its Supervisor/HOD, and assign staff/technicians.",
        "STEP 5: SERVICE CATEGORIES (/admin/categories) — Create logical service groupings under each department (e.g. Under IT: Hardware & Peripherals, POS Systems, Network & Wi-Fi; Under Purchasing: Food & Beverage Requisitions, Capex Supplies).",
        "STEP 6: ISSUE TYPES & SLAs (/admin/issues) — Configure granular, raiseable request items under each category (e.g. 'Printer Jammed', 'LPO Request with Quotation', 'Cold Room Temperature Alarm'). Define default priority, resolution SLA turnaround hours (e.g. 4h, 24h), and the primary technician auto-assignee.",
        "STEP 7: ESCALATION RULES (/manager/escalations) — Configure proactive rules for each department: warning threshold % (default 75%), auto-escalate on breach toggle, GM escalation timer (e.g. 4 hours unaddressed after breach), and emergency alert emails.",
        "STEP 8: STORAGE & EMAIL VERIFICATION — Confirm MinIO Object Storage credentials (endpoint: media.tamarind.co.ke, bucket: tml-helpdesk) and SMTP email notification relay in backend settings.",
      ],
    },
    {
      title: "Organization Tickets Audit & Management",
      icon: FileText,
      description: "Global ticket registry, status overriding, and organizational audit logs.",
      steps: [
        "Navigate to 'Organization Tickets' (/admin/tickets) to inspect every ticket raised across all properties.",
        "Filter by Unit, Department, Priority, or Lifecycle Status.",
        "Audit ticket response histories, attachment integrity, and SLA breach timelines.",
        "Administrators can reassign orphaned tickets or archive obsolete test records.",
      ],
    },
    {
      title: "User Provisioning & Role Administration",
      icon: User,
      description: "Managing payroll numbers, branch transfers, password resets, and permission grants.",
      steps: [
        "Go to 'User Directory' (/admin/users).",
        "Add individual users with their Tamarind corporate email, first name, last name, and payroll number.",
        "To promote a user to Unit General Manager: check 'General Manager' and select their assigned property in 'Managed Unit'.",
        "To promote a user to Group Manager: check 'Group Manager' and assign them in (/admin/groups).",
        "To promote a user to Executive Director: check 'Executive Director'.",
        "Use Bulk Import CSV with columns: email, first_name, last_name, payroll_no, role to import branch rosters seamlessly.",
      ],
    },
    {
      title: "Service Catalog & SLA Governance",
      icon: ListTree,
      description: "Reviewing service categories and updating SLA contractual turnaround targets.",
      steps: [
        "Regularly review Category and Issue configurations under (/admin/categories) and (/admin/issues).",
        "If a department consistently breaches a 2-hour SLA due to vendor constraints, adjust the Issue Type SLA hours to reflect realistic operational turnaround.",
        "Ensure every active issue type has at least one active designated technician.",
      ],
    },
  ];

  // ==========================================
  // Frequently Asked Questions
  // ==========================================
  const faqs = [
    {
      q: "Can technicians, managers, GMs, and directors also raise tickets as employees?",
      a: "Yes! Every single user on the Tamarind Helpdesk platform is an employee first. A technician who needs printer paper or an LPO can click '+ Raise Request' in the top navbar anytime. Their personal requests are kept neatly separated from their operational queues and tracked under 'My Support Requests'.",
    },
    {
      q: "What file formats and file sizes are supported for attachments?",
      a: "You can upload PDF documents, Word documents (.docx), Excel spreadsheets (.xlsx), plain text, and high-resolution images (.png, .jpg, .jpeg) up to 15MB per file. All files are securely encrypted and stored on Tamarind's private MinIO Object Storage cluster (media.tamarind.co.ke) under the 'tml-helpdesk' bucket.",
    },
    {
      q: "How does the SLA clock work when a ticket is placed on hold (Pending)?",
      a: "When a technician or manager sets a ticket status to 'Pending' with a valid reason (e.g. Waiting for Parts or Vendor Service), the SLA breach timer is paused automatically. The timer will only resume counting down when the status is moved back to 'In Progress'. This prevents technicians from being unfairly penalized for external supply chain or delivery delays.",
    },
    {
      q: "How does the 4-Tier Escalation Engine work?",
      a: "1) At 75% of the SLA time, an automated warning alert is dispatched to the technician. 2) At 100% (breach), the ticket is automatically escalated and the Department Supervisor/HOD is alerted. 3) If unresolved after X hours (configured per department, e.g. 4 hours), the ticket escalates to the Unit General Manager. 4) Critical priority tickets immediately notify the entire management chain upon submission.",
    },
    {
      q: "What is the difference between a Department and a Functional Group?",
      a: "A Department is a local operational unit at a specific physical property (e.g. 'IT - Nairobi' or 'Maintenance - Mombasa'). A Functional Group is a corporate-wide umbrella domain (e.g. 'Group IT' or 'Group Maintenance') that links all those localized departments together across all properties under a single Group Manager.",
    },
    {
      q: "How does multi-tier reporting scoping work?",
      a: "When viewing Reports & Analytics (/reports), the platform automatically filters data based on your organizational role: Department Managers see their department; General Managers see their entire property; Group Managers see their functional domain across all units; and Directors/Admins see global portfolio-wide metrics.",
    },
  ];

  // Filter guides by search
  const filterGuides = (guides: typeof universalGuides) => {
    if (!searchQuery.trim()) return guides;
    const q = searchQuery.toLowerCase();
    return guides.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.steps.some((s) => s.toLowerCase().includes(q))
    );
  };

  const filteredUniversal = filterGuides(universalGuides);
  const filteredTechnician = filterGuides(technicianGuides);
  const filteredManager = filterGuides(managerGuides);
  const filteredGM = filterGuides(gmGuides);
  const filteredGroupManager = filterGuides(groupManagerGuides);
  const filteredDirector = filterGuides(directorGuides);
  const filteredAdmin = filterGuides(adminGuides);

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary-blue via-primary-blue/95 to-primary-blue/90 rounded-xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-sm border border-white/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tamarind Knowledge & Help Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Helpdesk Guides & Operational Manuals
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Standard operating procedures, full platform walkthroughs, and step-by-step role guides for staff, technicians, department managers, general managers, group managers, directors, and system administrators.
          </p>
        </div>

        {/* Search input in banner */}
        <div className="mt-5 max-w-xl relative z-10">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search guides, setup steps, SLA rules, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-900 rounded-lg text-xs outline-none shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-blue-300 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Role Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-white px-3 pt-2 rounded-t shadow-sm">
        <button
          onClick={() => setActiveTab("universal")}
          className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === "universal"
              ? "border-primary-blue text-primary-blue"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Universal Staff Guide</span>
        </button>

        <button
          onClick={() => setActiveTab("technician")}
          className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === "technician"
              ? "border-technician-green text-technician-green"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Technician Playbook</span>
        </button>

        <button
          onClick={() => setActiveTab("manager")}
          className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === "manager"
              ? "border-manager-orange text-manager-orange"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Department HOD</span>
        </button>

        <button
          onClick={() => setActiveTab("gm")}
          className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === "gm"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>General Manager</span>
        </button>

        <button
          onClick={() => setActiveTab("group_manager")}
          className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === "group_manager"
              ? "border-blue-700 text-blue-700"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Users2 className="w-3.5 h-3.5" />
          <span>Group Manager</span>
        </button>

        <button
          onClick={() => setActiveTab("director")}
          className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === "director"
              ? "border-purple-700 text-purple-700"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Executive Director</span>
        </button>

        <button
          onClick={() => setActiveTab("admin")}
          className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === "admin"
              ? "border-admin-purple text-admin-purple"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin & Initial Setup</span>
        </button>
      </div>

      {/* Guide Content Cards */}
      <div className="space-y-4">
        {/* Universal Staff */}
        {activeTab === "universal" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredUniversal.map((guide, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between hover:border-primary-blue/40 transition-colors"
              >
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

        {/* Technician Playbook */}
        {activeTab === "technician" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredTechnician.map((guide, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between hover:border-technician-green/40 transition-colors"
              >
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

        {/* Department Manager / HOD */}
        {activeTab === "manager" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredManager.map((guide, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between hover:border-manager-orange/40 transition-colors"
              >
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

        {/* General Manager */}
        {activeTab === "gm" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGM.map((guide, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between hover:border-emerald-600/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2 text-emerald-700">
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

        {/* Group Operations Manager */}
        {activeTab === "group_manager" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGroupManager.map((guide, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between hover:border-blue-700/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2 text-blue-700">
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

        {/* Executive Director */}
        {activeTab === "director" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDirector.map((guide, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between hover:border-purple-700/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2 text-purple-700">
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

        {/* Administrator & Initial Setup */}
        {activeTab === "admin" && (
          <div className="space-y-4">
            {filteredAdmin.map((guide, idx) => {
              const isSetup = guide.title.includes("INITIAL PLATFORM SETUP");
              return (
                <div
                  key={idx}
                  className={`bg-white p-6 rounded-lg border shadow-sm transition-colors ${
                    isSetup
                      ? "border-admin-purple/40 bg-purple-50/20"
                      : "border-gray-200 hover:border-admin-purple/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-admin-purple">
                      <guide.icon className="w-5 h-5" />
                      <h3 className="text-sm font-bold text-gray-900">{guide.title}</h3>
                    </div>
                    {isSetup && (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-admin-purple text-white">
                        Clean Slate Blueprint
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-4">{guide.description}</p>
                  <div className="space-y-2.5 text-xs text-gray-800 leading-relaxed">
                    {guide.steps.map((step, sIdx) => {
                      const isStepHeader = step.startsWith("STEP ");
                      return (
                        <div
                          key={sIdx}
                          className={`p-3 rounded border ${
                            isStepHeader
                              ? "bg-white border-purple-200 shadow-2xs font-normal"
                              : "bg-gray-50/50 border-gray-100"
                          }`}
                        >
                          {step}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary-blue" />
            Frequently Asked Questions (FAQs)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Quick answers about ticket routing, MinIO attachments, escalation timers, and roles.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-md overflow-hidden transition-colors"
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

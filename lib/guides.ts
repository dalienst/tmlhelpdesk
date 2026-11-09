/**
 * Help Center content, one section per role.
 *
 * Keep this in step with the platform's behaviour (see the "Roles and
 * Capabilities" document). Each person sees the "universal" section plus the
 * sections for the roles they hold; administrators see every section.
 */

export type GuideRole =
  | "universal"
  | "technician"
  | "manager"
  | "gm"
  | "group_manager"
  | "director"
  | "admin";

export type GuideIcon =
  | "login"
  | "plus"
  | "clock"
  | "paperclip"
  | "mail"
  | "wrench"
  | "pause"
  | "flag"
  | "check"
  | "briefcase"
  | "sliders"
  | "chart"
  | "building"
  | "users"
  | "compass"
  | "shield"
  | "layers"
  | "alert";

export interface Guide {
  title: string;
  icon: GuideIcon;
  summary: string;
  steps: string[];
  /** What the platform does after the steps (emails, SLA, who is told) */
  whatHappensNext?: string[];
  /** Common problems and what to do about them */
  troubleshooting?: { problem: string; fix: string }[];
}

export interface GuideSection {
  role: GuideRole;
  label: string;
  intro: string;
  guides: Guide[];
}

export interface Faq {
  q: string;
  a: string;
  /** Who sees this question; "universal" means everyone */
  roles: GuideRole[];
}

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    role: "universal",
    label: "Everyone",
    intro:
      "Every Tamarind staff member, whatever their role, uses the helpdesk to raise and follow their own requests. Start here.",
    guides: [
      {
        title: "Signing in, sessions and your password",
        icon: "login",
        summary: "Your account, how long you stay signed in, and what to do if you forget your password.",
        steps: [
          "Your account is created by the helpdesk administrator. You will receive an email with your sign-in details; there is no self sign-up.",
          "Sign in at the login page with your work email and password. You land on the dashboard for your role.",
          "For security you are signed out automatically 12 hours after signing in. You will see 'Your session has expired' on the login page; just sign in again.",
          "To change your password or update your name, open Settings in the left menu.",
          "Forgot your password? Click 'Forgot password' on the login page, enter your work email, and use the 6-digit code from the email on the reset page.",
          "Always click Sign Out when you finish on a shared computer.",
        ],
        troubleshooting: [
          {
            problem: "I did not receive the reset code.",
            fix: "Check your spam folder and that you typed your work email exactly. The page shows the same message whether or not the email has an account, so a typo looks like success. After 10 attempts in a minute you must wait a minute before trying again.",
          },
          {
            problem: "I was signed out in the middle of my work.",
            fix: "Sessions last 12 hours. Sign in again and reopen the ticket; anything you had already saved is kept.",
          },
          {
            problem: "I land on the wrong dashboard or cannot see a menu item I expect.",
            fix: "Your menu depends on the roles on your account. Ask the administrator to check your roles.",
          },
        ],
      },
      {
        title: "Raising a request",
        icon: "plus",
        summary: "How to log a request so it reaches the right person first time.",
        steps: [
          "Click 'Raise a Request' in the left menu.",
          "Pick the branch, department and service category to narrow the list, then choose the specific Issue / Request type. Choosing the issue is what routes the ticket: the platform fills in the department and unit and assigns the right technician automatically.",
          "Check the panel on the right: it shows who the ticket will go to and the SLA (the target time to resolve it).",
          "The priority is pre-filled from the issue type. Only raise it if the problem is genuinely stopping work; Critical tickets alert the head of department immediately.",
          "Write a short subject and a full description: location (room, outlet, desk), what happened, error messages, asset or serial numbers, and how many people are affected.",
          "Attach photos or documents if they help (up to 10 files, 15MB each: images, PDF, Word, Excel, PowerPoint, CSV or text).",
          "Click 'Submit Support Ticket'. You are taken to the ticket page, which has its own reference such as TML-IT-2026-0042.",
        ],
        whatHappensNext: [
          "You receive a 'Ticket Received' email with the ticket number.",
          "The assigned technician receives a 'New Ticket Assigned' email.",
          "The SLA clock starts. If the ticket is Critical, the head of department is alerted straight away.",
        ],
        troubleshooting: [
          {
            problem: "I cannot find the right issue type.",
            fix: "Pick the closest one in the right department and explain in the description; the department can reassign it. Ask your administrator to add missing issue types.",
          },
          {
            problem: "A file will not attach.",
            fix: "Files must be under 15MB and an image, PDF, Office document, CSV or text file. Zip files and executables are refused.",
          },
        ],
      },
      {
        title: "Following your ticket and what the statuses mean",
        icon: "clock",
        summary: "Where to find your tickets and how to read their progress.",
        steps: [
          "Your dashboard lists every ticket you have raised with its status and who is handling it. Click a ticket to open it.",
          "Open: logged and assigned, waiting to be picked up.",
          "In Progress: someone is working on it.",
          "On Hold (Pending): paused for a stated reason such as waiting for parts, a vendor, an approval, or more information from you. The reason and expected resume date are shown on the ticket, and the SLA clock is paused.",
          "Resolved: the work is done. Read the resolution notes and any proof-of-work files.",
          "Closed: finished and filed. Cancelled: withdrawn before work started.",
          "An 'Escalated' badge means the ticket has been raised to management, either by staff or automatically because it ran past its SLA.",
        ],
        whatHappensNext: [
          "You are emailed when your ticket is resolved or closed.",
          "If the technician puts the ticket on hold waiting for you, reply with the information they need as soon as you can; the ticket cannot move until then.",
        ],
      },
      {
        title: "Editing or cancelling your ticket",
        icon: "alert",
        summary: "What you can change on your own ticket, and when.",
        steps: [
          "While your ticket is still Open you can correct its subject and description, or cancel it if it is no longer needed.",
          "Once a technician has started work, contact them with any new detail, or raise a new ticket for a new problem.",
          "You cannot change the status, priority or assignee of your own ticket; that is the department's job.",
        ],
      },
      {
        title: "Attachments and deliverables",
        icon: "paperclip",
        summary: "Sharing photos and documents, and collecting the results.",
        steps: [
          "On the ticket page, 'Requester Supporting Documents & Photos' holds the files you added; you can add more there at any time.",
          "'Resolution Deliverables & Proof of Work' holds what the technician uploaded, such as a signed job card or an approved LPO.",
          "Click a file to download it. Images open in the browser; other files download.",
          "You can delete files you uploaded yourself. Only an administrator can delete someone else's file.",
        ],
      },
    ],
  },
  {
    role: "technician",
    label: "Technician",
    intro:
      "You work the tickets assigned to you and your department. Keep each ticket's status honest: it drives the SLA clock, the escalation alerts and your scorecard.",
    guides: [
      {
        title: "Your queue",
        icon: "wrench",
        summary: "Where your work comes from and how to prioritise it.",
        steps: [
          "Open your dashboard. 'Assigned to Me' lists your tickets; 'My Raised Requests' lists tickets you raised for yourself.",
          "Tickets reach you automatically when someone raises an issue type you handle; the panel 'My Handled Services / Issues' shows those issue types and their SLA.",
          "Work Critical and High tickets first, then by age. Each ticket page shows when its SLA is due.",
          "You can also open any ticket in a department where you are listed as staff, for example to cover for a colleague.",
        ],
        whatHappensNext: [
          "You receive an email for every new or reassigned ticket.",
          "When a ticket has used most of its SLA (75% by default) you receive an 'SLA Warning' email.",
        ],
      },
      {
        title: "Working a ticket from start to finish",
        icon: "check",
        summary: "The normal path: In Progress, notes, proof of work, Resolved.",
        steps: [
          "Open the ticket and read the description and attachments.",
          "In 'Ticket Lifecycle Controls', set the status to 'In Progress' as soon as you start, then click 'Save Lifecycle Changes'.",
          "Record what you find and do in 'Resolution / Troubleshooting Notes'. Write for someone who has never seen the problem.",
          "When the work is done, upload proof under 'Upload Resolution Deliverable / Proof of Service' (photo of the fix, signed job card, LPO, report).",
          "Set the status to 'Resolved' and save. Use 'Closed' only for tickets that need no further follow-up.",
        ],
        whatHappensNext: [
          "The requester is emailed that the ticket is resolved, with a link to your notes and files.",
          "Resolution time and whether the SLA was met appear in your scorecard in the reports.",
        ],
        troubleshooting: [
          {
            problem: "Saving fails with a permission message.",
            fix: "Technicians can change status, notes and on-hold details, and escalate. Reassigning or changing priority needs your head of department.",
          },
        ],
      },
      {
        title: "Putting a ticket on hold",
        icon: "pause",
        summary: "Pause the SLA clock when you are genuinely waiting on someone else.",
        steps: [
          "Set the status to 'Pending (On hold)'. The Waiting Flow Details box appears.",
          "Choose the reason: Waiting for Spare Parts / Delivery, Awaiting Requester Feedback, Awaiting Third-Party Vendor Service, Awaiting Budget / Financial Sign-off, Scheduled for Future Maintenance, or Custom Reason.",
          "Explain in 'Custom Staff Remarks' exactly what you are waiting for and from whom.",
          "Set the 'Expected Resumption Date' and save.",
          "When the wait is over, set the status back to 'In Progress' and save.",
        ],
        whatHappensNext: [
          "The SLA clock stops while the ticket is on hold and restarts when you resume, so you are not penalised for other people's delays.",
          "Managers see hold reasons and overdue resume dates in the reports, so only use hold for real waits.",
        ],
      },
      {
        title: "Escalating, and automatic escalation",
        icon: "flag",
        summary: "When to ask management for help, and what happens if the SLA runs out.",
        steps: [
          "Escalate when you cannot resolve the ticket yourself: it needs a specialist, budget sign-off, is stuck with a vendor, is about to breach its SLA, or is a critical outage.",
          "Click 'Escalate Ticket to Management', choose the reason, describe what is blocking you, and click 'Confirm Escalation'.",
          "Keep working the ticket after escalating; escalation adds management attention, it does not take the ticket away from you.",
        ],
        whatHappensNext: [
          "The ticket becomes Critical and shows an 'Escalated' badge. Your head of department (and any extra contacts in the department's escalation rules) is emailed immediately.",
          "If you do not escalate and the SLA runs out, the helpdesk escalates the ticket automatically in the same way, marked 'SLA breached (automatic)'.",
          "If an escalated ticket is still unresolved after the department's GM threshold (4 hours by default), the unit's General Manager is emailed.",
        ],
      },
    ],
  },
  {
    role: "manager",
    label: "Head of Department",
    intro:
      "You are responsible for your department's queue, its SLA performance and its escalation rules.",
    guides: [
      {
        title: "Running the department queue",
        icon: "briefcase",
        summary: "See everything in your department and keep work moving.",
        steps: [
          "Your dashboard shows every ticket in the departments you supervise and the categories you lead, with filters for department, priority and status.",
          "Check 'Priority escalations' (Critical and High) first, then anything Open for too long.",
          "To rebalance work, open a ticket and choose a new 'Assigned Technician'; you can also change the 'Priority Level'. Save the changes.",
          "You can work any ticket yourself with the same controls technicians use.",
        ],
        whatHappensNext: [
          "A reassigned technician is emailed straight away.",
          "You are emailed for every escalation in your department, for every Critical ticket raised (if the rule is on), and when a ticket breaches its SLA and escalates automatically.",
        ],
      },
      {
        title: "Responding to an escalation",
        icon: "alert",
        summary: "What to do when an escalation alert arrives.",
        steps: [
          "Open the ticket from the email's 'Review Escalated Ticket' button.",
          "Read the escalation reason and notes, then decide: reassign to someone more suitable, approve what is blocking it, or contact the vendor or requester yourself.",
          "Record your decision in the resolution notes so the technician and requester can see it.",
          "Act within the department's GM threshold (4 hours by default); after that the unit's General Manager is alerted automatically.",
        ],
      },
      {
        title: "Setting your department's escalation rules",
        icon: "sliders",
        summary: "Decide when warnings, escalations and GM alerts are sent.",
        steps: [
          "Open 'Escalation Rules' in the left menu and select your department. You only see departments you are allowed to configure.",
          "SLA Warning Threshold: the share of the SLA (for example 75%) at which the assigned technician gets a warning email.",
          "Auto-Escalate on Breach: when on, a ticket whose SLA runs out is escalated automatically, set to Critical, and you are emailed.",
          "Escalate to General Manager: how many hours an escalated ticket can stay unresolved before the unit GM is emailed. 0 turns this off.",
          "Immediate Critical Alert: email you as soon as a Critical ticket is raised.",
          "Additional Notification Recipients: extra addresses (for example a deputy) copied on escalation, GM and critical alerts.",
          "Click 'Save Escalation Rules'. Departments without saved rules use the defaults: 75%, auto-escalate on, GM after 4 hours, critical alerts on.",
        ],
        whatHappensNext: [
          "The helpdesk checks open tickets every few minutes and applies these rules. Each alert is sent once per ticket.",
          "Time a ticket spends on hold does not count towards warnings or breaches.",
        ],
      },
      {
        title: "Department reports",
        icon: "chart",
        summary: "Measure SLA compliance, workload and technician performance.",
        steps: [
          "Open 'Reports & Analytics'. You see only tickets in your departments.",
          "Choose the period (today, 7, 30 or 90 days, year to date, all time, or custom dates) and filter by department, priority or status.",
          "Use SLA compliance by priority, busiest issue types, hold reasons and technician scorecards to spot problems early.",
          "Click Export to download the tickets register, technician scorecards or unit summary as CSV.",
        ],
        troubleshooting: [
          {
            problem: "A new ticket does not appear in the report yet.",
            fix: "Reports are recalculated at most every 2 minutes. Wait a moment and refresh.",
          },
        ],
      },
    ],
  },
  {
    role: "gm",
    label: "General Manager",
    intro: "You oversee every department in your unit (property or branch).",
    guides: [
      {
        title: "Your unit dashboard",
        icon: "building",
        summary: "The health of your property at a glance.",
        steps: [
          "Your dashboard shows SLA compliance, open and escalated tickets, and technician workload for your unit.",
          "Click any ticket to open it. You can reassign it, change its priority and work it like a head of department.",
          "Use 'Raise Request' for anything you need yourself.",
        ],
      },
      {
        title: "Escalations that reach you",
        icon: "alert",
        summary: "When the helpdesk emails you, and what to do.",
        steps: [
          "You receive an 'Unresolved Escalation' email when an escalated ticket in your unit is still not resolved after the department's GM threshold (4 hours by default).",
          "Open the ticket, read the escalation reason and the hold history, and contact the head of department.",
          "Decide what unblocks it (approval, reassignment, a vendor call) and note the decision on the ticket.",
          "Your dashboard counts the escalated tickets in your unit that are still open.",
        ],
      },
      {
        title: "Unit reports and escalation rules",
        icon: "chart",
        summary: "Monthly packs and tuning the rules for your departments.",
        steps: [
          "Open 'Reports & Analytics' to see your unit only. Compare departments, issue types and technicians; export CSVs for management packs.",
          "You may change the escalation rules of any department in your unit. Ask the administrator if the Escalation Rules page is not in your menu.",
        ],
      },
    ],
  },
  {
    role: "group_manager",
    label: "Group Manager",
    intro:
      "You oversee one functional group (for example Group ICT or Group Maintenance) across all units.",
    guides: [
      {
        title: "Comparing your function across units",
        icon: "users",
        summary: "See where the same service performs differently by property.",
        steps: [
          "Your dashboard compares each unit's departments in your group: volume, resolution, escalations and SLA compliance.",
          "Open any ticket in your group's departments; you can reassign it and change its priority.",
          "Use the differences between units to standardise suppliers, equipment and procedures.",
        ],
        whatHappensNext: [
          "If a unit has no General Manager, unresolved escalations in your group's departments are emailed to you instead.",
        ],
      },
      {
        title: "Group reports",
        icon: "chart",
        summary: "Cross-unit benchmarks and exports.",
        steps: [
          "Open 'Reports & Analytics'; the data is limited to your group's departments.",
          "Filter by unit to compare properties, or by priority to check critical work.",
          "Export the tickets register or technician scorecards as CSV.",
        ],
      },
    ],
  },
  {
    role: "director",
    label: "Director",
    intro: "You see the whole organisation.",
    guides: [
      {
        title: "Executive dashboard",
        icon: "compass",
        summary: "Organisation-wide performance by unit and functional group.",
        steps: [
          "Your dashboard shows total requests, SLA compliance, breaches and escalations, broken down by unit and by functional group.",
          "Click through to 'Full Reports & Analytics' for any period or filter.",
          "You can open and act on any ticket in the organisation.",
        ],
      },
      {
        title: "Board and management reporting",
        icon: "chart",
        summary: "Producing the numbers for meetings.",
        steps: [
          "In 'Reports & Analytics', pick the period (for example year to date) and export the tickets register, technician scorecards or unit summary as CSV.",
          "Long periods such as 'All time' are calculated once and reused for 2 minutes, so repeated views are fast.",
          "Use escalation reasons and hold reasons to see where the organisation loses time.",
        ],
      },
    ],
  },
  {
    role: "admin",
    label: "Administrator",
    intro:
      "You set up the organisation's structure, accounts and service catalogue, and you are the first line of support for other users.",
    guides: [
      {
        title: "Initial setup, in order",
        icon: "layers",
        summary: "Build the structure top-down; each step depends on the one before.",
        steps: [
          "Units & Branches: create each property or branch with a unique code.",
          "Functional Groups: create the cross-unit groups (Group ICT, Group Maintenance, ...). You can set the Group Manager after creating users.",
          "User Directory: create accounts and set roles (see the next guide).",
          "Departments: create each department inside its unit, link it to its functional group, and set its supervisor (head of department) and staff. Staff technicians can work the department's tickets.",
          "Service Categories: group services inside each department and optionally set a category lead.",
          "Issue Types & SLAs: create the raiseable items. For each, set the handling technician, the SLA in hours and the default priority. This is what makes routing automatic.",
          "Escalation Rules: heads of department set their own; check that the defaults suit any department that has not.",
        ],
        troubleshooting: [
          {
            problem: "A ticket went to the wrong person.",
            fix: "Routing uses the issue type's technician, then the category lead, then the department head. Fix the issue type, then reassign the ticket.",
          },
        ],
      },
      {
        title: "Accounts and roles",
        icon: "shield",
        summary: "Creating users and giving them the right access.",
        steps: [
          "In 'User Directory', add one user, use 'Bulk Add', or download the CSV template and 'Upload CSV' for many at once.",
          "Every user is an employee. Add Technician, Head of Department / Manager, General Manager (with the unit they manage), Group Manager, Director or Administrator as needed. Roles add up.",
          "New users receive an email with their sign-in details.",
          "Users cannot change their own roles. To remove access, deactivate the account rather than deleting it, so its ticket history is kept.",
          "If someone forgets their password, ask them to use 'Forgot password' on the login page; the code goes to their work email.",
        ],
      },
      {
        title: "Organisation tickets",
        icon: "briefcase",
        summary: "Oversight of every ticket.",
        steps: [
          "'Organization Tickets' lists every ticket across all units with filters.",
          "You can reassign, re-prioritise, escalate and resolve any ticket.",
          "Only administrators can delete a ticket. Prefer cancelling: deleted tickets disappear from reports.",
        ],
      },
      {
        title: "Keeping the platform running",
        icon: "mail",
        summary: "The background jobs behind emails and automatic escalation.",
        steps: [
          "Emails are sent in the background right after each action, so saving is fast even when the mail service is slow.",
          "Automatic escalation runs as a scheduled job ('run_escalations') every few minutes. If SLA warnings and automatic escalations stop arriving, ask your hosting provider or developer to check that job is running.",
          "Sign-in sessions last 12 hours; this can be changed by the developer with TOKEN_TTL_HOURS and SESSION_MAX_AGE_HOURS.",
        ],
        troubleshooting: [
          {
            problem: "Users say they are not getting emails.",
            fix: "Check the address on their account, ask them to check spam, and ask the developer to check the email service logs (Resend).",
          },
          {
            problem: "A user sees 'Your session has expired' often.",
            fix: "That is expected after 12 hours. If it happens sooner, check the computer's clock is correct.",
          },
        ],
      },
    ],
  },
];

export const FAQS: Faq[] = [
  {
    q: "Can managers, GMs and directors raise tickets for themselves?",
    a: "Yes. Everyone is an employee first. Use 'Raise a Request'; your own tickets are listed separately from the queues you manage.",
    roles: ["universal"],
  },
  {
    q: "Which files can I attach?",
    a: "Images (PNG, JPG, GIF, WEBP), PDF, Word, Excel, PowerPoint, CSV and plain text, up to 15MB each and 10 at a time.",
    roles: ["universal"],
  },
  {
    q: "What does the SLA mean on my ticket?",
    a: "It is the target time to resolve that type of request, set per issue type. The ticket page shows when it is due. Time spent on hold waiting for you, a vendor or parts does not count.",
    roles: ["universal"],
  },
  {
    q: "Why was I signed out?",
    a: "Sessions end automatically 12 hours after you sign in, and whenever you click Sign Out. Sign in again; your saved work is kept.",
    roles: ["universal"],
  },
  {
    q: "How does automatic escalation work?",
    a: "Every few minutes the helpdesk checks open tickets against their department's rules. At the warning threshold (75% by default) the technician is warned. When the SLA runs out, the ticket is escalated, set to Critical and the head of department is emailed. If it is still unresolved after the GM threshold (4 hours by default), the unit's General Manager is emailed. Each alert is sent once per ticket, and on-hold time is not counted.",
    roles: ["technician", "manager", "gm", "group_manager", "director", "admin"],
  },
  {
    q: "Who receives escalation emails?",
    a: "The department's head (or the category lead if the department has none), plus any extra addresses in the department's escalation rules. GM alerts go to the unit's General Manager, or the group manager if the unit has no GM.",
    roles: ["technician", "manager", "gm", "group_manager", "director", "admin"],
  },
  {
    q: "What is the difference between a department and a functional group?",
    a: "A department belongs to one unit (for example IT at Tree Hotel). A functional group links the same kind of department across units (for example Group ICT) under one Group Manager.",
    roles: ["manager", "gm", "group_manager", "director", "admin"],
  },
  {
    q: "What do reports include for me?",
    a: "Exactly the tickets you are allowed to open: heads of department see their departments, GMs their unit, group managers their group, directors and administrators everything.",
    roles: ["manager", "gm", "group_manager", "director", "admin"],
  },
];

export function sectionsFor(roles: Record<GuideRole, boolean>): GuideSection[] {
  return GUIDE_SECTIONS.filter((section) => roles[section.role]);
}

export function faqsFor(roles: Record<GuideRole, boolean>): Faq[] {
  return FAQS.filter((faq) => faq.roles.some((role) => roles[role]));
}

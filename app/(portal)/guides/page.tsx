"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  HelpCircle,
  Search,
  BookOpen,
  LogIn,
  PlusCircle,
  Clock,
  Paperclip,
  Mail,
  Wrench,
  PauseCircle,
  Flag,
  CheckCircle2,
  Briefcase,
  Sliders,
  BarChart3,
  Building2,
  Users2,
  Compass,
  Shield,
  Layers,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";
import {
  faqsFor,
  sectionsFor,
  type Guide,
  type GuideIcon,
  type GuideRole,
} from "@/lib/guides";

const ICONS: Record<GuideIcon, LucideIcon> = {
  login: LogIn,
  plus: PlusCircle,
  clock: Clock,
  paperclip: Paperclip,
  mail: Mail,
  wrench: Wrench,
  pause: PauseCircle,
  flag: Flag,
  check: CheckCircle2,
  briefcase: Briefcase,
  sliders: Sliders,
  chart: BarChart3,
  building: Building2,
  users: Users2,
  compass: Compass,
  shield: Shield,
  layers: Layers,
  alert: AlertTriangle,
};

function matches(guide: Guide, q: string) {
  if (!q) return true;
  const text = [
    guide.title,
    guide.summary,
    ...guide.steps,
    ...(guide.whatHappensNext ?? []),
    ...(guide.troubleshooting ?? []).flatMap((t) => [t.problem, t.fix]),
  ]
    .join(" ")
    .toLowerCase();
  return text.includes(q);
}

function GuideCard({ guide }: { guide: Guide }) {
  const Icon = ICONS[guide.icon] ?? BookOpen;
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:border-primary-blue/40 transition-colors space-y-3">
      <div>
        <div className="flex items-center gap-2 mb-1 text-primary-blue">
          <Icon className="w-5 h-5 shrink-0" />
          <h3 className="text-sm font-semibold text-gray-900">{guide.title}</h3>
        </div>
        <p className="text-xs text-gray-500">{guide.summary}</p>
      </div>

      <ol className="space-y-2 text-xs text-gray-700 list-decimal pl-4 leading-relaxed">
        {guide.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      {guide.whatHappensNext && guide.whatHappensNext.length > 0 && (
        <div className="rounded border border-blue-100 bg-blue-50/50 p-3">
          <p className="text-[11px] font-semibold text-primary-blue uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <ArrowRight className="w-3 h-3" /> What happens next
          </p>
          <ul className="space-y-1 text-xs text-gray-700 list-disc pl-4 leading-relaxed">
            {guide.whatHappensNext.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {guide.troubleshooting && guide.troubleshooting.length > 0 && (
        <div className="rounded border border-amber-100 bg-amber-50/50 p-3">
          <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <LifeBuoy className="w-3 h-3" /> If something goes wrong
          </p>
          <dl className="space-y-2 text-xs leading-relaxed">
            {guide.troubleshooting.map((item, i) => (
              <div key={i}>
                <dt className="font-semibold text-gray-800">{item.problem}</dt>
                <dd className="text-gray-600">{item.fix}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

export default function GuidesHelpPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<GuideRole>("universal");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Each user sees the guides for the roles they hold; administrators see all of them
  const isAdmin = Boolean(user?.is_admin || user?.is_superuser);
  const roles: Record<GuideRole, boolean> = {
    universal: true,
    technician: isAdmin || Boolean(user?.is_technician),
    manager: isAdmin || Boolean(user?.is_manager || user?.is_hod),
    gm: isAdmin || Boolean(user?.is_general_manager),
    group_manager: isAdmin || Boolean(user?.is_group_manager),
    director: isAdmin || Boolean(user?.is_director),
    admin: isAdmin,
  };

  const sections = sectionsFor(roles);
  const faqs = faqsFor(roles);
  const q = searchQuery.trim().toLowerCase();

  // A search looks across every section this user can see
  const activeSection = sections.find((s) => s.role === selectedRole) ?? sections[0];
  const visibleSections = q
    ? sections
        .map((s) => ({ ...s, guides: s.guides.filter((g) => matches(g, q)) }))
        .filter((s) => s.guides.length > 0)
    : activeSection
      ? [activeSection]
      : [];

  const visibleFaqs = q
    ? faqs.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(q))
    : faqs;

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary-blue via-primary-blue/95 to-primary-blue/90 rounded-xl p-6 sm:p-8 text-white shadow-md">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tamarind Help Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Helpdesk Guides</h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Step-by-step guides for the things you do on the helpdesk, what happens after each step, and what to do when something goes wrong. You see the guides for your own roles.
          </p>
        </div>

        <div className="mt-5 max-w-xl relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search guides, e.g. 'on hold', 'password', 'escalation'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-14 py-2.5 bg-white text-gray-900 rounded-lg text-xs outline-none shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-blue-300 transition"
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

      {/* Role tabs (hidden while searching, and when there is only one section) */}
      {!q && sections.length > 1 && (
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-white px-3 pt-2 rounded-t shadow-sm">
          {sections.map((section) => (
            <button
              key={section.role}
              onClick={() => setSelectedRole(section.role)}
              className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeSection?.role === section.role
                  ? "border-primary-blue text-primary-blue"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      )}

      {/* Guides */}
      {visibleSections.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-lg border border-gray-200 text-xs text-gray-500">
          No guides match &ldquo;{searchQuery}&rdquo;. Try another word, or browse the tabs.
        </div>
      ) : (
        visibleSections.map((section) => (
          <section key={section.role} className="space-y-3">
            <div>
              <h2 className="text-sm font-bold text-gray-900">{section.label}</h2>
              <p className="text-xs text-gray-500">{section.intro}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {section.guides.map((guide) => (
                <GuideCard key={guide.title} guide={guide} />
              ))}
            </div>
          </section>
        ))
      )}

      {/* FAQs */}
      {visibleFaqs.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary-blue" />
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-2">
            {visibleFaqs.map((faq, idx) => (
              <div key={faq.q} className="border border-gray-200 rounded-md overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
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
      )}
    </div>
  );
}

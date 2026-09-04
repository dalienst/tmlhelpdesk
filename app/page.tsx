"use client";

import { useState } from "react";
import { 
  LifeBuoy, 
  BookOpen, 
  Clock, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  ChevronDown, 
  Activity
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TicketMock {
  id: string;
  title: string;
  status: "Resolved" | "In Progress" | "Pending Approval";
  technician: string;
  time: string;
  category: string;
}

const MOCK_TICKETS: Record<string, TicketMock> = {
  "TML-1024": {
    id: "TML-1024",
    title: "Network connectivity issue in Server Room B",
    status: "Resolved",
    technician: "John Doe",
    time: "2 hours ago",
    category: "Infrastructure",
  },
  "TML-1025": {
    id: "TML-1025",
    title: "POS Terminal #3 not responding to transactions",
    status: "In Progress",
    technician: "Sarah Smith",
    time: "45 mins ago",
    category: "POS Hardware",
  },
  "TML-1026": {
    id: "TML-1026",
    title: "Request for software license keys for marketing suite",
    status: "Pending Approval",
    technician: "System Admin",
    time: "Just now",
    category: "Software Licensing",
  },
};

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [ticketId, setTicketId] = useState("");
  const [trackedTicket, setTrackedTicket] = useState<TicketMock | null>(null);
  const [trackError, setTrackError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleTrackTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const searchId = ticketId.trim().toUpperCase();
    
    if (MOCK_TICKETS[searchId]) {
      setTrackedTicket(MOCK_TICKETS[searchId]);
      setTrackError("");
    } else {
      setTrackedTicket(null);
      setTrackError(`No active ticket found with reference "${searchId}".`);
    }
  };

  const faqs = [
    {
      question: "How do I raise a new support ticket?",
      answer: "Log into the portal using your employee credentials, navigate to the Dashboard, and click on 'New Ticket'. Provide details of your issue, assign a category, and our support team will be immediately notified."
    },
    {
      question: "What is the standard resolution SLA?",
      answer: "Standard resolution times depend on ticket severity: Critical issues (such as POS terminal downtime) are addressed within 1 hour; High-severity issues within 4 hours; and general inquiries within 24 hours."
    },
    {
      question: "Who can view my support tickets?",
      answer: "Only you, your HOD, and assigned technicians can view the details and progress of your support tickets to ensure privacy and security."
    },
    {
      question: "How do I update my profile details?",
      answer: "Go to your account settings in the top-right menu once logged in, where you can modify your personal details and review your role assignments."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo2.png" alt="Tamarind Logo" width={36} height={36} className="object-contain" />
            <div>
              <span className="font-semibold text-base text-primary-blue tracking-tight block leading-none">TAMARIND</span>
              <span className="text-[10px] tracking-wider text-gray-500 font-semibold uppercase">Helpdesk System</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-xs text-gray-600 hover:text-primary-blue transition-colors">Features</a>
            <a href="#tracking" className="text-xs text-gray-600 hover:text-primary-blue transition-colors">Track Ticket</a>
            <a href="#faq" className="text-xs text-gray-600 hover:text-primary-blue transition-colors">Support FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="text-xs font-semibold text-primary-blue hover:text-primary-red transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden border-b border-gray-100">
        <div className="mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Copy */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-primary-red/10 text-primary-red mb-4">
              <Activity className="w-3.5 h-3.5" />
              Tamarind Group Service Hub
            </span>
            <h1 className="text-xl font-semibold tracking-tight text-gray-900 leading-snug mb-3">
              Intelligent Support For Operations & Staff
            </h1>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Streamline enterprise assistance across all branches and functional units. Log issues, route requests to designated technicians, and maintain accountability in real-time.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link 
                href="/login" 
                className="w-full sm:w-auto px-5 py-2.5 bg-primary-blue hover:bg-primary-blue/90 text-white rounded text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                Access Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="#tracking" 
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                Track Ticket Status
              </a>
            </div>

            {/* Quick Metrics Strip */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-6">
              <div>
                <span className="block text-lg font-semibold text-primary-blue">99.8%</span>
                <span className="text-[11px] text-gray-500">Service Uptime</span>
              </div>
              <div className="w-px h-6 bg-gray-200" />
              <div>
                <span className="block text-lg font-semibold text-primary-red">10m</span>
                <span className="text-[11px] text-gray-500">Avg Response Time</span>
              </div>
              <div className="w-px h-6 bg-gray-200" />
              <div>
                <span className="block text-lg font-semibold text-gray-900">100%</span>
                <span className="text-[11px] text-gray-500">Secure Audit Trail</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Dashboard Mockup */}
          <div className="lg:col-span-6 w-full">
            <div className="relative bg-gray-950 rounded p-5 shadow-xl border border-gray-800">
              {/* Mockup Header bar */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs font-semibold text-gray-400">helpdesk-v1.4</span>
                </div>
                <span className="text-xs text-gray-500">Support Console</span>
              </div>

              {/* Mockup Layout contents */}
              <div className="space-y-3">
                <div className="bg-primary-blue/20 border border-primary-blue/40 rounded p-2.5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary-blue animate-pulse" />
                    <span className="text-xs text-gray-300 font-semibold">System Status: Normal</span>
                  </div>
                  <span className="text-[10px] bg-primary-red/20 text-primary-red px-2 py-0.5 rounded font-semibold">Technicians Online</span>
                </div>

                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mt-3">Active Support Queue</span>
                
                <div className="space-y-2">
                  <div className="bg-gray-900 border border-gray-800 rounded p-3 flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-semibold text-primary-red uppercase tracking-wider block mb-0.5">POS Hardware</span>
                      <h4 className="text-xs font-semibold text-gray-200">POS Terminal #3 Offline</h4>
                      <span className="text-[10px] text-gray-500">Raised by: Manager Room 3 • 45m ago</span>
                    </div>
                    <span className="text-[10px] font-semibold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">In Progress</span>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded p-3 flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-semibold text-primary-blue uppercase tracking-wider block mb-0.5">Infrastructure</span>
                      <h4 className="text-xs font-semibold text-gray-200">Main Server Connection Timeout</h4>
                      <span className="text-[10px] text-gray-500">Assigned: Sys Admin • 2h ago</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">Resolved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-12 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight mb-2">Core System Capabilities</h2>
            <p className="text-xs text-gray-500">Built to provide quick support resolution and easily referenceable workflow directories.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 p-4 rounded shadow-sm">
              <div className="w-9 h-9 rounded bg-primary-blue/10 text-primary-blue flex items-center justify-center mb-3">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Fast Ticket Desk</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Log and assign operational tasks directly to our technical support team in real-time.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded shadow-sm">
              <div className="w-9 h-9 rounded bg-primary-red/10 text-primary-red flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Knowledge Base</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Quickly browse troubleshooting manuals and documentation to resolve common issues.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded shadow-sm">
              <div className="w-9 h-9 rounded bg-primary-blue/10 text-primary-blue flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">SLA Management</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Automated reminders and escalation triggers help keep technician response targets aligned.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded shadow-sm">
              <div className="w-9 h-9 rounded bg-primary-red/10 text-primary-red flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Team Routing</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Smart dispatch algorithms assign requests to available technicians on shift.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Tracking Widget */}
      <section id="tracking" className="py-12 bg-primary-blue text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Track Service Ticket Status</h2>
          <p className="text-xs text-gray-300 max-w-xl mx-auto mb-6">
            Enter your ticket reference code below to view current assignment and resolution stage.
          </p>

          <form onSubmit={handleTrackTicket} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mb-4">
            <div className="relative flex-grow">
              <input
                type="text"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="Enter Ticket ID (e.g. TML-1025)"
                className="w-full bg-white/10 focus:bg-white text-white focus:text-gray-900 border border-white/20 rounded px-3 py-2 pl-9 text-xs outline-none transition-all placeholder:text-gray-300"
                required
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="bg-primary-red hover:bg-primary-red/90 text-white font-semibold text-xs px-4 py-2 rounded transition-all shrink-0"
            >
              Track Status
            </button>
          </form>

          {hasSearched && (
            <div className="mt-4 text-left">
              {trackedTicket ? (
                <div className="bg-white/10 border border-white/15 rounded p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-3 mb-3">
                    <div>
                      <span className="text-[10px] text-gray-300 font-semibold uppercase block">Ticket Ref</span>
                      <span className="font-semibold text-base">{trackedTicket.id}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-300 font-semibold uppercase block">Category</span>
                      <span className="text-xs font-semibold text-gray-200">{trackedTicket.category}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-300 font-semibold uppercase block">Status</span>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold mt-0.5 bg-emerald-500/25 text-emerald-300 border border-emerald-500/30">
                        {trackedTicket.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-300 font-semibold block">Incident Title</span>
                      <p className="text-gray-100 font-semibold">{trackedTicket.title}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-300 font-semibold block">Assigned Technician</span>
                      <p className="text-gray-100 font-semibold">{trackedTicket.technician}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-primary-red/20 border border-primary-red/30 rounded p-3 flex items-start gap-2 max-w-md mx-auto">
                  <AlertCircle className="w-4 h-4 text-primary-red shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-200">{trackError}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faq" className="py-12 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight mb-1">Frequently Asked Questions</h2>
            <p className="text-xs text-gray-500">Quick answers to common inquiries about support workflows.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs text-gray-800 hover:text-primary-blue transition-colors focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-primary-blue" : ""}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-100 py-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary-blue flex items-center justify-center text-[10px] font-semibold text-white">T</div>
            <span className="text-xs font-semibold text-gray-500">&copy; 2026 Tamarind Group Helpdesk. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <a href="#faq" className="hover:text-primary-blue transition-colors">Privacy Policy</a>
            <a href="#faq" className="hover:text-primary-blue transition-colors">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

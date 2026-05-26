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
  Lock, 
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
  // State for FAQ Accordion
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // State for Ticket Tracking Widget
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
      question: "Who can access standard operating procedures (SOPs)?",
      answer: "All authorized staff, trainers, managers, and system administrators can browse and download SOP documentation directly from the portal’s shared knowledge base."
    },
    {
      question: "How do I update my profile details?",
      answer: "Go to your account settings in the top-right menu once logged in, where you can modify your preferred username, bio, and review your role assignments."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Custom Brand Logo */}
            {/* <div className="w-9 h-9 rounded-lg bg-primaryBlue flex items-center justify-center relative overflow-hidden shadow-md"> */}
              <Image src="/logo.png" alt="logo" width={35} height={35} />
              {/* <span className="text-white font-bold text-lg select-none">T</span> */}
              {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-primaryRed rounded-tl-full" /> */}
            {/* </div> */}
            <div>
              <span className="font-bold text-lg text-primaryBlue tracking-tight block leading-none">TAMARIND</span>
              <span className="text-[10px] tracking-wider text-gray-500 font-bold uppercase">Helpdesk System</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-regular text-gray-600 hover:text-primaryBlue transition-colors">Features</a>
            <a href="#tracking" className="text-sm font-regular text-gray-600 hover:text-primaryBlue transition-colors">Track Ticket</a>
            <a href="#faq" className="text-sm font-regular text-gray-600 hover:text-primaryBlue transition-colors">Support FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-bold text-primaryBlue hover:text-primaryRed transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/login" 
              className="bg-primaryBlue hover:bg-primaryBlue/90 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              Support Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden border-b border-gray-100">
        {/* Abstract Background Accents */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primaryBlue/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-primaryRed/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primaryRed/10 text-primaryRed mb-6">
              <Activity className="w-3.5 h-3.5" />
              Tamarind Group Service Hub
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
              Intelligent Support <br />
              <span className="text-primaryBlue">For Operations & Staff</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 font-regular leading-relaxed mb-8">
              Welcome to the central helpdesk and SOP repository. Seamlessly track incidents, check resolution statuses, and access official standard operating procedures for all Tamarind entities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/login"
                className="bg-primaryBlue hover:bg-primaryBlue/95 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-primaryBlue/20 flex items-center justify-center gap-2 group active:scale-95"
              >
                Log In to Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#tracking"
                className="border border-gray-200 hover:border-primaryBlue/30 text-gray-700 hover:text-primaryBlue font-bold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Track Support Ticket
              </a>
            </div>

            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-100 w-full">
              <div>
                <span className="block text-2xl font-bold text-primaryBlue">99.4%</span>
                <span className="text-xs font-regular text-gray-500">SLA Resolution</span>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <span className="block text-2xl font-bold text-primaryRed">10m</span>
                <span className="text-xs font-regular text-gray-500">Avg Response Time</span>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <span className="block text-2xl font-bold text-gray-900">20+</span>
                <span className="text-xs font-regular text-gray-500">Standard SOPs Ready</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Dashboard Mockup */}
          <div className="lg:col-span-6 w-full">
            <div className="relative bg-gray-950 rounded-2xl p-6 shadow-2xl border border-gray-800">
              
              {/* Mockup Header bar */}
              <div className="flex items-center justify-between border-b border-gray-850 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs font-bold text-gray-400">helpdesk-v1.4.3</span>
                </div>
                <span className="text-xs text-gray-500 font-regular">SOP & Ticket Portal</span>
              </div>

              {/* Mockup Layout contents */}
              <div className="space-y-4">
                {/* Active user status tag */}
                <div className="bg-primaryBlue/20 border border-primaryBlue/40 rounded-xl p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primaryBlue animate-pulse" />
                    <span className="text-xs text-gray-300 font-bold">System Status: Normal</span>
                  </div>
                  <span className="text-[10px] font-regular bg-primaryRed/20 text-primaryRed px-2.5 py-0.5 rounded-full font-bold">Technicians Online</span>
                </div>

                {/* Simulated list of tickets */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mt-4">Active Support Queue</span>
                
                <div className="space-y-2.5">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-3.5 flex justify-between items-start hover:border-gray-700 transition-colors">
                    <div>
                      <span className="text-[10px] font-bold text-primaryRed uppercase tracking-wider block mb-1">POS Hardware</span>
                      <h4 className="text-xs font-bold text-gray-200">POS Terminal #3 Offline</h4>
                      <span className="text-[10px] font-regular text-gray-500">Raised by: Manager Room 3 • 45m ago</span>
                    </div>
                    <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-md">In Progress</span>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-3.5 flex justify-between items-start hover:border-gray-700 transition-colors">
                    <div>
                      <span className="text-[10px] font-bold text-primaryBlue uppercase tracking-wider block mb-1">Infrastructure</span>
                      <h4 className="text-xs font-bold text-gray-200">Main Server Connection Timeout</h4>
                      <span className="text-[10px] font-regular text-gray-500">Assigned: Sys Admin • 2h ago</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md">Resolved</span>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-3.5 flex justify-between items-start hover:border-gray-700 transition-colors">
                    <div>
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">Software Licensing</span>
                      <h4 className="text-xs font-bold text-gray-200">Marketing Tool License Access</h4>
                      <span className="text-[10px] font-regular text-gray-500">Awaiting: HOD Approval • 5m ago</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">Awaiting HOD</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">Core System Capabilities</h2>
            <p className="text-base text-gray-500 font-regular">Built to provide quick support resolution and easily referenceable workflow directories.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white border border-gray-150 p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primaryBlue/10 text-primaryBlue flex items-center justify-center mb-6 group-hover:bg-primaryBlue group-hover:text-white transition-colors">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Fast Ticket Desk</h3>
              <p className="text-xs font-regular text-gray-500 leading-relaxed">
                Log and assign operational tasks directly to our technical support team in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-gray-150 p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primaryRed/10 text-primaryRed flex items-center justify-center mb-6 group-hover:bg-primaryRed group-hover:text-white transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">SOP & Guidelines</h3>
              <p className="text-xs font-regular text-gray-500 leading-relaxed">
                Instantly search and reference standard operating procedures to manage routine workflows.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-gray-150 p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primaryBlue/10 text-primaryBlue flex items-center justify-center mb-6 group-hover:bg-primaryBlue group-hover:text-white transition-colors">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">SLA Management</h3>
              <p className="text-xs font-regular text-gray-500 leading-relaxed">
                Automated reminders and escalation triggers help keep technician response targets aligned.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border border-gray-150 p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primaryRed/10 text-primaryRed flex items-center justify-center mb-6 group-hover:bg-primaryRed group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Role Management</h3>
              <p className="text-xs font-regular text-gray-500 leading-relaxed">
                Dedicated interfaces for Employees, Managers, Trainers, HODs, and Admin staff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Tracking Widget */}
      <section id="tracking" className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-gradient-to-r from-primaryBlue to-primaryBlue/90 rounded-3xl p-8 md:p-12 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-10 translate-x-10 w-64 h-64 bg-white/5 rounded-full blur-2xl" />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-primaryRed bg-white px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-4">
                Real-time Tracking
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Quick Ticket Status Lookup</h2>
              <p className="text-sm text-gray-200 font-regular mb-8">
                Enter your ticket reference ID (e.g., TML-1024, TML-1025) to immediately check resolution progress.
              </p>

              <form onSubmit={handleTrackTicket} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                    placeholder="Enter Ticket ID (e.g. TML-1025)"
                    className="w-full bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-gray-900 border border-white/20 focus:border-white rounded-xl py-3 pl-11 pr-4 text-sm font-regular outline-none transition-all placeholder:text-gray-300 focus:placeholder:text-gray-400"
                    required
                  />
                  <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-300 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="bg-primaryRed hover:bg-primaryRed/90 active:scale-95 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shrink-0"
                >
                  Track Status
                </button>
              </form>

              {/* Tracking Results Area */}
              {hasSearched && (
                <div className="mt-8 border-t border-white/15 pt-6 text-left animate-fade-in">
                  {trackedTicket ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4 mb-4">
                        <div>
                          <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider block">Ticket Ref</span>
                          <span className="font-bold text-lg">{trackedTicket.id}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider block text-left sm:text-right">Category</span>
                          <span className="text-sm font-bold text-gray-200">{trackedTicket.category}</span>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider block">Status</span>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                            trackedTicket.status === "Resolved" 
                              ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/30"
                              : trackedTicket.status === "In Progress"
                              ? "bg-amber-500/25 text-amber-300 border border-amber-500/30"
                              : "bg-purple-500/25 text-purple-300 border border-purple-500/30"
                          }`}>
                            {trackedTicket.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-regular">
                        <div>
                          <span className="text-[10px] text-gray-300 font-bold block">Incident Title</span>
                          <p className="text-gray-100 font-bold mt-0.5">{trackedTicket.title}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-300 font-bold block">Assigned Technician</span>
                          <p className="text-gray-100 font-bold mt-0.5">{trackedTicket.technician}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[10px] text-gray-300 font-bold block">Last Update</span>
                          <p className="text-gray-100 font-bold mt-0.5">{trackedTicket.time}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-primaryRed/15 border border-primaryRed/30 rounded-2xl p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-primaryRed shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-100">Tracking Error</h4>
                        <p className="text-xs text-gray-300 font-regular mt-1">{trackError}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faq" className="py-20 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 font-regular">Quick answers to common inquiries about support workflows.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm md:text-base text-gray-800 hover:text-primaryBlue transition-colors focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-primaryBlue" : ""}`} />
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-40 border-t border-gray-100" : "max-h-0"
                    }`}
                  >
                    <p className="p-5 text-xs md:text-sm font-regular text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primaryBlue flex items-center justify-center text-[10px] font-bold text-white">T</div>
            <span className="text-xs font-bold text-gray-500">© 2026 Tamarind Group Helpdesk. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-regular text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              SOP Database Online
            </span>
            <div className="w-px h-3 bg-gray-200" />
            <a href="#faq" className="hover:text-primaryBlue transition-colors">Privacy Policy</a>
            <a href="#faq" className="hover:text-primaryBlue transition-colors">Terms of Use</a>
          </div>

        </div>
      </footer>

    </div>
  );
}


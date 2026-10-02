"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  LayoutDashboard,
  Building2,
  Layers,
  Settings,
  LogOut,
  ChevronRight,
  Loader2,
  Ticket,
  Users,
  Users2,
  FolderTree,
  ListTree,
  Plus,
  PlusCircle,
  HelpCircle,
  BarChart3,
  ShieldAlert,
  Compass,
  PanelLeftClose,
  PanelLeft,
  ChevronLeft,
} from "lucide-react";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Desktop sidebar open by default, closed by default on mobile
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  const isAdmin = session?.user?.is_admin || session?.user?.is_superuser;
  const isDirector = session?.user?.is_director;
  const isGeneralManager = session?.user?.is_general_manager;
  const isGroupManager = session?.user?.is_group_manager;
  const isManager = session?.user?.is_manager || session?.user?.is_hod;
  const isTechnician = session?.user?.is_technician;
  const isEmployee = session?.user?.is_employee;

  const rolePrefix = isAdmin
    ? "admin"
    : isDirector
      ? "director"
      : isGeneralManager
        ? "gm"
        : isGroupManager
          ? "group-manager"
          : isTechnician
            ? "technician"
            : isManager
              ? "manager"
              : isEmployee
                ? "employee"
                : "portal";

  const roleTitle = isAdmin
    ? "System Administrator"
    : isDirector
      ? "Executive Director"
      : isGeneralManager
        ? "General Manager"
        : isGroupManager
          ? "Group Operations Manager"
          : isManager
            ? "Department Manager"
            : isTechnician
              ? "Support Technician"
              : "Staff Employee";

  // Section 1: Core Navigation
  const coreNavItems = [
    {
      name: "Dashboard",
      href: `/${rolePrefix}/dashboard`,
      icon: LayoutDashboard,
      show: true,
    },
    {
      name: "Raise a Request",
      href: `/tickets/new`,
      icon: PlusCircle,
      show: true,
    },
    {
      name: "Organization Tickets",
      href: `/admin/tickets`,
      icon: Ticket,
      show: Boolean(isAdmin),
    },
  ];

  // Section 2: Administration & Catalog Configuration (Admin only)
  const adminNavItems = [
    {
      name: "Units & Branches",
      href: `/admin/units`,
      icon: Building2,
      show: Boolean(isAdmin),
    },
    {
      name: "Functional Groups",
      href: `/admin/groups`,
      icon: Users2,
      show: Boolean(isAdmin),
    },
    {
      name: "Departments",
      href: `/admin/departments`,
      icon: Layers,
      show: Boolean(isAdmin),
    },
    {
      name: "Service Categories",
      href: `/admin/categories`,
      icon: FolderTree,
      show: Boolean(isAdmin),
    },
    {
      name: "Issue Types & SLAs",
      href: `/admin/issues`,
      icon: ListTree,
      show: Boolean(isAdmin),
    },
    {
      name: "User Directory",
      href: `/admin/users`,
      icon: Users,
      show: Boolean(isAdmin),
    },
  ];

  // Section 3: Leadership & Executive Views
  const leadershipNavItems = [
    {
      name: "Director Executive Dashboard",
      href: `/director/dashboard`,
      icon: Compass,
      show: Boolean(isAdmin || isDirector),
    },
    {
      name: "GM Property Dashboard",
      href: `/gm/dashboard`,
      icon: Building2,
      show: Boolean(isAdmin || isGeneralManager),
    },
    {
      name: "Group Operations Dashboard",
      href: `/group-manager/dashboard`,
      icon: Users2,
      show: Boolean(isAdmin || isGroupManager),
    },
    {
      name: "Escalation Rules",
      href: `/manager/escalations`,
      icon: ShieldAlert,
      show: Boolean(isAdmin || isManager),
    },
  ];

  // Section 4: Intelligence & Help
  const utilityNavItems = [
    {
      name: "Reports & Analytics",
      href: `/reports`,
      icon: BarChart3,
      show: Boolean(isAdmin || isManager || isDirector || isGeneralManager || isGroupManager),
    },
    {
      name: "Guides & Help Center",
      href: `/guides`,
      icon: HelpCircle,
      show: true,
    },
    {
      name: "Settings",
      href: `/${rolePrefix}/settings`,
      icon: Settings,
      show: true,
    },
  ];

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-blue" />
      </div>
    );
  }

  const renderNavLink = (item: { name: string; href: string; icon: any }) => {
    const isActive = pathname === item.href || (item.href !== `/${rolePrefix}/dashboard` && pathname?.startsWith(item.href + "/"));
    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group border",
          isActive
            ? "bg-primary-blue text-white border-primary-blue shadow-xs"
            : "text-gray-600 border-transparent hover:bg-gray-100/80 hover:text-gray-900"
        )}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "w-6 h-6 rounded flex items-center justify-center transition-all",
              isActive
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-primary-blue"
            )}
          >
            <item.icon className="w-3.5 h-3.5" />
          </div>
          <span className="truncate">{item.name}</span>
        </div>
        <ChevronRight
          className={cn(
            "w-3.5 h-3.5 transition-all shrink-0",
            isActive
              ? "opacity-100 translate-x-0 text-white"
              : "opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 text-gray-400"
          )}
        />
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/60 flex">
      {/* Mobile Backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs z-40 transition-opacity animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern Sidebar (Persistent on Desktop, Slide-over on Mobile) */}
      <aside
        className={cn(
          "bg-white border-r border-gray-200/80 z-50 flex flex-col transition-all duration-300 ease-in-out shrink-0",
          isMobile
            ? cn(
                "fixed top-0 bottom-0 left-0 w-72 shadow-2xl",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              )
            : cn(
                "sticky top-0 h-screen",
                sidebarOpen ? "w-64" : "w-0 overflow-hidden border-r-0"
              )
        )}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <Link
            href={`/${rolePrefix}/dashboard`}
            className="flex items-center gap-2.5 group transition-transform hover:scale-[1.01]"
          >
            <Image
              src="/logo2.png"
              alt="Tamarind Logo"
              width={30}
              height={30}
              className="object-contain"
            />
            <div>
              <span className="text-sm font-bold text-primary-blue tracking-tight block leading-none">
                TAMARIND
              </span>
              <span className="text-[9px] tracking-wider text-gray-500 font-semibold uppercase">
                Helpdesk Portal
              </span>
            </div>
          </Link>

          {/* Close / Collapse button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
            title={isMobile ? "Close Menu" : "Collapse Sidebar"}
          >
            {isMobile ? <X className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Card in Sidebar */}
        <div className="p-3.5 bg-gray-50/70 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0",
                isAdmin
                  ? "bg-admin-purple"
                  : isDirector
                    ? "bg-purple-700"
                    : isGeneralManager
                      ? "bg-emerald-600"
                      : isGroupManager
                        ? "bg-primary-blue"
                        : isManager
                          ? "bg-manager-orange"
                          : isTechnician
                            ? "bg-technician-green"
                            : "bg-employee-blue"
              )}
            >
              {session?.user?.first_name?.[0] || "U"}
              {session?.user?.last_name?.[0] || ""}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-gray-900 text-xs font-bold truncate">
                {session?.user?.first_name} {session?.user?.last_name}
              </p>
              <span
                className={cn(
                  "inline-block text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded border mt-0.5 truncate max-w-full",
                  isAdmin
                    ? "text-admin-purple bg-admin-purple/10 border-admin-purple/20"
                    : isDirector
                      ? "text-purple-700 bg-purple-50 border-purple-200"
                      : isGeneralManager
                        ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                        : isGroupManager
                          ? "text-blue-700 bg-blue-50 border-blue-200"
                          : isManager
                            ? "text-manager-orange bg-manager-orange/10 border-manager-orange/20"
                            : isTechnician
                              ? "text-technician-green bg-technician-green/10 border-technician-green/20"
                              : "text-employee-blue bg-employee-blue/10 border-employee-blue/20"
                )}
              >
                {roleTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Main Modules */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5 px-2">
              Main Navigation
            </span>
            <div className="space-y-0.5">
              {coreNavItems.filter((i) => i.show).map(renderNavLink)}
            </div>
          </div>

          {/* Administration & Catalog */}
          {adminNavItems.some((i) => i.show) && (
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5 px-2">
                Administration & Setup
              </span>
              <div className="space-y-0.5">
                {adminNavItems.filter((i) => i.show).map(renderNavLink)}
              </div>
            </div>
          )}

          {/* Leadership & Executive Tiers */}
          {leadershipNavItems.some((i) => i.show) && (
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5 px-2">
                Management & Tiers
              </span>
              <div className="space-y-0.5">
                {leadershipNavItems.filter((i) => i.show).map(renderNavLink)}
              </div>
            </div>
          )}

          {/* Intelligence & Support */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5 px-2">
              Intelligence & Help
            </span>
            <div className="space-y-0.5">
              {utilityNavItems.filter((i) => i.show).map(renderNavLink)}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full py-2 bg-primary-red/10 hover:bg-primary-red text-primary-red hover:text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-primary-red/20 shadow-2xs group"
          >
            <LogOut className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 hover:text-primary-blue transition shadow-2xs flex items-center justify-center"
              title={sidebarOpen ? "Collapse sidebar" : "Open sidebar"}
            >
              {sidebarOpen && !isMobile ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>

            {/* Quick Context Title */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="font-semibold text-gray-800">Tamarind Operations</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 font-medium">Enterprise Helpdesk</span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/tickets/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-blue hover:bg-primary-blue/95 text-white rounded-lg text-xs font-semibold transition shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Raise Request</span>
            </Link>

            {/* User Profile Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-2xs",
                  isAdmin
                    ? "bg-admin-purple"
                    : isDirector
                      ? "bg-purple-700"
                      : isGeneralManager
                        ? "bg-emerald-600"
                        : isGroupManager
                          ? "bg-primary-blue"
                          : isManager
                            ? "bg-manager-orange"
                            : isTechnician
                              ? "bg-technician-green"
                              : "bg-employee-blue"
                )}
              >
                {session?.user?.first_name?.[0] || "U"}
              </div>
              <div className="hidden md:flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-gray-800">
                  {session?.user?.first_name} {session?.user?.last_name}
                </span>
                <span className="text-[9px] text-gray-400 font-medium truncate max-w-[130px]">
                  {roleTitle}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-3 sm:p-5 lg:p-7 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>

        {/* Subtle Footer */}
        <footer className="border-t border-gray-200/80 py-4 px-6 text-center text-gray-400 text-[10px] font-medium uppercase tracking-wider bg-white/50">
          &copy; {new Date().getFullYear()} Tamarind Group • Enterprise Helpdesk Platform
        </footer>
      </div>
    </div>
  );
}

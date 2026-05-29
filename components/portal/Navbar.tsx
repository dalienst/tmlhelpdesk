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
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  Loader2
} from "lucide-react";

// Utility for class merging
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Determine user role
  const isAdmin = session?.user?.is_admin || session?.user?.is_superuser;
  const isManager = session?.user?.is_manager;
  const isTechnician = session?.user?.is_technician;
  const isEmployee = session?.user?.is_employee;

  const rolePrefix = isAdmin
    ? "admin"
    : isManager
      ? "manager"
      : isTechnician
        ? "technician"
        : isEmployee
          ? "employee"
          : "portal";

  // Sidebar items based on boolean flags rather than arrays
  const navItems = [
    { 
      name: "Dashboard", 
      href: `/${rolePrefix}/dashboard`, 
      icon: LayoutDashboard, 
      show: isAdmin || isManager || isTechnician || isEmployee 
    },
    { 
      name: "Users", 
      href: `/${rolePrefix}/users`, 
      icon: Users, 
      show: isAdmin 
    },
    { 
      name: "Settings", 
      href: `/${rolePrefix}/settings`, 
      icon: Settings, 
      show: isAdmin || isManager || isTechnician || isEmployee 
    },
  ];

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-blue" />
      </div>
    );
  }

  return (
    <>
      {/* Top Navbar */}
      <nav className="sticky top-0 w-full z-40 bg-white border-b border-gray-200 py-3 pr-4 md:pr-8 pl-4 md:pl-6 shadow-sm">
        <div className="mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link
            href={`/${rolePrefix}/dashboard`}
            className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95"
          >
            <Image
              src="/logo2.png"
              alt="Tamarind Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div>
              <span className="text-textBold text-primary-blue text-lg tracking-tight block leading-none">TAMARIND</span>
              <span className="text-[10px] tracking-wider text-gray-500 text-textBold uppercase">Helpdesk Portal</span>
            </div>
          </Link>

          {/* Controls & Nav */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm text-textBold text-gray-800 leading-none">
                {session?.user?.first_name} {session?.user?.last_name}
              </span>
              <span className={cn(
                "text-[10px] text-textBold uppercase mt-1.5 px-3 py-1 rounded-md border shadow-sm",
                isAdmin
                  ? "text-admin-purple bg-admin-purple/10 border-admin-purple/20"
                  : isManager
                    ? "text-manager-orange bg-manager-orange/10 border-manager-orange/20"
                    : isTechnician
                      ? "text-technician-green bg-technician-green/10 border-technician-green/20"
                      : "text-employee-blue bg-employee-blue/10 border-employee-blue/20"
              )}>
                {isAdmin ? "System Administrator" : isManager ? "Department Manager" : isTechnician ? "Support Technician" : "Staff Employee"}
              </span>
            </div>

            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-gray-500 hover:text-primary-blue hover:bg-primary-blue/5 transition-all border border-gray-200 hover:border-primary-blue/30 shadow-sm group bg-white"
            >
              <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300",
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setMenuOpen(false)}
      />

      {/* Side Menu Drawer */}
      <aside
        className={cn(
          "fixed right-0 top-0 h-full w-[320px] bg-white z-[70] shadow-2xl transform transition-transform duration-500 border-l border-gray-200 flex flex-col",
          menuOpen ? "translate-x-0" : "translate-x-full",
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <Image
              src="/logo2.png"
              alt="Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-textBold text-primary-blue text-base">Menu</span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors border border-transparent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Section */}
        <div className="p-5 bg-gray-50/80 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-white text-lg text-textBold border shadow-md transition-transform hover:scale-105 shrink-0",
              isAdmin
                ? "bg-admin-purple border-admin-purple/20 shadow-admin-purple/20"
                : isManager
                  ? "bg-manager-orange border-manager-orange/20 shadow-manager-orange/20"
                  : isTechnician
                    ? "bg-technician-green border-technician-green/20 shadow-technician-green/20"
                    : "bg-employee-blue border-employee-blue/20 shadow-employee-blue/20"
            )}>
              {session?.user?.first_name?.[0] || 'U'}
              {session?.user?.last_name?.[0] || ''}
            </div>
            <div className="overflow-hidden">
              <p className="text-gray-900 text-base text-textBold truncate">
                {session?.user?.first_name} {session?.user?.last_name}
              </p>
              <p className="text-xs text-textRegular text-gray-500 truncate mb-1.5">
                {session?.user?.email}
              </p>
              <div className="flex flex-wrap gap-2">
                <div className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-md border",
                  isAdmin
                    ? "bg-admin-purple/10 border-admin-purple/20 text-admin-purple"
                    : isManager
                      ? "bg-manager-orange/10 border-manager-orange/20 text-manager-orange"
                      : isTechnician
                        ? "bg-technician-green/10 border-technician-green/20 text-technician-green"
                        : "bg-employee-blue/10 border-employee-blue/20 text-employee-blue"
                )}>
                  <span className="text-[10px] text-textBold uppercase">
                    {isAdmin ? "Admin" : isManager ? "Manager" : isTechnician ? "Technician" : "Employee"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <span className="text-[11px] text-textBold text-gray-400 uppercase tracking-wider block mb-3 px-1">
            System Modules
          </span>
          {navItems
            .filter((item) => item.show)
            .map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-3 rounded-xl text-sm transition-all group border",
                    isActive
                      ? "bg-primary-blue text-white border-primary-blue shadow-md shadow-primary-blue/20 text-textBold"
                      : "text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-900 hover:border-gray-200 text-textRegular"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:scale-110",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-primary-blue group-hover:shadow-sm"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                    </div>
                    {item.name}
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 transition-all",
                      isActive 
                        ? "opacity-100 translate-x-0" 
                        : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-gray-400"
                    )}
                  />
                </Link>
              );
            })}
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full py-3.5 bg-primary-red/10 hover:bg-primary-red text-primary-red hover:text-white rounded-xl text-sm text-textBold flex items-center justify-center gap-2 transition-all border border-primary-red/20 shadow-sm hover:shadow-md hover:shadow-primary-red/20 group"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Sign Out Securely
          </button>
        </div>
      </aside>

    </>
  );
}
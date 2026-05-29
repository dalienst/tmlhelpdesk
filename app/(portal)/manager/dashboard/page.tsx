"use client";

import { Briefcase, Users, FileCheck, CheckCircle2, AlertTriangle, ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";

export default function ManagerDashboard() {
  const pendingApprovals = [
    { id: "REQ-2041", employee: "Sarah Jenkins", request: "New MacBook Pro M2", date: "2 hours ago" },
    { id: "REQ-2038", employee: "David Chen", request: "Access to Production Database", date: "5 hours ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-textBold text-gray-900 tracking-tight">Department Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Manage approvals and oversee your team's IT requests.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-manager-orange/10 flex items-center justify-center text-manager-orange">
              <FileCheck className="w-5 h-5" />
            </div>
            <span className="bg-red-50 text-red-600 text-[10px] text-textBold px-2 py-0.5 rounded-full uppercase tracking-wide">Action Required</span>
          </div>
          <div className="mt-4">
            <p className="text-3xl text-textBold text-gray-900 leading-none">2</p>
            <p className="text-sm text-gray-500 text-textBold mt-1">Pending Approvals</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl text-textBold text-gray-900 leading-none">14</p>
            <p className="text-sm text-gray-500 text-textBold mt-1">Team Open Tickets</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl text-textBold text-gray-900 leading-none">89%</p>
            <p className="text-sm text-gray-500 text-textBold mt-1">Resolution Rate</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl text-textBold text-gray-900 leading-none">1</p>
            <p className="text-sm text-gray-500 text-textBold mt-1">Escalated Tickets</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg text-textBold text-gray-900">Requires Your Approval</h2>
          </div>
          <div className="p-2 flex-grow">
            {pendingApprovals.map(approval => (
              <div key={approval.id} className="p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 mb-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-textBold text-gray-900">{approval.request}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{approval.employee}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="text-xs text-gray-400">{approval.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs text-textBold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Deny</button>
                    <button className="px-3 py-1.5 text-xs text-textBold text-white bg-manager-orange hover:bg-manager-orange/90 rounded-lg transition-colors shadow-sm">Approve</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Activity */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg text-textBold text-gray-900">Recent Team Activity</h2>
          </div>
          <div className="p-5 flex flex-col gap-5">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs text-textBold shrink-0">MK</div>
              <div>
                <p className="text-sm text-gray-800"><span className="text-textBold">Michael Kip</span> submitted a ticket: <span className="italic">"Cannot access VPN"</span></p>
                <p className="text-xs text-gray-400 mt-0.5">10 minutes ago</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs text-textBold shrink-0">JL</div>
              <div>
                <p className="text-sm text-gray-800"><span className="text-textBold">Jane Limo</span>'s ticket was resolved: <span className="italic">"Monitor replacement"</span></p>
                <p className="text-xs text-gray-400 mt-0.5">2 hours ago</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs text-textBold shrink-0">SO</div>
              <div>
                <p className="text-sm text-gray-800"><span className="text-textBold">Steve Omondi</span> requested software installation.</p>
                <p className="text-xs text-gray-400 mt-0.5">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
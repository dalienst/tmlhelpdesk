"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { Lock, ArrowLeft, ArrowRight, Loader2, Eye, EyeOff, Hash, Mail, AlertCircle } from "lucide-react";
import { resetPassword } from "@/services/accounts";
import { ResetPasswordSchema } from "@/validation";

export default function ResetPassword() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      code: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await resetPassword({
          email: values.email,
          code: values.code,
          password: values.password,
          password_confirmation: values.confirmPassword,
        });
        toast.success("Password reset successfully! You can now log in.");
        router.push("/login");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Invalid or expired reset code.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      {/* Left Column: Visual branding and details */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-blue to-primary-blue/90 relative overflow-hidden items-center justify-center p-12 text-white">
        {/* Background abstract decorations */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-primary-red/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <Image src="/logo2.png" alt="Tamarind Logo" width={55} height={55} className="object-contain invert brightness-0" />
            <div>
              <span className="text-textBold text-2xl tracking-tight block leading-none">TAMARIND</span>
              <span className="text-[11px] tracking-wider text-white/70 text-textBold uppercase">Helpdesk Portal</span>
            </div>
          </div>

          <h2 className="text-3xl text-textBold mb-6 leading-tight">
            Streamlined Support & Ticket Resolution
          </h2>
          <p className="text-sm text-textRegular text-white/80 leading-relaxed mb-8">
            The official central support portal for Tamarind Group staff. Submit service requests, track technician assignments, and check updates in real-time.
          </p>

          {/* Role guides */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h4 className="text-xs text-textBold text-white/60 uppercase tracking-wider">Helpdesk Channels</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-employee-blue text-textBold">Employee Portal</span>
                <span className="text-white/60">Report issues & track own tickets</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-manager-orange text-textBold">Manager View</span>
                <span className="text-white/60">Approve requests & review teams</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-technician-green text-textBold">Technician Center</span>
                <span className="text-white/60">Manage assignees & log solutions</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-admin-purple text-textBold">Admin Console</span>
                <span className="text-white/60">Full system configuration</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Reset Form */}
      <div className="flex-grow md:w-1/2 flex items-center justify-center p-8 bg-gray-50/50">
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-150 p-8 shadow-xl relative">
          
          {/* Logo Header for Mobile */}
          <div className="flex md:hidden items-center gap-3 mb-6 justify-center">
            <Image src="/logo2.png" alt="Tamarind Logo" width={40} height={40} className="object-contain" />
            <div>
              <span className="text-textBold text-lg text-primary-blue tracking-tight block leading-none">TAMARIND</span>
              <span className="text-[10px] tracking-wider text-gray-500 text-textBold uppercase">Helpdesk Portal</span>
            </div>
          </div>

          <div className="text-center md:text-left mb-8">
            <h1 className="text-2xl text-textBold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-xs text-textRegular text-gray-500">Enter the recovery code sent to your email and select your new password</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs text-textBold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  placeholder="name@tamarind.co.ke"
                  className={`w-full bg-white border ${
                    formik.touched.email && formik.errors.email
                      ? "border-primary-red focus:border-primary-red"
                      : "border-gray-200 focus:border-primary-blue"
                  } rounded-xl py-3 pl-11 pr-4 text-sm text-textRegular outline-none transition-all placeholder:text-gray-400`}
                  required
                />
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <span className="text-[11px] text-textBold text-primary-red flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {formik.errors.email}
                </span>
              ) : null}
            </div>

            {/* Reset Code Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="code" className="text-xs text-textBold text-gray-700">
                Reset Code
              </label>
              <div className="relative">
                <input
                  id="code"
                  name="code"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.code}
                  placeholder="Enter 6-digit code"
                  className={`w-full bg-white border ${
                    formik.touched.code && formik.errors.code
                      ? "border-primary-red focus:border-primary-red"
                      : "border-gray-200 focus:border-primary-blue"
                  } rounded-xl py-3 pl-11 pr-4 text-sm text-textRegular outline-none transition-all placeholder:text-gray-400`}
                  required
                />
                <Hash className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {formik.touched.code && formik.errors.code ? (
                <span className="text-[11px] text-textBold text-primary-red flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {formik.errors.code}
                </span>
              ) : null}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-xs text-textBold text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder="••••••••"
                  className={`w-full bg-white border ${
                    formik.touched.password && formik.errors.password
                      ? "border-primary-red focus:border-primary-red"
                      : "border-gray-200 focus:border-primary-blue"
                  } rounded-xl py-3 pl-11 pr-11 text-sm text-textRegular outline-none transition-all placeholder:text-gray-400`}
                  required
                />
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-450 hover:text-primary-blue transition-colors outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <span className="text-[11px] text-textBold text-primary-red flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {formik.errors.password}
                </span>
              ) : null}
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-xs text-textBold text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  placeholder="••••••••"
                  className={`w-full bg-white border ${
                    formik.touched.confirmPassword && formik.errors.confirmPassword
                      ? "border-primary-red focus:border-primary-red"
                      : "border-gray-200 focus:border-primary-blue"
                  } rounded-xl py-3 pl-11 pr-11 text-sm text-textRegular outline-none transition-all placeholder:text-gray-400`}
                  required
                />
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-gray-455 hover:text-primary-blue transition-colors outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <span className="text-[11px] text-textBold text-primary-red flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {formik.errors.confirmPassword}
                </span>
              ) : null}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-blue hover:bg-primary-blue/95 active:scale-[0.99] disabled:opacity-50 disabled:active:scale-100 disabled:pointer-events-none text-white text-textBold text-sm py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Cancel Link */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <Link
              href="/login"
              className="text-xs text-textBold text-gray-500 hover:text-primary-blue transition-colors flex items-center justify-center gap-1 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Cancel and return to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
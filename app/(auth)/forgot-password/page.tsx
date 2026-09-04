"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Mail, AlertCircle } from "lucide-react";
import { useFormik } from "formik";
import { ForgotPasswordSchema } from "@/validation";
import { forgotPassword } from "@/services/accounts";
import Image from "next/image";

export default function ForgotPassword() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await forgotPassword({ email: values.email });
        setIsSuccess(true);
        toast.success("Password reset instructions sent!");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to send reset email. Please verify your email.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      {/* Left Column */}
      <div className="hidden md:flex md:w-1/2 bg-primary-blue relative overflow-hidden items-center justify-center p-10 text-white">
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <Image src="/logo2.png" alt="Tamarind Logo" width={44} height={44} className="object-contain invert brightness-0" />
            <div>
              <span className="font-semibold text-xl tracking-tight block leading-none">TAMARIND</span>
              <span className="text-[10px] tracking-wider text-white/70 font-semibold uppercase">Helpdesk Portal</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-3 leading-snug">
            Streamlined Support & Ticket Resolution
          </h2>
          <p className="text-xs text-white/80 leading-relaxed mb-6">
            The official central support portal for Tamarind Group staff. Submit service requests, track technician assignments, and check updates in real-time.
          </p>
        </div>
      </div>

      {/* Right Column: Forgot Password Form */}
      <div className="flex-grow md:w-1/2 flex items-center justify-center p-6 bg-gray-50/50">
        <div className="w-full max-w-sm bg-white rounded border border-gray-200 p-6 shadow-sm relative">
          {/* Logo Header for Mobile */}
          <div className="flex md:hidden items-center gap-2.5 mb-5 justify-center">
            <Image src="/logo2.png" alt="Tamarind Logo" width={32} height={32} className="object-contain" />
            <div>
              <span className="font-semibold text-base text-primary-blue tracking-tight block leading-none">TAMARIND</span>
              <span className="text-[10px] tracking-wider text-gray-500 font-semibold uppercase">Helpdesk Portal</span>
            </div>
          </div>

          <div className="text-center md:text-left mb-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Forgot Password</h1>
            <p className="text-xs text-gray-500">We will send you a secure code to reset your password</p>
          </div>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 bg-emerald-50 rounded flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-sm font-semibold text-gray-900">Check Your Inbox</h3>
                <p className="text-gray-500 text-xs leading-relaxed px-2">
                  We've sent password reset instructions to <span className="font-semibold text-gray-700">{formik.values.email}</span>.
                </p>
              </div>
              <button
                onClick={() => router.push("/reset-password")}
                className="w-full bg-primary-blue hover:bg-primary-blue/95 text-white font-semibold text-xs py-2.5 rounded transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                Enter Reset Code
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-gray-700">
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
                    } rounded py-2 pl-9 pr-3 text-sm outline-none transition-all placeholder:text-gray-400`}
                    required
                  />
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {formik.touched.email && formik.errors.email ? (
                  <span className="text-[11px] font-semibold text-primary-red flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {formik.errors.email}
                  </span>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-blue hover:bg-primary-blue/95 active:scale-[0.99] disabled:opacity-50 text-white font-semibold text-xs py-2.5 rounded transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Recovery Link
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center border-t border-gray-100 pt-4">
            <Link
              href="/login"
              className="text-xs font-semibold text-gray-500 hover:text-primary-blue transition-colors flex items-center justify-center gap-1 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

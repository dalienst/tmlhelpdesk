"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { Lock, ArrowLeft, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { activateAccount } from "@/services/accounts";
import { ResetPasswordConfirmSchema } from "@/validation";

export default function ActivateAccount({
  params,
}: {
  params: Promise<{ uidb64: string; token: string }>;
}) {
  const { uidb64, token } = use(params);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      password: "",
      password_confirmation: "",
    },
    validationSchema: ResetPasswordConfirmSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await activateAccount({
          uidb64,
          token,
          password: values.password,
          password_confirmation: values.password_confirmation,
        });
        toast.success("Account activated successfully! You can now log in.");
        router.push("/login");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Invalid or expired activation link.");
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

      {/* Right Column: Activate Form */}
      <div className="flex-grow md:w-1/2 flex items-center justify-center p-6 bg-gray-50/50">
        <div className="w-full max-w-sm bg-white rounded border border-gray-200 p-6 shadow-sm relative">
          <div className="flex md:hidden items-center gap-2.5 mb-5 justify-center">
            <Image src="/logo2.png" alt="Tamarind Logo" width={32} height={32} className="object-contain" />
            <div>
              <span className="font-semibold text-base text-primary-blue tracking-tight block leading-none">TAMARIND</span>
              <span className="text-[10px] tracking-wider text-gray-500 font-semibold uppercase">Helpdesk Portal</span>
            </div>
          </div>

          <div className="text-center md:text-left mb-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Activate Account</h1>
            <p className="text-xs text-gray-500">Choose a secure password to activate your account</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-gray-700">
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
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-gray-200 focus:border-primary-blue rounded py-2 pl-9 pr-9 text-sm outline-none transition-all placeholder:text-gray-400"
                  required
                />
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-primary-blue transition-colors outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password_confirmation" className="text-xs font-semibold text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password_confirmation}
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-gray-200 focus:border-primary-blue rounded py-2 pl-9 pr-9 text-sm outline-none transition-all placeholder:text-gray-400"
                  required
                />
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-primary-blue transition-colors outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-blue hover:bg-primary-blue/95 active:scale-[0.99] disabled:opacity-50 text-white font-semibold text-xs py-2.5 rounded transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  Activate Account
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

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

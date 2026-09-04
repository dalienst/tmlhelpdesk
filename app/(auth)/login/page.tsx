"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Session, User } from "next-auth";
import { Eye, EyeOff, Loader2, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { useFormik } from "formik";
import { LoginSchema } from "@/validation";
import Image from "next/image";

interface CustomUser extends User {
  is_employee?: boolean;
  is_manager?: boolean;
  is_superuser?: boolean;
  is_technician?: boolean;
  is_admin?: boolean;
  is_hod?: boolean;
}

interface CustomSession extends Session {
  user?: CustomUser;
}

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setLoading(true);

      const response = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      setLoading(false);

      if (response?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Login successful! Redirecting...");

        // Ensure session is loaded
        let session = (await getSession()) as CustomSession | null;
        if (!session?.user) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          session = (await getSession()) as CustomSession | null;
        }

        const user = session?.user;
        const isAdmin = user?.is_admin === true || user?.is_superuser === true;
        const isTech = user?.is_technician === true || String(user?.is_technician) === "true";
        const isManager = user?.is_manager === true || user?.is_hod === true;
        const isEmployee = user?.is_employee === true;

        // Technician role must take precedence over general employee!
        if (isAdmin) {
          router.push("/admin/dashboard");
        } else if (isTech) {
          router.push("/technician/dashboard");
        } else if (isManager) {
          router.push("/manager/dashboard");
        } else if (isEmployee) {
          router.push("/employee/dashboard");
        } else {
          router.push("/employee/dashboard");
        }
      }
    },
  });

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      {/* Left Column: Visual branding and details */}
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
            Streamlined Support &amp; Ticket Resolution
          </h2>
          <p className="text-xs text-white/80 leading-relaxed mb-6">
            The official central support portal for Tamarind Group staff. Submit service requests, track technician assignments, and check updates in real-time.
          </p>

          {/* Role guides */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h4 className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">Helpdesk Channels</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 border border-white/10 rounded p-2.5 flex flex-col gap-0.5">
                <span className="text-employee-blue font-semibold text-xs">Employee Portal</span>
                <span className="text-white/60 text-[11px]">Report issues &amp; track tickets</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded p-2.5 flex flex-col gap-0.5">
                <span className="text-manager-orange font-semibold text-xs">Manager View</span>
                <span className="text-white/60 text-[11px]">Approve requests &amp; teams</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded p-2.5 flex flex-col gap-0.5">
                <span className="text-technician-green font-semibold text-xs">Technician Center</span>
                <span className="text-white/60 text-[11px]">Manage tasks &amp; log solutions</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded p-2.5 flex flex-col gap-0.5">
                <span className="text-admin-purple font-semibold text-xs">Admin Console</span>
                <span className="text-white/60 text-[11px]">Full system configuration</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Login Form */}
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
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Sign in to Support</h1>
            <p className="text-xs text-gray-500">Enter your credentials to access the console</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Email Field */}
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

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold text-gray-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-primary-blue hover:text-primary-red transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder="••••••••••••"
                  className={`w-full bg-white border ${
                    formik.touched.password && formik.errors.password
                      ? "border-primary-red focus:border-primary-red"
                      : "border-gray-200 focus:border-primary-blue"
                  } rounded py-2 pl-9 pr-9 text-sm outline-none transition-all placeholder:text-gray-400`}
                />
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-primary-blue transition-colors outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <span className="text-[11px] font-semibold text-primary-red flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {formik.errors.password}
                </span>
              ) : null}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-blue hover:bg-primary-blue/95 active:scale-[0.99] disabled:opacity-50 text-white font-semibold text-xs py-2.5 rounded transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Back Link */}
          <div className="mt-6 text-center border-t border-gray-100 pt-4">
            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-primary-blue transition-colors flex items-center justify-center gap-1"
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

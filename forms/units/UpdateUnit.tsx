"use client";

import { useUpdateUnit } from "@/hooks/units/actions";
import { Unit } from "@/services/units";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Loader2, Building2 } from "lucide-react";

interface UpdateUnitProps {
  unit: Unit;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Unit name is required"),
  code: Yup.string().required("Unit code is required"),
  location: Yup.string().nullable(),
  email: Yup.string().email("Invalid email address").nullable(),
  phone: Yup.string().nullable(),
  description: Yup.string().nullable(),
  is_active: Yup.boolean().required(),
});

export default function UpdateUnit({ unit, onSuccess, onCancel }: UpdateUnitProps) {
  const { mutateAsync: updateUnit } = useUpdateUnit();

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl text-textBold text-gray-900">Manage Unit</h2>
        <p className="text-sm text-gray-500 mt-1">Update branch details and active status.</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-blue/10 text-primary-blue flex items-center justify-center text-lg text-textBold shrink-0">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-textBold text-gray-900">{unit.name}</p>
          <p className="text-xs text-gray-500 font-mono">Code: {unit.code} • Ref: {unit.reference}</p>
        </div>
      </div>

      <Formik
        initialValues={{
          name: unit.name || "",
          code: unit.code || "",
          location: unit.location || "",
          email: unit.email || "",
          phone: unit.phone || "",
          description: unit.description || "",
          is_active: Boolean(unit.is_active),
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await updateUnit({
              reference: unit.reference,
              data: values,
            });
            toast.success("Unit updated successfully!");
            onSuccess?.();
          } catch (error: any) {
            const errorData = error?.response?.data;
            const errorMsg = errorData
              ? typeof errorData === "object"
                ? Object.entries(errorData)
                    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : v}`)
                    .join(" | ")
                : errorData
              : "Failed to update unit. Please try again.";
            toast.error(errorMsg);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm text-textBold text-gray-700">
                  Unit Name *
                </label>
                <Field
                  id="name"
                  name="name"
                  placeholder="e.g. Tamarind Nairobi"
                  className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded-lg px-3 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400"
                />
                <ErrorMessage name="name" component="div" className="text-primary-red text-xs mt-1" />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="code" className="text-sm text-textBold text-gray-700">
                  Unit Code *
                </label>
                <Field
                  id="code"
                  name="code"
                  placeholder="e.g. TNB-01"
                  className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded-lg px-3 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 uppercase"
                />
                <ErrorMessage name="code" component="div" className="text-primary-red text-xs mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="location" className="text-sm text-textBold text-gray-700">
                  Location / Address
                </label>
                <Field
                  id="location"
                  name="location"
                  placeholder="e.g. Haile Selassie Ave, Nairobi"
                  className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded-lg px-3 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400"
                />
                <ErrorMessage name="location" component="div" className="text-primary-red text-xs mt-1" />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm text-textBold text-gray-700">
                  Contact Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nairobi@tamarind.co.ke"
                  className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded-lg px-3 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400"
                />
                <ErrorMessage name="email" component="div" className="text-primary-red text-xs mt-1" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm text-textBold text-gray-700">
                Contact Phone
              </label>
              <Field
                id="phone"
                name="phone"
                placeholder="+254 700 000 000"
                className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded-lg px-3 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400"
              />
              <ErrorMessage name="phone" component="div" className="text-primary-red text-xs mt-1" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="description" className="text-sm text-textBold text-gray-700">
                Description / Notes
              </label>
              <Field
                as="textarea"
                rows={3}
                id="description"
                name="description"
                placeholder="Optional details..."
                className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded-lg px-3 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 resize-none"
              />
              <ErrorMessage name="description" component="div" className="text-primary-red text-xs mt-1" />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-all hover:bg-gray-50 border-gray-200">
                <Field
                  type="checkbox"
                  name="is_active"
                  className="w-5 h-5 text-primary-blue rounded border-gray-300 focus:ring-primary-blue"
                />
                <div className="flex-1">
                  <p className={`text-sm text-textBold ${values.is_active ? "text-emerald-600" : "text-gray-500"}`}>
                    {values.is_active ? "Active Unit" : "Deactivated Unit"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Inactive units are hidden from general request forms
                  </p>
                </div>
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-lg text-sm text-textBold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 border border-transparent"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-blue hover:bg-primary-blue/95 text-white px-6 py-2.5 rounded-lg text-sm text-textBold transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[120px]"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

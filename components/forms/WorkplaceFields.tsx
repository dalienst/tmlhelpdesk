"use client";

import { Field, ErrorMessage, useFormikContext } from "formik";
import { useFetchUnits } from "@/hooks/units/actions";
import { useFetchDepartments } from "@/hooks/departments/actions";

/**
 * Unit + department pickers for a staff member. Tickets they raise are
 * routed from these, so the request form never has to ask.
 * Expects `unit` and `department` (references) in the Formik values.
 */
export default function WorkplaceFields() {
  const { values, setFieldValue } = useFormikContext<{ unit: string; department: string }>();
  const { data: units, isLoading: unitsLoading } = useFetchUnits();
  const { data: departments, isLoading: deptsLoading } = useFetchDepartments();

  const activeUnits = units?.filter((u) => u.is_active) || [];
  const unitDepartments =
    departments?.filter((d) => d.is_active && d.unit_reference === values.unit) || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="space-y-1">
        <label htmlFor="unit" className="text-xs font-semibold text-gray-700">
          Unit / Property
        </label>
        <Field
          as="select"
          id="unit"
          name="unit"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setFieldValue("unit", e.target.value);
            setFieldValue("department", "");
          }}
          className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded px-3 py-2 text-sm outline-none transition-all"
        >
          <option value="">{unitsLoading ? "Loading units..." : "Select unit"}</option>
          {activeUnits.map((u) => (
            <option key={u.id} value={u.reference}>
              {u.name} ({u.code})
            </option>
          ))}
        </Field>
        <ErrorMessage name="unit" component="div" className="text-primary-red text-xs mt-0.5" />
      </div>

      <div className="space-y-1">
        <label htmlFor="department" className="text-xs font-semibold text-gray-700">
          Department
        </label>
        <Field
          as="select"
          id="department"
          name="department"
          disabled={!values.unit}
          className="w-full bg-white border border-gray-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue rounded px-3 py-2 text-sm outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
        >
          <option value="">
            {!values.unit ? "Select a unit first" : deptsLoading ? "Loading departments..." : "Select department"}
          </option>
          {unitDepartments.map((d) => (
            <option key={d.id} value={d.reference}>
              {d.name} ({d.code})
            </option>
          ))}
        </Field>
        <ErrorMessage name="department" component="div" className="text-primary-red text-xs mt-0.5" />
      </div>
      <p className="sm:col-span-2 text-[11px] text-gray-500 -mt-1">
        Requests this person raises go to their unit&apos;s service departments automatically.
      </p>
    </div>
  );
}

import UpdateAccount from "@/forms/accounts/UpdateAccount";

export default function AccountSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Account Settings</h1>
      <div className="bg-white rounded border border-gray-200 p-5 shadow-sm">
        <UpdateAccount />
      </div>
    </div>
  );
}

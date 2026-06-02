export default function AccountSettings() {
  return (
    <div>
      <h1 className="text-2xl text-textBold text-gray-900 tracking-tight mb-8">Account Settings</h1>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <UpdateAccount />
      </div>
    </div>
  );
}

import UpdateAccount from "@/forms/accounts/UpdateAccount";
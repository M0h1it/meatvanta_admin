import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { showSuccess, showError } from "../../../lib/sweetAlert";
import Toggle from "../../../components/common/Toggle";

export default function SettingsPage() {
  const { admin, updatePreferences } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Default true (visible) unless the admin has explicitly turned it off -
  // an existing account should never lose the link just because this feature shipped later.
  const showAuditLog = admin?.preferences?.showAuditLog !== false;

  async function handleToggleAuditLog(e) {
    const next = e.target.checked;
    setIsSaving(true);
    try {
      await updatePreferences({ showAuditLog: next });
      showSuccess(next ? "Audit Log shown in sidebar." : "Audit Log hidden from sidebar.");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to save preference.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-headline-md text-headline-md text-on-surface mb-lg">Settings</h1>

      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-lg mb-lg max-w-lg">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3">My Account</h2>
        <dl className="text-sm space-y-1.5">
          <div className="flex justify-between">
            <dt className="text-on-surface-variant">Name</dt>
            <dd className="text-on-surface font-medium">{admin?.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-on-surface-variant">Email</dt>
            <dd className="text-on-surface font-medium">{admin?.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-on-surface-variant">Role</dt>
            <dd className="text-on-surface font-medium capitalize">{admin?.role}</dd>
          </div>
        </dl>
      </div>

      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-lg max-w-lg">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3">Sidebar</h2>
        <label className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-on-surface">Show Audit Log</p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Hide the Audit Log link from your sidebar if you don't need it day-to-day. This only affects your
              own view — it doesn't change anyone else's access.
            </p>
          </div>
          <Toggle
            checked={showAuditLog}
            disabled={isSaving}
            onChange={(next) => handleToggleAuditLog({ target: { checked: next } })}
          />
        </label>
      </div>
    </div>
  );
}

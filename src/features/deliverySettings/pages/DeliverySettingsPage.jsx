import { useEffect, useState } from "react";
import { fetchDeliverySettings, updateDeliverySettings } from "../api/deliverySettingsApi";
import { usePermission } from "../../../hooks/usePermission";
import { showSuccess, showError } from "../../../lib/sweetAlert";
import Toggle from "../../../components/common/Toggle";

const DAYS = [
  { key: "sunday", label: "Sunday" },
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
];

export default function DeliverySettingsPage() {
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const { hasPermission } = usePermission();
  const canUpdate = hasPermission("delivery_settings:update");

  useEffect(() => {
    fetchDeliverySettings()
      .then((settings) =>
        setForm({
          ...settings,
          availableDays: Array.isArray(settings.availableDays) ? settings.availableDays : [],
          sameDayCutoffTime: settings.sameDayCutoffTime || "",
          flatDeliveryCharge: Number(settings.flatDeliveryCharge),
        })
      )
      .catch((err) => setError(err.response?.data?.message || "Failed to load delivery settings."))
      .finally(() => setIsLoading(false));
  }, []);

  function toggleDay(dayKey) {
    setForm((f) => ({
      ...f,
      availableDays: f.availableDays.includes(dayKey)
        ? f.availableDays.filter((d) => d !== dayKey)
        : [...f.availableDays, dayKey],
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await updateDeliverySettings({
        availableDays: form.availableDays,
        deliveryStartTime: form.deliveryStartTime,
        deliveryEndTime: form.deliveryEndTime,
        sameDayEnabled: form.sameDayEnabled,
        nextDayEnabled: form.nextDayEnabled,
        maxAdvanceDays: Number(form.maxAdvanceDays),
        // Empty string means "no cutoff decided" - send null, not "".
        sameDayCutoffTime: form.sameDayCutoffTime ? form.sameDayCutoffTime : null,
        deliveryChargeMode: form.deliveryChargeMode,
        flatDeliveryCharge: Number(form.flatDeliveryCharge),
        deliveryAreaNote: form.deliveryAreaNote,
        codEnabled: form.codEnabled,
        upiEnabled: form.upiEnabled,
        upiId: form.upiId,
        upiPayeeName: form.upiPayeeName,
      });
      setForm({
        ...updated,
        availableDays: Array.isArray(updated.availableDays) ? updated.availableDays : [],
        sameDayCutoffTime: updated.sameDayCutoffTime || "",
        flatDeliveryCharge: Number(updated.flatDeliveryCharge),
      });
      setError(null);
      showSuccess("Delivery settings saved.");
    } catch (err) {
      const message = err.response?.data?.message || "Save failed.";
      setError(message);
      showError(message);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p className="text-sm text-on-surface-variant">Loading...</p>;
  }

  if (!form) {
    return (
      <div className="rounded bg-error-container text-on-error-container text-sm px-3 py-2">
        {error || "Delivery settings unavailable."}
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-headline-md text-headline-md text-on-surface">Delivery Settings</h1>
      <p className="font-body-md text-body-md text-on-surface-variant mt-1 mb-lg">
        These rules control what customers can select at checkout. Changes take effect immediately.
      </p>

      {error && (
        <div className="mb-md rounded bg-error-container text-on-error-container text-sm px-3 py-2">{error}</div>
      )}

      <form onSubmit={handleSave} className="space-y-lg max-w-2xl">
        {/* Delivery days */}
        <section className="bg-surface-container-lowest rounded-lg border border-outline-variant p-lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Delivery Days</h2>
          <p className="text-xs text-on-surface-variant mb-4">
            Customers can only pick dates that fall on an enabled day.
          </p>
          <div className="space-y-2">
            {DAYS.map((day) => (
              <div key={day.key} className="flex items-center justify-between">
                <span className="text-sm text-on-surface">{day.label}</span>
                <Toggle
                  checked={form.availableDays.includes(day.key)}
                  onChange={() => toggleDay(day.key)}
                  disabled={!canUpdate}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Delivery window */}
        <section className="bg-surface-container-lowest rounded-lg border border-outline-variant p-lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Delivery Window</h2>
          <p className="text-xs text-on-surface-variant mb-4">
            The single time window shown to customers, e.g. 6:00 AM – 11:00 AM.
          </p>
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="block font-label-bold text-label-bold text-on-surface mb-1">Start Time</label>
              <input
                type="time"
                disabled={!canUpdate}
                value={form.deliveryStartTime}
                onChange={(e) => setForm({ ...form, deliveryStartTime: e.target.value })}
                className="w-full rounded border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block font-label-bold text-label-bold text-on-surface mb-1">End Time</label>
              <input
                type="time"
                disabled={!canUpdate}
                value={form.deliveryEndTime}
                onChange={(e) => setForm({ ...form, deliveryEndTime: e.target.value })}
                className="w-full rounded border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>
          </div>
        </section>

        {/* Date availability */}
        <section className="bg-surface-container-lowest rounded-lg border border-outline-variant p-lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Date Availability</h2>

          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-on-surface">Allow same-day delivery</p>
              <p className="text-xs text-on-surface-variant">Customer can pick today, if today is a delivery day.</p>
            </div>
            <Toggle
              checked={form.sameDayEnabled}
              onChange={(v) => setForm({ ...form, sameDayEnabled: v })}
              disabled={!canUpdate}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-on-surface">Allow next-day delivery</p>
              <p className="text-xs text-on-surface-variant">Customer can pick tomorrow.</p>
            </div>
            <Toggle
              checked={form.nextDayEnabled}
              onChange={(v) => setForm({ ...form, nextDayEnabled: v })}
              disabled={!canUpdate}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div>
              <label className="block font-label-bold text-label-bold text-on-surface mb-1">
                Max Days in Advance
              </label>
              <input
                type="number"
                min={0}
                max={30}
                disabled={!canUpdate}
                value={form.maxAdvanceDays}
                onChange={(e) => setForm({ ...form, maxAdvanceDays: e.target.value })}
                className="w-full rounded border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
              <p className="text-xs text-on-surface-variant mt-1">
                How far ahead a customer can book. Currently {form.maxAdvanceDays} day(s).
              </p>
            </div>
            <div>
              <label className="block font-label-bold text-label-bold text-on-surface mb-1">
                Same-Day Cutoff Time
              </label>
              <input
                type="time"
                disabled={!canUpdate}
                value={form.sameDayCutoffTime}
                onChange={(e) => setForm({ ...form, sameDayCutoffTime: e.target.value })}
                className="w-full rounded border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
              <p className="text-xs text-on-surface-variant mt-1">
                {form.sameDayCutoffTime
                  ? "After this time, same-day delivery closes for the day."
                  : "Not set — same-day stays open all day. Leave empty until you decide."}
              </p>
            </div>
          </div>
        </section>

        {/* Delivery charge */}
        <section className="bg-surface-container-lowest rounded-lg border border-outline-variant p-lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Delivery Charge</h2>
          <p className="text-xs text-on-surface-variant mb-4">
            Business rule: Uber Bike fare for the location minus ₹10. Since that needs a human to look up, choose
            how it's applied.
          </p>

          <div className="space-y-2 mb-4">
            <label className="flex items-start gap-2 text-sm text-on-surface">
              <input
                type="radio"
                name="chargeMode"
                value="flat"
                disabled={!canUpdate}
                checked={form.deliveryChargeMode === "flat"}
                onChange={() => setForm({ ...form, deliveryChargeMode: "flat" })}
                className="mt-1"
              />
              <span>
                <span className="font-medium">Flat charge</span>
                <span className="block text-xs text-on-surface-variant">
                  One amount applied automatically at checkout. Smoothest for customers.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-2 text-sm text-on-surface">
              <input
                type="radio"
                name="chargeMode"
                value="manual"
                disabled={!canUpdate}
                checked={form.deliveryChargeMode === "manual"}
                onChange={() => setForm({ ...form, deliveryChargeMode: "manual" })}
                className="mt-1"
              />
              <span>
                <span className="font-medium">Manual per order</span>
                <span className="block text-xs text-on-surface-variant">
                  Customer sees "confirmed after we check your address"; you set the exact amount on the order.
                </span>
              </span>
            </label>
          </div>

          {form.deliveryChargeMode === "flat" && (
            <div className="max-w-[200px]">
              <label className="block font-label-bold text-label-bold text-on-surface mb-1">Flat Charge (₹)</label>
              <input
                type="number"
                min={0}
                disabled={!canUpdate}
                value={form.flatDeliveryCharge}
                onChange={(e) => setForm({ ...form, flatDeliveryCharge: e.target.value })}
                className="w-full rounded border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>
          )}
        </section>

        {/* Payment methods */}
        <section className="bg-surface-container-lowest rounded-lg border border-outline-variant p-lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Payment Methods</h2>
          <p className="text-xs text-on-surface-variant mb-4">
            At least one must stay enabled, or customers can't check out.
          </p>

          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-on-surface">Cash on Delivery</p>
              <p className="text-xs text-on-surface-variant">Customer pays the delivery boy.</p>
            </div>
            <Toggle
              checked={form.codEnabled}
              onChange={(v) => setForm({ ...form, codEnabled: v })}
              disabled={!canUpdate}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-on-surface">UPI</p>
              <p className="text-xs text-on-surface-variant">
                Customer pays directly, then shares their receipt for you to verify.
              </p>
            </div>
            <Toggle
              checked={form.upiEnabled}
              onChange={(v) => setForm({ ...form, upiEnabled: v })}
              disabled={!canUpdate}
            />
          </div>

          {form.upiEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md pt-3 border-t border-outline-variant">
              <div>
                <label className="block font-label-bold text-label-bold text-on-surface mb-1">UPI ID</label>
                <input
                  type="text"
                  disabled={!canUpdate}
                  value={form.upiId}
                  onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                  className="w-full rounded border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
                <p className="text-xs text-on-surface-variant mt-1">Shown to customers on the payment screen.</p>
              </div>
              <div>
                <label className="block font-label-bold text-label-bold text-on-surface mb-1">Payee Name</label>
                <input
                  type="text"
                  disabled={!canUpdate}
                  value={form.upiPayeeName}
                  onChange={(e) => setForm({ ...form, upiPayeeName: e.target.value })}
                  className="w-full rounded border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>
            </div>
          )}
        </section>

        {/* Area note */}
        <section className="bg-surface-container-lowest rounded-lg border border-outline-variant p-lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Delivery Area</h2>
          <p className="text-xs text-on-surface-variant mb-3">Shown to customers at checkout.</p>
          <input
            type="text"
            maxLength={255}
            disabled={!canUpdate}
            value={form.deliveryAreaNote}
            onChange={(e) => setForm({ ...form, deliveryAreaNote: e.target.value })}
            className="w-full rounded border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
        </section>

        {canUpdate && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-primary-container text-on-primary text-sm px-6 py-2.5 rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

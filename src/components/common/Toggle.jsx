/**
 * Colour alone was too subtle to read at a glance, so the state is spelled out:
 * an On/Off label plus a checkmark inside the knob when active.
 */
export default function Toggle({ checked, onChange, disabled = false, showLabel = true }) {
  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <span
          className={`text-xs font-bold uppercase tracking-wide w-7 text-right ${
            checked ? "text-secondary" : "text-on-surface-variant"
          }`}
        >
          {checked ? "On" : "Off"}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors disabled:opacity-50 ${
          checked ? "bg-secondary border-secondary" : "bg-surface-container-high border-outline-variant"
        }`}
      >
        <span
          className="inline-flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white shadow-sm transition-transform"
          style={{ transform: checked ? "translateX(22px)" : "translateX(2px)" }}
        >
          {checked && (
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: "13px" }}>
              check
            </span>
          )}
        </span>
      </button>
    </div>
  );
}

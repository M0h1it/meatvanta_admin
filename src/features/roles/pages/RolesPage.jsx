import { useEffect, useState } from "react";
import { fetchRoles, fetchPermissionCatalog, createRole, updateRole, deleteRole } from "../api/rolesApi";
import { usePermission } from "../../../hooks/usePermission";
import Modal from "../../../components/common/Modal";
import { showSuccess, showError, showConfirm } from "../../../lib/sweetAlert";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [catalog, setCatalog] = useState(null); // { modules, allKeys }
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null); // { id, name, label, permissions: Set }

  const { hasPermission } = usePermission();
  const canCreate = hasPermission("roles:create");
  const canUpdate = hasPermission("roles:update");
  const canDelete = hasPermission("roles:delete");

  async function loadAll() {
    setIsLoading(true);
    setError(null);
    try {
      const [rolesData, catalogData] = await Promise.all([fetchRoles(), fetchPermissionCatalog()]);
      setRoles(rolesData);
      setCatalog(catalogData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load roles.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function expandGrantedKeys(permissions) {
    if (!catalog) return new Set();
    if (permissions.includes("*")) return new Set(catalog.allKeys);
    const granted = new Set();
    for (const key of catalog.allKeys) {
      const [moduleName] = key.split(":");
      if (permissions.includes(key) || permissions.includes(`${moduleName}:*`)) granted.add(key);
    }
    return granted;
  }

  function openCreateForm() {
    setForm({ id: null, name: "", label: "", permissions: new Set() });
  }

  function openEditForm(role) {
    setForm({ id: role.id, name: role.name, label: role.label, permissions: expandGrantedKeys(role.permissions) });
  }

  function togglePermission(key) {
    const next = new Set(form.permissions);
    next.has(key) ? next.delete(key) : next.add(key);
    setForm({ ...form, permissions: next });
  }

  function toggleModuleAll(moduleKeys) {
    const next = new Set(form.permissions);
    const allChecked = moduleKeys.every((k) => next.has(k));
    moduleKeys.forEach((k) => (allChecked ? next.delete(k) : next.add(k)));
    setForm({ ...form, permissions: next });
  }

  async function handleSave(e) {
    e.preventDefault();
    const permissionsArray = Array.from(form.permissions);
    if (permissionsArray.length === 0) {
      setError("Select at least one permission.");
      return;
    }
    try {
      if (form.id) {
        await updateRole(form.id, { label: form.label, permissions: permissionsArray });
      } else {
        await createRole({ name: form.name, label: form.label, permissions: permissionsArray });
      }
      setForm(null);
      setError(null);
      loadAll();
      showSuccess(form.id ? "Role updated." : "Role created.");
    } catch (err) {
      const message = err.response?.data?.message || "Save failed.";
      setError(message);
      showError(message);
    }
  }

  async function handleDelete(role) {
    const confirmed = await showConfirm({
      title: `Delete role "${role.label}"?`,
      text: "This cannot be undone.",
      confirmButtonText: "Delete",
    });
    if (!confirmed) return;
    try {
      await deleteRole(role.id);
      loadAll();
      showSuccess("Role deleted.");
    } catch (err) {
      showError(err.response?.data?.message || "Delete failed.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-lg">
        <h1 className="font-headline-md text-headline-md text-on-surface">Roles</h1>
        {canCreate && (
          <button
            onClick={openCreateForm}
            className="flex items-center gap-1 bg-primary-container text-on-primary text-sm px-4 py-2 rounded hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Role
          </button>
        )}
      </div>

      {error && (
        <div className="mb-md rounded bg-error-container text-on-error-container text-sm px-3 py-2">{error}</div>
      )}

      <Modal
        isOpen={!!(form && catalog)}
        onClose={() => setForm(null)}
        title={form?.id ? `Edit Role: ${form.label}` : "New Role"}
        maxWidth="max-w-2xl"
      >
        {form && catalog && (
          <form onSubmit={handleSave}>
            {!form.id && (
              <div className="mb-3">
                <label className="block font-label-bold text-label-bold text-on-surface mb-1">
                  Name <span className="text-on-surface-variant font-normal">(lowercase, hyphens only, e.g. "delivery-staff")</span>
                </label>
                <input
                  required
                  pattern="[a-z0-9-]+"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <div className="mb-lg">
              <label className="block font-label-bold text-label-bold text-on-surface mb-1">Label</label>
              <input
                required
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="w-full rounded border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-label-bold text-label-bold text-on-surface mb-2">Permissions</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(catalog.modules).map(([moduleName, keys]) => {
                  const allChecked = keys.every((k) => form.permissions.has(k));
                  return (
                    <div key={moduleName} className="border border-outline-variant rounded p-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-on-surface mb-2 capitalize">
                        <input type="checkbox" checked={allChecked} onChange={() => toggleModuleAll(keys)} />
                        {moduleName.replace("_", " ")}
                      </label>
                      <div className="space-y-1 pl-5">
                        {keys.map((key) => (
                          <label key={key} className="flex items-center gap-2 text-xs text-on-surface-variant">
                            <input
                              type="checkbox"
                              checked={form.permissions.has(key)}
                              onChange={() => togglePermission(key)}
                            />
                            {key.split(":")[1]}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-lg">
              <button
                type="button"
                onClick={() => setForm(null)}
                className="text-sm px-4 py-2 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
              >
                Cancel
              </button>
              <button type="submit" className="bg-primary-container text-on-primary text-sm px-5 py-2 rounded hover:opacity-90">
                Save
              </button>
            </div>
          </form>
        )}
      </Modal>

      {isLoading ? (
        <p className="text-sm text-on-surface-variant">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <div key={role.id} className="bg-surface-container-lowest rounded-lg border border-outline-variant p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-on-surface">{role.label}</p>
                {role.isSystem && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">System</span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                {role.permissions.includes("*") ? "Full access" : `${role.permissions.length} permission entr${role.permissions.length === 1 ? "y" : "ies"}`}
                {" · "}
                {role._count?.adminUsers ?? 0} admin{role._count?.adminUsers === 1 ? "" : "s"}
              </p>
              <div className="mt-3 flex gap-3 text-sm">
                {canUpdate && role.name !== "owner" && (
                  <button onClick={() => openEditForm(role)} className="text-primary">
                    Edit
                  </button>
                )}
                {canDelete && !role.isSystem && (
                  <button onClick={() => handleDelete(role)} className="text-error">
                    Delete
                  </button>
                )}
                {role.name === "owner" && <span className="text-xs text-on-surface-variant">Protected</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

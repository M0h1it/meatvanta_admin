import { useEffect, useState } from "react";
import { fetchAdminUsers, createAdminUser, updateAdminUser } from "../api/adminUsersApi";
import { fetchRoles } from "../../roles/api/rolesApi";
import { usePermission } from "../../../hooks/usePermission";
import { useAuth } from "../../../hooks/useAuth";
import Modal from "../../../components/common/Modal";
import { showSuccess, showError } from "../../../lib/sweetAlert";

const EMPTY_FORM = { id: null, name: "", email: "", password: "", roleId: "", isActive: true };

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);

  const { hasPermission } = usePermission();
  const { admin: currentAdmin } = useAuth();
  const canCreate = hasPermission("admin_users:create");
  const canUpdate = hasPermission("admin_users:update");

  async function loadAll() {
    setIsLoading(true);
    setError(null);
    try {
      const [adminsData, rolesData] = await Promise.all([fetchAdminUsers(), fetchRoles()]);
      setAdmins(adminsData);
      setRoles(rolesData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin users.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function openCreateForm() {
    setForm({ ...EMPTY_FORM, roleId: roles[0]?.id || "" });
  }

  function openEditForm(admin) {
    setForm({ id: admin.id, name: admin.name, email: admin.email, password: "", roleId: admin.role.id, isActive: admin.isActive });
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      if (form.id) {
        await updateAdminUser(form.id, { name: form.name, roleId: Number(form.roleId), isActive: form.isActive });
      } else {
        await createAdminUser({ name: form.name, email: form.email, password: form.password, roleId: Number(form.roleId) });
      }
      setForm(null);
      setError(null);
      loadAll();
      showSuccess(form.id ? "Admin updated." : "Admin created.");
    } catch (err) {
      const message = err.response?.data?.message || "Save failed.";
      setError(message);
      showError(message);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-lg">
        <h1 className="font-headline-md text-headline-md text-on-surface">Admin Users</h1>
        {canCreate && (
          <button
            onClick={openCreateForm}
            className="flex items-center gap-1 bg-primary-container text-on-primary text-sm px-4 py-2 rounded hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Admin
          </button>
        )}
      </div>

      {error && (
        <div className="mb-md rounded bg-error-container text-on-error-container text-sm px-3 py-2">{error}</div>
      )}

      <Modal isOpen={!!form} onClose={() => setForm(null)} title={form?.id ? "Edit Admin" : "New Admin"}>
        {form && (
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block font-label-bold text-label-bold text-on-surface mb-1">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {!form.id && (
              <>
                <div>
                  <label className="block font-label-bold text-label-bold text-on-surface mb-1">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block font-label-bold text-label-bold text-on-surface mb-1">Password</label>
                  <input
                    required
                    type="password"
                    minLength={6}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block font-label-bold text-label-bold text-on-surface mb-1">Role</label>
              <select
                required
                value={form.roleId}
                onChange={(e) => setForm({ ...form, roleId: e.target.value })}
                className="w-full rounded border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="" disabled>
                  Select a role
                </option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {form.id && (
              <label className="flex items-center gap-2 text-sm text-on-surface">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                Active
              </label>
            )}

            <div className="flex gap-2 justify-end pt-1">
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
        <>
          <div className="hidden md:block bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low text-on-surface">
                <tr>
                  <th className="text-left px-4 py-2 font-label-bold text-label-bold">Name</th>
                  <th className="text-left px-4 py-2 font-label-bold text-label-bold">Email</th>
                  <th className="text-left px-4 py-2 font-label-bold text-label-bold">Role</th>
                  <th className="text-left px-4 py-2 font-label-bold text-label-bold">Status</th>
                  <th className="text-right px-4 py-2 font-label-bold text-label-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id} className="border-t border-outline-variant">
                    <td className="px-4 py-2 font-medium text-on-surface">
                      {a.name} {a.id === currentAdmin?.id && <span className="text-xs text-on-surface-variant">(you)</span>}
                    </td>
                    <td className="px-4 py-2 text-on-surface-variant">{a.email}</td>
                    <td className="px-4 py-2 text-on-surface-variant">{a.role.label}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          a.isActive ? "bg-secondary-fixed text-on-secondary-fixed-variant" : "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {a.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      {canUpdate && (
                        <button onClick={() => openEditForm(a)} className="text-primary hover:underline">
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {admins.map((a) => (
              <div key={a.id} className="bg-surface-container-lowest rounded-lg border border-outline-variant p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-on-surface">
                    {a.name} {a.id === currentAdmin?.id && <span className="text-xs text-on-surface-variant">(you)</span>}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      a.isActive ? "bg-secondary-fixed text-on-secondary-fixed-variant" : "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    {a.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">{a.email} · {a.role.label}</p>
                {canUpdate && (
                  <button onClick={() => openEditForm(a)} className="text-primary text-sm mt-2">
                    Edit
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

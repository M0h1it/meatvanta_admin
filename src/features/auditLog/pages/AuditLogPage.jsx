import { useEffect, useState } from "react";
import { fetchAuditLog } from "../api/auditLogApi";

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load(currentPage, currentAction) {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchAuditLog({ action: currentAction || undefined, page: currentPage });
      setLogs(result.logs);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load audit log.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load(page, actionFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleFilterSubmit(e) {
    e.preventDefault();
    setPage(1);
    load(1, actionFilter);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl font-bold text-on-surface">Audit Log</h1>
        <form onSubmit={handleFilterSubmit} className="flex gap-2">
          <input
            placeholder="Filter by action (e.g. products:update)"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-sm rounded border border-outline-variant px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-64"
          />
          <button type="submit" className="text-sm px-3 py-2 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-low">
            Filter
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">{error}</div>
      )}

      {isLoading ? (
        <p className="text-sm text-on-surface-variant">Loading...</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-on-surface-variant">No log entries.</p>
      ) : (
        <>
          <div className="hidden md:block bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low text-on-surface">
                <tr>
                  <th className="text-left px-4 py-2">When</th>
                  <th className="text-left px-4 py-2">Admin</th>
                  <th className="text-left px-4 py-2">Action</th>
                  <th className="text-left px-4 py-2">Entity</th>
                  <th className="text-left px-4 py-2">IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t border-outline-variant">
                    <td className="px-4 py-2 text-on-surface-variant whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 text-on-surface-variant">{log.admin ? log.admin.name : "—"}</td>
                    <td className="px-4 py-2 font-medium text-on-surface">{log.action}</td>
                    <td className="px-4 py-2 text-on-surface-variant">
                      {log.entity ? `${log.entity}${log.entityId ? ` #${log.entityId}` : ""}` : "—"}
                    </td>
                    <td className="px-4 py-2 text-on-surface-variant text-xs">{log.ipAddress || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="bg-surface-container-lowest rounded-lg border border-outline-variant p-4 text-sm">
                <p className="font-medium text-on-surface">{log.action}</p>
                <p className="text-xs text-on-surface-variant mt-1">{new Date(log.createdAt).toLocaleString()}</p>
                <p className="text-xs text-on-surface-variant">
                  {log.admin ? log.admin.name : "System"}
                  {log.entity ? ` · ${log.entity}${log.entityId ? ` #${log.entityId}` : ""}` : ""}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-on-surface-variant">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded border border-outline-variant disabled:opacity-40"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded border border-outline-variant disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

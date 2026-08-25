import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCustomers } from "../api/customersApi";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput);

  useEffect(() => {
    setIsLoading(true);
    fetchCustomers({ search: debouncedSearch || undefined, page })
      .then((result) => {
        setCustomers(result.customers);
        setTotalPages(result.totalPages);
        setTotal(result.total);
        setError(null);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load customers."))
      .finally(() => setIsLoading(false));
  }, [debouncedSearch, page]);

  // A new search should start at page 1, not page 4 of the old results.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-lg">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Customers</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            {total} {total === 1 ? "customer" : "customers"} with an account.
          </p>
        </div>

        <div className="relative">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">
            search
          </span>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name or phone..."
            className="w-60 text-sm rounded border border-outline-variant pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-md rounded bg-error-container text-on-error-container text-sm px-3 py-2">{error}</div>
      )}

      {isLoading ? (
        <p className="text-sm text-on-surface-variant">Loading...</p>
      ) : customers.length === 0 ? (
        <p className="text-sm text-on-surface-variant">
          {debouncedSearch
            ? `No customers match "${debouncedSearch}".`
            : "No customer accounts yet. They're created when someone signs in on the shop."}
        </p>
      ) : (
        <>
          {/* Table on desktop */}
          <div className="hidden md:block bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low text-on-surface">
                <tr>
                  <th className="text-left px-4 py-2 font-label-bold text-label-bold">Name</th>
                  <th className="text-left px-4 py-2 font-label-bold text-label-bold">Phone</th>
                  <th className="text-right px-4 py-2 font-label-bold text-label-bold">Orders</th>
                  <th className="text-right px-4 py-2 font-label-bold text-label-bold">Total Spent</th>
                  <th className="text-left px-4 py-2 font-label-bold text-label-bold">Last Order</th>
                  <th className="text-left px-4 py-2 font-label-bold text-label-bold">Joined</th>
                  <th className="text-right px-4 py-2 font-label-bold text-label-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-t border-outline-variant hover:bg-surface-container-low"
                  >
                    <td className="px-4 py-3">
                      <Link
                        to={`/customers/${customer.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {customer.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{customer.phone}</td>
                    <td className="px-4 py-3 text-right text-on-surface">{customer.orderCount}</td>
                    <td className="px-4 py-3 text-right text-on-surface font-medium">
                      ₹{customer.totalSpent.toFixed(0)}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{formatDate(customer.lastOrderAt)}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{formatDate(customer.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/customers/${customer.id}`}
                        className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded border border-outline-variant text-primary hover:bg-surface-container-low whitespace-nowrap"
                      >
                        View Details
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards on mobile */}
          <div className="md:hidden space-y-3">
            {customers.map((customer) => (
              <Link
                key={customer.id}
                to={`/customers/${customer.id}`}
                className="block bg-surface-container-lowest rounded-lg border border-outline-variant p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-on-surface">{customer.name}</p>
                    <p className="text-xs text-on-surface-variant">{customer.phone}</p>
                  </div>
                  <p className="font-bold text-on-surface">₹{customer.totalSpent.toFixed(0)}</p>
                </div>
                <p className="text-xs text-on-surface-variant mt-2">
                  {customer.orderCount} {customer.orderCount === 1 ? "order" : "orders"} · last{" "}
                  {formatDate(customer.lastOrderAt)}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-2">
                  View Details
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </span>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
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
          )}
        </>
      )}
    </div>
  );
}

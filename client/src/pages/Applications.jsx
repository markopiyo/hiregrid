import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import api, { setAuthToken } from "../lib/api";
import StatusBadge from "../components/StatusBadge";

export default function Applications() {
  const { getToken } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    getToken()
      .then((token) => {
        setAuthToken(token);
        return api.get("/api/applications");
      })
      .then((res) => {
        setApps(res.data);
        setLoading(false);
      });
  }, []);

  const filtered = apps.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Applications</h1>
        <Link
          to="/applications/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + New Application
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {["All", "Applied", "Interview", "Offer", "Rejected"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          No applications found.
        </p>
      ) : (
        filtered.map((app) => (
          <Link
            key={app._id}
            to={`/applications/${app._id}`}
            className="flex justify-between items-center p-4 border rounded-lg mb-2 hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">{app.company}</p>
              <p className="text-sm text-gray-500">{app.role}</p>
              {app.location && (
                <p className="text-xs text-gray-400">
                  {app.location}
                  {app.isRemote ? " · Remote" : ""}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <StatusBadge status={app.status} />
              <p className="text-xs text-gray-400">
                {new Date(app.dateApplied).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

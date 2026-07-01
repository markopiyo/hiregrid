import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import api, { setAuthToken } from "../lib/api";
import StatusBadge from "../components/StatusBadge";

export default function Dashboard() {
  const { getToken } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const stats = {
    total: apps.length,
    applied: apps.filter((a) => a.status === "Applied").length,
    interview: apps.filter((a) => a.status === "Interview").length,
    offer: apps.filter((a) => a.status === "Offer").length,
    rejected: apps.filter((a) => a.status === "Rejected").length,
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          ["Total", stats.total, "bg-slate-100"],
          ["Interview", stats.interview, "bg-yellow-50"],
          ["Offers", stats.offer, "bg-green-50"],
          ["Rejected", stats.rejected, "bg-red-50"],
        ].map(([label, val, bg]) => (
          <div key={label} className={`${bg} p-4 rounded-lg`}>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-3xl font-bold">{val}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-3">Recent Applications</h2>
      {apps.slice(0, 5).map((app) => (
        <Link
          key={app._id}
          to={`/applications/${app._id}`}
          className="flex justify-between items-center p-4 border rounded-lg mb-2 hover:bg-gray-50"
        >
          <div>
            <p className="font-medium">{app.company}</p>
            <p className="text-sm text-gray-500">{app.role}</p>
          </div>
          <StatusBadge status={app.status} />
        </Link>
      ))}
    </div>
  );
}

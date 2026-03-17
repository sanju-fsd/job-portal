import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";

const cardStyles = [
  "from-sky-600 to-sky-500",
  "from-amber-600 to-amber-500",
  "from-emerald-600 to-emerald-500",
  "from-violet-600 to-violet-500",
];

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
};

const toAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `http://localhost:5000${path}`;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      totalEmployers: 0,
      approvedEmployers: 0,
      pendingEmployers: 0,
      totalCandidates: 0,
    },
    employers: [],
    candidates: [],
    pendingEmployers: [],
  });

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_PATHS.ADMIN.DASHBOARD);
      setData(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const approveEmployer = async (employerId) => {
    try {
      await axios.patch(API_PATHS.ADMIN.APPROVE_EMPLOYER(employerId));
      setData((prev) => {
        const employers = prev.employers.map((emp) =>
          emp._id === employerId ? { ...emp, isApproved: true, isActive: true } : emp
        );
        const pendingEmployers = employers.filter((emp) => !emp.isApproved);
        return {
          ...prev,
          employers,
          pendingEmployers,
          stats: {
            ...prev.stats,
            approvedEmployers: employers.length - pendingEmployers.length,
            pendingEmployers: pendingEmployers.length,
          },
        };
      });
      toast.success("Employer approved");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to approve employer");
    }
  };

  const removeCandidate = async (candidateId) => {
    const confirmed = window.confirm("Delete this candidate account?");
    if (!confirmed) return;

    try {
      await axios.delete(API_PATHS.ADMIN.DELETE_CANDIDATE(candidateId));
      setData((prev) => ({
        ...prev,
        candidates: prev.candidates.filter((candidate) => candidate._id !== candidateId),
        stats: {
          ...prev.stats,
          totalCandidates: Math.max(0, (prev.stats.totalCandidates || 0) - 1),
        },
      }));
      toast.success("Candidate deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete candidate");
    }
  };

  const statCards = useMemo(
    () => [
      { label: "Total Employers", value: data.stats.totalEmployers },
      { label: "Pending Employers", value: data.stats.pendingEmployers },
      { label: "Approved Employers", value: data.stats.approvedEmployers },
      { label: "Total Candidates", value: data.stats.totalCandidates },
    ],
    [data.stats]
  );
  const recentEmployers = data.employers.slice(0, 3);
  const recentCandidates = data.candidates.slice(0, 3);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Manage employers, candidates, and approval activity.</p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card, idx) => (
            <div key={card.label} className={`rounded-xl p-5 bg-gradient-to-r text-white ${cardStyles[idx]}`}>
              <p className="text-sm text-white/80">{card.label}</p>
              <p className="text-3xl font-semibold mt-2">{card.value}</p>
            </div>
          ))}
        </div>

        {loading && <p className="text-gray-500">Loading dashboard...</p>}

        {!loading && (
          <>
            <div className="grid xl:grid-cols-2 gap-5">
              <section className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Employers</h2>
                    <p className="text-gray-500">Pending approvals and latest employer accounts.</p>
                  </div>
                  <button
                    onClick={() => navigate("/admin/employers")}
                    className="text-sm font-medium text-blue-600"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-3 mb-5">
                  <h3 className="text-sm font-medium text-gray-700">Approval Queue</h3>
                  {data.pendingEmployers.length === 0 ? (
                    <p className="text-sm text-gray-500">No pending employers.</p>
                  ) : (
                    data.pendingEmployers.slice(0, 3).map((employer) => (
                      <div
                        key={employer._id}
                        className="border rounded-xl p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                      >
                        <div>
                          <p className="font-medium">{employer.name}</p>
                          <p className="text-sm text-gray-500">{employer.email}</p>
                          <p className="text-sm text-gray-500">
                            {employer.companyName || "-"} · {formatDate(employer.createdAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => approveEmployer(employer._id)}
                          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm"
                        >
                          Approve
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Recent Employers</h3>
                  {recentEmployers.length === 0 && <p className="text-sm text-gray-500">No employers yet.</p>}
                  {recentEmployers.map((employer) => (
                    <div
                      key={employer._id}
                      className="border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{employer.name}</p>
                        <p className="text-sm text-gray-500">{employer.email}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          employer.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {employer.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Candidates</h2>
                    <p className="text-gray-500">Latest candidate accounts and resume availability.</p>
                  </div>
                  <button
                    onClick={() => navigate("/admin/candidates")}
                    className="text-sm font-medium text-blue-600"
                  >
                    View all
                  </button>
                </div>

                <div className="space-y-3">
                  {recentCandidates.length === 0 && <p className="text-sm text-gray-500">No candidates yet.</p>}
                  {recentCandidates.map((candidate) => (
                    <div
                      key={candidate._id}
                      className="border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {candidate.profileImageUrl ? (
                          <img
                            src={toAssetUrl(candidate.profileImageUrl)}
                            alt={candidate.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {candidate.name?.charAt(0) || "C"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{candidate.name}</p>
                          <p className="text-sm text-gray-500 truncate">{candidate.email}</p>
                          <p className="text-xs text-gray-500">
                            Applied: {candidate.appliedCount || 0} · Selected: {candidate.selectedCount || 0}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-500">{formatDate(candidate.createdAt)}</p>
                        {candidate.resumeUrl ? (
                          <a
                            href={toAssetUrl(candidate.resumeUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 text-sm"
                          >
                            View Resume
                          </a>
                        ) : (
                          <p className="text-sm text-gray-400">No Resume</p>
                        )}
                        <button
                          onClick={() => removeCandidate(candidate._id)}
                          className="text-xs text-red-600 mt-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

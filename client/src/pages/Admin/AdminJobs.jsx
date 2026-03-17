import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
};

export default function AdminJobs() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API_PATHS.ADMIN.JOBS);
      setJobs(data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const totals = useMemo(
    () => ({
      applied: jobs.reduce((sum, job) => sum + (job.appliedCount || 0), 0),
      selected: jobs.reduce((sum, job) => sum + (job.selectedCount || 0), 0),
      rejected: jobs.reduce((sum, job) => sum + (job.rejectedCount || 0), 0),
    }),
    [jobs]
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
          <p className="text-gray-500">All jobs posted by employers with candidate application status counts.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <StatTile label="Total Jobs" value={jobs.length} color="from-sky-600 to-sky-500" />
          <StatTile label="Applied" value={totals.applied} color="from-blue-600 to-blue-500" />
          <StatTile label="Selected" value={totals.selected} color="from-emerald-600 to-emerald-500" />
          <StatTile label="Rejected" value={totals.rejected} color="from-rose-600 to-rose-500" />
        </div>

        <section className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Job List</h2>

          {loading ? (
            <p className="text-gray-500">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-500">No jobs found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[920px]">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">Title</th>
                    <th className="pb-2">Company</th>
                    <th className="pb-2">Employer</th>
                    <th className="pb-2">Applied</th>
                    <th className="pb-2">Selected</th>
                    <th className="pb-2">Rejected</th>
                    <th className="pb-2">Job Status</th>
                    <th className="pb-2">Posted</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id} className="border-b last:border-0">
                      <td className="py-2 font-medium text-gray-900">{job.title}</td>
                      <td className="py-2">{job.company || "-"}</td>
                      <td className="py-2">{job.employer?.name || "-"}</td>
                      <td className="py-2">{job.appliedCount || 0}</td>
                      <td className="py-2">{job.selectedCount || 0}</td>
                      <td className="py-2">{job.rejectedCount || 0}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            (job.status || "active") === "closed"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {(job.status || "active") === "closed" ? "Closed" : "Active"}
                        </span>
                      </td>
                      <td className="py-2">{formatDate(job.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

function StatTile({ label, value, color }) {
  return (
    <div className={`rounded-xl p-5 bg-gradient-to-r text-white ${color}`}>
      <p className="text-sm text-white/80">{label}</p>
      <p className="text-3xl font-semibold mt-2">{value}</p>
    </div>
  );
}

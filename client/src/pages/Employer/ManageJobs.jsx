import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Search, Trash2, Users,MoreVertical, Lock, LockOpen, LockKeyholeOpen } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export default function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const { data: jobsData } = await axios.get(API_PATHS.JOBS.MY);
      const jobsList = jobsData || [];

      const appCounts = await Promise.all(
        jobsList.map(async (job) => {
          try {
            const { data } = await axios.get(API_PATHS.APPLICATIONS.BY_JOB(job._id));
            return [job._id, (data || []).length];
          } catch {
            return [job._id, 0];
          }
        })
      );

      const countsMap = Object.fromEntries(appCounts);
      setJobs(jobsList.map((job) => ({ ...job, applicantsCount: countsMap[job._id] || 0 })));
    } catch (err) {
      console.error("Failed to load employer jobs", err);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const visibleJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title?.toLowerCase().includes(search.toLowerCase()) ||
        job.company?.toLowerCase().includes(search.toLowerCase());

      const status = job.status || "active";
      const matchesStatus = statusFilter === "all" ? true : status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  const removeJob = async (jobId) => {
    const confirmed = window.confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    try {
      await axios.delete(API_PATHS.JOBS.DELETE(jobId));
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      toast.success("Job deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleJobStatus = async (job) => {
    const nextStatus = (job.status || "active") === "closed" ? "active" : "closed";
    try {
      await axios.put(API_PATHS.JOBS.UPDATE(job._id), { status: nextStatus });
      setJobs((prev) => prev.map((item) => (item._id === job._id ? { ...item, status: nextStatus } : item)));
      toast.success(`Job ${nextStatus === "closed" ? "closed" : "reopened"}`);
    } catch {
      toast.error("Failed to update job status");
    }
  };

  return (
    <DashboardLayout role="employer">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900">Job Management</h1>
          </div>
          <button
            onClick={() => navigate("/employer/jobs/new")}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-sm"
          >
            Add New Job
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 flex-wrap mb-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-3 text-gray-400 " size={18} />
              <input
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-10 py-2.5 focus_field"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 focus_field bg-white min-w-[160px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Showing {visibleJobs.length} of {jobs.length} jobs
          </p>

          {loading && <p className="text-gray-500">Loading jobs...</p>}

          {!loading && (
            <div className="overflow-visible">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="py-3">JOB TITLE</th>
                    <th className="py-3">STATUS</th>
                    <th className="py-3">APPLICANTS</th>
                    <th className="py-3">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleJobs.map((job) => {
                    const status = job.status || "active";
                    return (
                      <tr key={job._id} className="border-b last:border-0">
                        <td className="py-4">
                          <p className="font-semibold text-gray-900">{job.title}</p>
                          <p className="text-sm text-gray-500">{job.company}</p>
                        </td>
                        <td className="py-4">
                          <span
                            className={`text-xs px-3 py-1 rounded-full ${
                              status === "closed" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                            }`}
                          >
                            {status === "closed" ? "Closed" : "Active"}
                          </span>
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => navigate(`/employer/jobs/${job._id}/applications`)}
                            className="flex items-center gap-2 text-blue-600"
                          >
                            <Users size={16} />
                            {job.applicantsCount || 0}
                          </button>
                        </td>
                        <td className="py-4">
                          {/* <div className="flex items-center gap-3"> */}
                            <div className="relative">
                              <button
                                onClick={() => setOpenMenu(openMenu === job._id ? null : job._id)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                              >
                                <MoreVertical size={18} />
                              </button>

                              {openMenu === job._id && (
                                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-200">
                                  
                                  <button
                                    onClick={() => navigate(`/jobs/${job._id}`)}
                                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
                                  >
                                    <Eye size={16} /> View Job
                                  </button>

                                  <button
                                    onClick={() => navigate(`/employer/jobs/${job._id}/edit`)}
                                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
                                  >
                                    <Pencil size={16} /> Edit Job
                                  </button>

                                  <button
                                      onClick={() => toggleJobStatus(job)}
                                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
                                    >
                                      {status === "closed" ? (
                                        <>
                                          <LockKeyholeOpen size={16} color="green" /> Reopen Job
                                        </>
                                      ) : (
                                        <>
                                          <Lock size={16} color="orange" /> Close Job
                                        </>
                                      )}
                                    </button>

                                  <button
                                    onClick={() => removeJob(job._id)}
                                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-red-600 text-sm"
                                  >
                                    <Trash2 size={16} /> Delete Job
                                  </button>

                                </div>
                              )}
                            
                              </div>
                          {/* </div> */}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && visibleJobs.length === 0 && (
            <div className="text-center py-8 text-gray-500">No jobs match the selected filters.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}


{/* <button
                              title="View Job"
                              onClick={() => navigate(`/jobs/${job._id}`)}
                              className="text-gray-600 hover:text-blue-600"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              title="Edit Job"
                              onClick={() => navigate(`/employer/jobs/${job._id}/edit`)}
                              className="text-gray-600 hover:text-blue-600"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              title={status === "closed" ? "Reopen Job" : "Close Job"}
                              onClick={() => toggleJobStatus(job)}
                              className={status === "closed" ? "text-emerald-600 hover:text-emerald-700 text-sm" : "text-orange-600 hover:text-orange-700 text-sm"}
                            >
                              {status === "closed" ? "Reopen" : "Close"}
                            </button>
                            <button
                              title="Delete Job"
                              onClick={() => removeJob(job._id)}
                              className="text-red-600 hover:text-red-700"
                              >
                              <Trash2 size={16} />
                            </button> */}
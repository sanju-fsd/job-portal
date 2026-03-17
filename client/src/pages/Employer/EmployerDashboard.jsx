import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, CirclePlus, Settings, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const cardStyles = [
  "from-blue-600 to-blue-500",
  "from-emerald-600 to-emerald-500",
  "from-violet-600 to-violet-500",
];

const formatDate = (value) => new Date(value).toLocaleDateString();

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ activeJobs: 0, applicants: 0, hired: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: jobsData }, { data: statsData }] = await Promise.all([
          axios.get(API_PATHS.JOBS.MY),
          axios.get(API_PATHS.JOBS.STATS),
        ]);

        const jobsList = jobsData || [];
        setJobs(jobsList);
        setStats(statsData || { activeJobs: 0, applicants: 0, hired: 0 });

        const appResponses = await Promise.allSettled(
          jobsList.map((job) => axios.get(API_PATHS.APPLICATIONS.BY_JOB(job._id)))
        );

        const mergedApps = appResponses
          .flatMap((res, idx) => {
            if (res.status !== "fulfilled") return [];
            const job = jobsList[idx];
            return (res.value.data || []).map((app) => ({
              ...app,
              jobId: job?._id,
              jobTitle: job?.title || "Job",
            }));
          })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setApplications(mergedApps);
      } catch (err) {
        console.error("Failed to load employer dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const summaryCards = useMemo(
    () => [
      { label: "Active Jobs", value: stats.activeJobs },
      { label: "Total Applicants", value: stats.applicants },
      { label: "Hired", value: stats.hired },
    ],
    [stats]
  );

  const recentJobs = jobs.slice(0, 3);
  const recentApplications = applications.slice(0, 3);

  return (
    <DashboardLayout role="employer">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back!</h1>
          <p className="text-gray-500">Here&apos;s what&apos;s happening with your jobs today.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {summaryCards.map((card, idx) => (
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
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-semibold text-gray-900">Recent Job Posts</h2>
                    <p className="text-gray-500">Your latest job postings</p>
                  </div>
                  <button onClick={() => navigate("/employer/jobs")} className="text-blue-600 text-sm font-medium">
                    View all
                  </button>
                </div>

                <div className="space-y-3">
                  {recentJobs.length === 0 && <p className="text-sm text-gray-500">No jobs posted yet.</p>}
                  {recentJobs.map((job) => (
                    <button
                      key={job._id}
                      onClick={() => navigate(`/employer/jobs/${job._id}/edit`)}
                      className="w-full text-left border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between hover:bg-gray-50 hover:border-blue-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                          <BriefcaseBusiness size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{job.title}</p>
                          <p className="text-sm text-gray-500">
                            {job.location} · {formatDate(job.createdAt)}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${job.status === "closed" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {job.status === "closed" ? "Closed" : "Active"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-semibold text-gray-900">Recent Applications</h2>
                    <p className="text-gray-500">Latest candidate applications</p>
                  </div>
                  <button onClick={() => navigate("/employer/jobs")} className="text-blue-600 text-sm font-medium">
                    View all
                  </button>
                </div>

                <div className="space-y-3">
                  {recentApplications.length === 0 && <p className="text-sm text-gray-500">No applications yet.</p>}
                  {recentApplications.map((app) => (
                    <button
                      key={app._id}
                      onClick={() => navigate(`/employer/jobs/${app.jobId}/applications`)}
                      className="w-full text-left border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between hover:bg-gray-50 hover:border-blue-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                          {(app.candidate?.name || "C").charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{app.candidate?.name || "Candidate"}</p>
                          <p className="text-sm text-gray-500">{app.jobTitle}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(app.createdAt)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="text-3xl font-semibold text-gray-900">Quick Actions</h2>
              <p className="text-gray-500 mb-4">Common tasks to get you started</p>
              <div className="grid md:grid-cols-3 gap-3">
                <ActionTile
                  icon={<CirclePlus size={18} />}
                  label="Post New Job"
                  onClick={() => navigate("/employer/jobs/new")}
                />
                <ActionTile
                  icon={<UserRound size={18} />}
                  label="Review Applications"
                  onClick={() => navigate("/employer/jobs")}
                />
                <ActionTile
                  icon={<Settings size={18} />}
                  label="Company Settings"
                  onClick={() => navigate("/employer/company-profile")}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function ActionTile({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="border border-gray-200 rounded-xl px-4 py-4 flex items-center gap-3 hover:bg-gray-50 hover:border-blue-300">
      <span className="h-9 w-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">{icon}</span>
      <span className="font-medium text-gray-800">{label}</span>
    </button>
  );
}

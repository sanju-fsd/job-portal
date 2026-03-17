import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { Briefcase, Eye, BookmarkCheck,CircleCheckBig } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CandidateDashboard() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [stats, setStats] = useState({
    applied: 0,
    reviewed: 0,
    shortlisted: 0,
    views: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(API_PATHS.APPLICATIONS.MY);
        const applications = data || [];
console.log(applications);

        setApps(applications);

          setStats({
            applied: applications.length,

            accepted: applications.filter(
              (a) => (a.status || "").toLowerCase() === "accepted"
            ).length,

            rejected: applications.filter(
              (a) => (a.status || "").toLowerCase() === "rejected"
            ).length,

            interview: applications.filter(
              (a) => (a.status || "").toLowerCase() === "interview"
            ).length,
            
          });
      } catch (err) {
        console.error("Dashboard load failed", err);
      }
    };

    load();
  }, []);

  return (
    <DashboardLayout role="candidate">
      {/* <h1 className="text-2xl font-semibold mb-6">
      </h1>
        Applications statistics */}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-5 mb-6">
        <StatCard
          icon={<Briefcase />}
          title="Applied Jobs"
          value={stats.applied}
          color="blue"
        />
        <StatCard icon={<CircleCheckBig />} title="Accepeted" value={stats.accepted} color="yellow" />
        <StatCard icon={<Eye />} title="Rejected" value={stats.rejected} color="red" />
        <StatCard
          icon={<BookmarkCheck />}
          title="Shortlisted"
          value={stats.interview}
          color="green"
        />
      </div>

      {/* Recently Applied Jobs */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4">
          Jobs Applied Recently
        </h2>

        {apps.length === 0 && (
          <p className="text-gray-500">No applications yet.</p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
  {apps.map((app) => {
    const job = app.job;

    if (!job) return null;

    return (
      <div
        key={app._id}
        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {job.title}
            </h3>

            <p className="text-gray-600 text-sm">
              {job.company}
            </p>

            <p className="text-gray-500 text-sm">
              {job.location}
            </p>
          </div>

          {/* Status Badge */}
          <span
            className={`text-xs px-3 py-1 rounded-full capitalize
              ${
                app.status === "accepted"
                  ? "bg-green-100 text-green-700"
                  : app.status === "rejected"
                  ? "bg-red-100 text-red-600"
                  : app.status === "interview"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-600"
              }`}
          >
            {app.status || "Pending"}
          </span>
        </div>

        {/* Job Tags */}
        <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
          <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-1">
            {job.jobType || "Full-time"}
          </span>

          {job.experienceLevel && (
            <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-1">
              {job.experienceLevel}
            </span>
          )}
        </div>

        {/* Salary + Time */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <span>
            {job.salary ? `Rs ${job.salary}` : "Salary not disclosed"}
          </span>

          <button title="View Job"
            onClick={() => navigate(`/jobs/${job._id}`)}
            className="bg-blue-600 text-white p-2 rounded-lg"
          >
            View
          </button>
                {/* <button onClick={() => navigate(`/jobs/${selectedJob._id}`)} className="w-full bg-blue-600 text-white py-2.5 rounded-lg">
                  View Full Job
                </button> */}
        </div>
      </div>
    );
  })}
</div>
      </div>
    </DashboardLayout>
  );
}

/* Stat Card */
function StatCard({ icon, title, value, color }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    yellow: "text-yellow-600 bg-yellow-50",
    red: "text-red-600 bg-red-50",
    green: "text-green-600 bg-green-50",
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-semibold">{value}</p>
        <p className="text-gray-500 text-sm">{title}</p>
      </div>
    </div>
  );
}

export default CandidateDashboard;
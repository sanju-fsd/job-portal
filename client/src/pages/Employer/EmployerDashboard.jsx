import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/layout/StatCard";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export default function EmployerDashboard() {
  const [stats, setStats] = useState({});
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await axios.get(API_PATHS.JOBS.STATS);
      console.log(data);
      
      setStats(data);

      const jobsRes = await axios.get(API_PATHS.JOBS.MY);
      setJobs(jobsRes.data);
    }
    
    load();
  }, []);

  return (
    <DashboardLayout role="employer">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard title="Active Jobs" value={stats.activeJobs || 0} color="bg-blue-500" />
        <StatCard title="Applicants" value={stats.applicants || 0} color="bg-green-500" />
        <StatCard title="Hired" value={stats.hired || 0} color="bg-purple-500" />
      </div>

      {/* Recent Jobs */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="font-semibold mb-3">Recent Jobs</h3>

        {jobs.map((job) => (
          <div key={job._id} className="border-b py-2">
            <p className="font-medium">{job.title}</p>
            <p className="text-sm text-gray-500">{job.location}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
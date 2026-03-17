import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import JobCard from "../../components/cards/JobCard";

function SavedJobs() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSavedJobs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API_PATHS.SAVED_JOBS.LIST);
      setSavedJobs(data || []);
    } catch (err) {
      console.error("Failed to load saved jobs", err);
      toast.error("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const removeSaved = async (jobId) => {
    try {
      await axios.delete(API_PATHS.SAVED_JOBS.REMOVE(jobId));
      setSavedJobs((prev) => prev.filter((item) => item.job?._id !== jobId));
      toast.success("Removed from saved jobs");
    } catch (err) {
      console.error("Failed to remove saved job", err);
      toast.error("Failed to remove saved job");
    }
  };

  return (
    <DashboardLayout role="candidate">
  <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>

  {loading && <p className="text-gray-500">Loading...</p>}

  {!loading && savedJobs.filter((item) => item.job?._id).length === 0 && (
    <p className="text-gray-500">No saved jobs.</p>
  )}

  <div className="space-y-3">
    {savedJobs
      .filter((item) => item.job?._id)
      .map((item) => (
        <JobCard
          key={item._id}
          job={item.job}
          onView={() => navigate(`/jobs/${item.job._id}`)}
          viewLabel="View"
          footerActions={[
            {
              label: "Remove",
              onClick: () => removeSaved(item.job._id),
              className: "px-3 py-1.5 rounded border border-red-500 text-red-500",
            },
          ]}
        />
      ))}
  </div>
</DashboardLayout>
  );
}

export default SavedJobs;

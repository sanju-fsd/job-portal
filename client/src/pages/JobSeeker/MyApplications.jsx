import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(API_PATHS.APPLICATIONS.MY);
        setApplications(data || []);
      } catch (err) {
        console.error("Failed to load applications", err);
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <DashboardLayout role="candidate">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {!loading && applications.length === 0 && <p className="text-gray-500">No applications yet.</p>}

      <div className="space-y-3">
        {applications.map((app) => (
          <div key={app._id} className="bg-white rounded-xl shadow p-4 border">
            <p className="font-semibold">{app.job?.title || "Job"}</p>
            <p className="text-sm text-gray-500">{app.job?.company}</p>
            <p className="text-sm mt-2">
              Status: <span className="font-medium capitalize">{app.status}</span>
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default MyApplications;

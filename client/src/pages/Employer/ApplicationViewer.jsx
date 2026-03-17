import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, Download, Link2, Plus, X, ChevronLeft  } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

function ApplicationViewer() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(jobId || "");

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const { data } = await axios.get(API_PATHS.JOBS.MY);
        setJobs(data || []);

        if (!selectedJobId && data?.length) {
          setSelectedJobId(data[0]._id);
        }
      } catch (err) {
        console.error("Failed to load jobs", err);
        toast.error("Failed to load jobs");
      }
    };

    loadJobs();
  }, []);

  useEffect(() => {
    if (!selectedJobId) return;

    const loadApplications = async () => {
      try {
        const { data } = await axios.get(API_PATHS.APPLICATIONS.BY_JOB(selectedJobId));
        setApplications(data || []);
        console.log(data);
        
      } catch (err) {
        console.error("Failed to load applications", err);
        toast.error("Failed to load applications");
        setApplications([]);
      }
    };

    loadApplications();
  }, [selectedJobId]);

  const updateStatus = async (applicationId, status) => {
    try {
      const { data } = await axios.put(API_PATHS.APPLICATIONS.UPDATE_STATUS(applicationId), {
        status,
      });

      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, ...data } : app))
      );
      toast.success(`Application marked as ${status}`);
    } catch (err) {
      console.error("Status update failed", err);
      toast.error("Status update failed");
    }
  };
  
  const getStatusStyle = (status) => {
  switch (status) {
    case "accepted":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    case "interview":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

  return (
    <DashboardLayout role="employer">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Applicants Jobs</h1>
        <button
          className="px-2 py-2 flex items-center gap-1 rounded-xl border bg-blue-200 border-blue-200 "
          onClick={() => navigate("/employer/jobs")}
        >
          <ChevronLeft />Back 
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <label className="text-sm text-gray-500">Select Job</label>
        <select
          value={selectedJobId}
          onChange={(e) => {
            const nextId = e.target.value;
            setSelectedJobId(nextId);
            navigate(`/employer/jobs/${nextId}/applications`);
          }}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus_field"
        >
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {applications.length === 0 && (
          <p className="text-gray-500">No applications for this job yet.</p>
        )}

        {applications.map((app) => (
          <div key={app._id} className="bg-white rounded-xl p-6 border border-gray-200 flex justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-xl">{app.candidate?.name || "Candidate"}</p>
                <span className={`text-xs px-2 py-1 rounded capitalize ${getStatusStyle(app.status)}`}>{app.status}</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">{app.candidate?.email}</p>
              <p className="text-sm text-gray-500 mt-2">Applied date: {new Date(app.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="flex items-center gap-3 text-blue-600">
              <button className="h-8 w-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center" onClick={() => updateStatus(app._id, "interview")}><Plus size={18} /></button>
              <button className="h-8 w-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center" onClick={() => updateStatus(app._id, "accepted")}><Check size={18} /></button>
              <button  disabled={!app.candidate?.resumeUrl} onClick={() => window.open(app.candidate?.resumeUrl)}
                      className="h-8 w-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center disabled:opacity-40">
                <Download size={18} />
              </button>
              <button className="h-8 w-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center" onClick={() => updateStatus(app._id, "rejected")}><X size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default ApplicationViewer;

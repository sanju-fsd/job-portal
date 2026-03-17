import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import JobCard from "../../components/cards/JobCard";

function JobDetails() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [hasApplied, setHasApplied] = useState(false);

useEffect(() => {
  const load = async () => {
    try {
      setLoading(true);

      // 1️⃣ Get job details
      const jobRes = await axios.get(
        API_PATHS.JOBS.DETAILS(jobId)
      );

      setJob(jobRes.data);

      // 2️⃣ Get saved jobs (only for candidate)
      if (user?.role === "candidate") {
        const [savedRes, myAppsRes] = await Promise.all([
          axios.get(API_PATHS.SAVED_JOBS.LIST),
          axios.get(API_PATHS.APPLICATIONS.MY),
        ]);

        const saved = (savedRes.data || []).some(
          (item) => item.job?._id === jobId
        );
        const alreadyApplied = (myAppsRes.data || []).some(
          (item) => item.job?._id === jobId
        );

        setIsSaved(saved);
        setHasApplied(alreadyApplied);
      }

      // 3️⃣ Get related jobs from same employer
      if (jobRes.data?.employer?._id) {
        const rel = await axios.get(
          API_PATHS.JOBS.BY_EMPLOYER(jobRes.data.employer._id),
          { params: { exclude: jobId } }
        );

        setRelatedJobs(rel.data);
      }

    } catch (err) {
      const errMsg = err?.response?.data?.message || "Failed to load job";
      setMessage(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  load();
}, [jobId, user?.role]);


const apply = async () => {
  try {
    setMessage("");
    await axios.post(API_PATHS.APPLICATIONS.APPLY, { jobId, coverLetter });

    setHasApplied(true); 
    toast.success("Job applied successfully");
  } catch (err) {
    toast.error(err?.response?.data?.message || "Application failed");
  }
};

  const toggleSave = async () => {
    try {
      setMessage("");
      if (isSaved) {
        await axios.delete(API_PATHS.SAVED_JOBS.REMOVE(jobId));
        setIsSaved(false);
        toast.success("Removed from saved jobs");
      } else {
        await axios.post(API_PATHS.SAVED_JOBS.SAVE(jobId));
        setIsSaved(true);
        toast.success("Job saved");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unable to update saved job");
    }
  };

  if (loading) return <div className="pt-24 px-4">Loading job...</div>;
  if (!job) return <div className="pt-24 px-4">Job not found.</div>;

  return (
    <section className="bg-gray-50 pt-24 pb-16">
  {/* HERO */}
  <div className="bg-white border-b">
    <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center font-bold text-xl">
          {job.company?.charAt(0)}
        </div>

        <div>
          <h1 className="text-xl font-bold">{job.title}</h1>
          <p className="text-gray-500 text-sm">
            {job.company} • {job.location}
          </p>

          <div className="flex gap-2 mt-2 text-xs">
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
              {job.jobType}
            </span>
            {job.salary && (
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded">
                {job.salary}
              </span>
            )}
          </div>
        </div>
      </div>

      {user?.role === "candidate" && (
  <div className="flex gap-3">
    <button
      onClick={apply}
      disabled={hasApplied}
      className={`px-5 py-2 rounded-lg text-white transition ${
        hasApplied
          ? "bg-green-600 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {hasApplied ? "Applied" : "Apply Now"}
    </button>

    <button
      onClick={toggleSave}
      className="border px-4 py-2 rounded-lg"
    >
      {isSaved ? "Saved" : "Save"}
    </button>
  </div>
)}
    </div>
  </div>

  {/* BODY */}
  <div className="max-w-6xl mx-auto px-4 mt-8 grid md:grid-cols-3 gap-6">
    {/* LEFT */}
    <div className="md:col-span-2 space-y-6">
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="font-semibold text-lg mb-3">Job Description</h2>
        <p className="text-gray-600 whitespace-pre-wrap">
          {job.description}
        </p>
      </div>
    </div>

    {/* RIGHT SIDEBAR */}
    <div className="bg-white rounded-xl p-6 shadow h-fit">
      <h3 className="font-semibold mb-4">Job Overview</h3>

      <div className="space-y-3 text-sm text-gray-600">
        <p><strong>Company:</strong> {job.company}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Type:</strong> {job.jobType}</p>
        {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
      </div>
    </div>
  </div>

  {/* RELATED JOBS */}
  {relatedJobs.length > 0 && (
    <div className="max-w-6xl mx-auto px-4 mt-12">
      <h3 className="text-lg font-semibold mb-4">
        More jobs from this employer
      </h3>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {relatedJobs.map((j) => (
          <JobCard
            key={j._id}
            job={j}
            onView={() => navigate(`/jobs/${j._id}`)}
            viewLabel="View Job"
          />
        ))}
      </div>
    </div>
  )}
</section>
  );
}

export default JobDetails;

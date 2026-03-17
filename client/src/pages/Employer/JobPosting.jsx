import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const listToText = (value) => (Array.isArray(value) ? value.join(", ") : value || "");
const textToList = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function PostJob() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const isEditMode = Boolean(jobId);

  const categories = [
    "IT & Software",
    "Marketing",
    "Finance",
    "Healthcare",
    "Education",
    "Design",
    "Engineering",
  ];

  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote"];
  const experienceOptions = ["Entry", "Mid", "Senior"];

  const [form, setForm] = useState({
    title: "",
    company: "",
    category: categories[0],
    jobType: jobTypes[0],
    experienceLevel: experienceOptions[0],
    location: "",
    salary: "",
    openings: 1,
    skills: "",
    tags: "",
    requirements: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isEditMode) return;

    const loadJob = async () => {
      try {
        setPageLoading(true);
        const { data } = await axios.get(API_PATHS.JOBS.DETAILS(jobId));

        setForm({
          title: data.title || "",
          company: data.company || "",
          category: data.category || categories[0],
          jobType: data.jobType || jobTypes[0],
          experienceLevel: data.experienceLevel || experienceOptions[0],
          location: data.location || "",
          salary: data.salary || "",
          openings: data.openings || 1,
          skills: listToText(data.skills),
          tags: listToText(data.tags),
          requirements: listToText(data.requirements),
          description: data.description || "",
        });
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load job details");
      } finally {
        setPageLoading(false);
      }
    };

    loadJob();
  }, [isEditMode, jobId]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.title || !form.company || !form.location || !form.description) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: form.title,
        company: form.company,
        category: form.category,
        jobType: form.jobType,
        experienceLevel: form.experienceLevel,
        location: form.location,
        salary: form.salary,
        openings: Number(form.openings) > 0 ? Number(form.openings) : 1,
        skills: textToList(form.skills),
        tags: textToList(form.tags),
        requirements: textToList(form.requirements),
        description: form.description,
      };

      if (isEditMode) {
        await axios.put(API_PATHS.JOBS.UPDATE(jobId), payload);
        toast.success("Job updated");
      } else {
        await axios.post(API_PATHS.JOBS.CREATE, payload);
        toast.success("Job added");
      }

      navigate("/employer/jobs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <DashboardLayout role="employer">
        <p className="text-gray-500">Loading job details...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="employer">
      <div className="bg-white p-8 rounded-xl shadow max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          {isEditMode ? "Edit Job" : "Submit Job"}
        </h2>

        <form onSubmit={submit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Company Name *</label>
              <input
                name="company"
                value={form.company}
                onChange={change}
                className="input focus_field"
                placeholder="e.g. Acme Corp"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Job Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={change}
                className="input focus_field"
                placeholder="e.g. Frontend Developer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Job Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={change}
              rows={5}
              className="input focus_field"
              placeholder="Write job responsibilities..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">Category</label>
              <select name="category" value={form.category} onChange={change} className="input focus_field">
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Job Type</label>
              <select name="jobType" value={form.jobType} onChange={change} className="input focus_field">
                {jobTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Experience</label>
              <select
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={change}
                className="input focus_field"
              >
                {experienceOptions.map((exp) => (
                  <option key={exp}>{exp}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Location *</label>
              <input
                name="location"
                value={form.location}
                onChange={change}
                className="input focus_field"
                placeholder="e.g. Chennai"
              />
            </div>

            <div>
              <label className="label">Salary</label>
              <input
                name="salary"
                type="number"
                value={form.salary}
                onChange={change}
                className="input focus_field"
                placeholder="e.g. 30000 - 50000"
              />
            </div>

            <div>
              <label className="label">Openings</label>
              <input
                name="openings"
                type="number"
                min="1"
                value={form.openings}
                onChange={change}
                className="input focus_field"
                placeholder="e.g. 3"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">Skills (comma separated)</label>
              <input
                name="skills"
                value={form.skills}
                onChange={change}
                className="input focus_field"
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div>
              <label className="label">Tags (comma separated)</label>
              <input
                name="tags"
                value={form.tags}
                onChange={change}
                className="input focus_field"
                placeholder="Urgent, Onsite, Fresher"
              />
            </div>
          </div>

          <div>
            <label className="label">Requirements (comma separated)</label>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={change}
              rows={3}
              className="input focus_field"
              placeholder="2+ years of experience, Good communication, Problem-solving"
            />
          </div>

          <button disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            {loading
              ? isEditMode
                ? "Updating..."
                : "Posting..."
              : isEditMode
                ? "Update Job"
                : "Publish Job"}
          </button>

          {message && <p className="text-sm text-red-500">{message}</p>}
        </form>
      </div>
    </DashboardLayout>
  );
}

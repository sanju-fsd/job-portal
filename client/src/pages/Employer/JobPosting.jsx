import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export default function PostJob() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    category: "",
    jobType: "Full-time",
    description: "",
    company: "",
    salary: "",
  });

  const [loading, setLoading] = useState(false);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      await axios.post(API_PATHS.JOBS.CREATE, form);

      alert(" Job posted successfully!");

      // reset form
      setForm({
        title: "",
        location: "",
        category: "",
        jobType: "Full-time",
        description: "",
        company: "",
        salary: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="employer">
      <div className="bg-white p-6 rounded-xl shadow max-w-3xl">
        <h2 className="text-xl font-bold mb-4">Post a New Job</h2>

        <form onSubmit={submit} className="space-y-4">
          <input name="title" placeholder="Job Title" value={form.title} onChange={change} className="input" />
          <input name="company" placeholder="Company" value={form.company} onChange={change} className="input" />
          <input name="location" placeholder="Location" value={form.location} onChange={change} className="input" />

          <div className="grid grid-cols-2 gap-4">
            <input name="category" placeholder="Category" value={form.category} onChange={change} className="input" />
            <select name="jobType" value={form.jobType} onChange={change} className="input">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Remote</option>
            </select>
          </div>

          <input name="salary" placeholder="Salary" value={form.salary} onChange={change} className="input" />

          <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={change}
            className="input h-32"
          />

          <button
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            {loading ? "Posting..." : "Publish Job"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
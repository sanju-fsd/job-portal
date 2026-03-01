import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import {
  Briefcase,
  MapPin,
  Clock,
  Search,
  LayoutGrid,
  List,
} from "lucide-react";

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
  });

  const [view, setView] = useState("list");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [sort, setSort] = useState("latest");
  const [totalPages, setTotalPages] = useState(1);

  // ================= FETCH =================
  useEffect(() => {
    fetchJobs();
  }, [filters, page, limit, sort]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(API_PATHS.JOBS.ALL, {
        params: { ...filters, page, limit, sort },
      });

      setJobs(res.data.jobs || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error("Jobs fetch failed", err);
      setJobs([]);
    }
  };

  const updateFilter = (key, value) => {
    setPage(1);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <section className="bg-gray-50 min-h-screen pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-6">

        {/* ================= SIDEBAR ================= */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow p-5 sticky top-24 space-y-4">
            <h3 className="font-semibold text-lg">Search Jobs</h3>

            {/* Keyword */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                placeholder="Keyword..."
                className="w-full border rounded-lg pl-10 py-2"
                onChange={e => updateFilter("search", e.target.value)}
              />
            </div>

            {/* Location */}
            <input
              placeholder="Location"
              className="w-full border rounded-lg px-3 py-2"
              onChange={e => updateFilter("location", e.target.value)}
            />

            {/* Job Type */}
            <select
              className="w-full border rounded-lg px-3 py-2"
              onChange={e => updateFilter("jobType", e.target.value)}
            >
              <option value="">Job Type</option>
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Freelance</option>
              <option>Internship</option>
            </select>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="md:col-span-3">

          {/* TOP BAR */}
          <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
            <p className="text-gray-500">
              Showing {jobs.length} jobs
            </p>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <select
                className="border rounded-lg px-3 py-2"
                onChange={e => setSort(e.target.value)}
              >
                <option value="latest">Latest</option>
                <option value="salary">Highest Salary</option>
              </select>

              {/* Per Page */}
              <select
                className="border rounded-lg px-3 py-2"
                onChange={e => setLimit(Number(e.target.value))}
              >
                <option value={6}>6 Per Page</option>
                <option value={12}>12 Per Page</option>
              </select>

              {/* View Toggle */}
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 ${view === "grid" ? "bg-blue-600 text-white" : ""}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 ${view === "list" ? "bg-blue-600 text-white" : ""}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* JOB LIST */}
          <div className={view === "grid"
            ? "grid md:grid-cols-2 gap-4"
            : "space-y-4"
          }>
            {jobs.map(job => (
              <div
                key={job._id}
                className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition"
              >
                <h2 className="font-bold text-lg">{job.title}</h2>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Briefcase size={16} />
                    {job.company}
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin size={16} />
                    {job.location}
                  </span>

                  <span className="flex items-center gap-1 text-blue-600">
                    <Clock size={16} />
                    {job.jobType}
                  </span>
                </div>

                {job.salary && (
                  <p className="text-green-600 font-semibold mt-2">
                    {job.salary}
                  </p>
                )}

                <button className="mt-3 bg-green-600 text-white px-4 py-1.5 rounded">
                  Apply Now
                </button>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center mt-6 gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white border"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
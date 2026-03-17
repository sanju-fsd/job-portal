import { useEffect, useMemo, useState } from "react";
import { Bookmark, Building2, Clock, Grid3X3, List, MapPin, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";


const EXPERIENCE_OPTIONS = [
  { label: "Any", value: "" },
  { label: "Entry", value: "Entry" },
  { label: "Mid", value: "Mid" },
  { label: "Senior", value: "Senior" },
];

const DEFAULT_FILTERS = {
  search: "",
  company: "",
  location: "",
  jobType: "",
  experienceLevel: "",
  salaryMin: "",
  salaryMax: "",
  skills: "",
  tags: "",
};

const timeAgo = (value) => {
  if (!value) return "-";
  const mins = Math.floor((Date.now() - new Date(value).getTime()) / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} min ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)} hr ago`;
  return `${Math.floor(mins / 1440)} day ago`;
};

export default function AllJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [saved, setSaved] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(6);
  const [sort, setSort] = useState("latest");
  

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(API_PATHS.JOBS.ALL, {
          params: { ...filters, page, limit, sort },
        });
        setJobs(data?.jobs || []);
        setTotalPages(data?.pages || 1);
      } catch (err) {
        console.error("Jobs fetch failed", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters, page, limit, sort]);

  useEffect(() => {
    if (!jobs.length) {
      setSelectedJobId("");
      return;
    }

    if (!jobs.some((job) => job._id === selectedJobId)) {
      setSelectedJobId(jobs[0]._id);
    }
  }, [jobs, selectedJobId]);

  const selectedJob = useMemo(() => jobs.find((job) => job._id === selectedJobId) || null, [jobs, selectedJobId]);

  const updateFilter = (key, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setPage(1);
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <section className="bg-[#f2f4f8] min-h-screen pt-24 pb-10">
      <div className="max-w-[1500px] mx-auto px-4 grid lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5 sticky top-24">
            <h2 className="text-2xl font-semibold text-gray-900">Filters</h2>

            <div>
              <label className="text-sm text-gray-500">Search Jobs</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  placeholder="Keyword"
                  value={filters.search}
                  className="input_field-jobs"
                  onChange={(e) => updateFilter("search", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">Company</label>
              <div className="relative mt-1">
                <Building2 className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  placeholder="Filter by company"
                  value={filters.company}
                  className="input_field-jobs"
                  onChange={(e) => updateFilter("company", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">Location</label>
              <input
                placeholder="City or remote"
                value={filters.location}
                className="input_field-jobs px-3 py-2.5 mt-1"
                onChange={(e) => updateFilter("location", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Job Type</label>
              <select
                value={filters.jobType}
                className="input_field-jobs px-3 py-2.5 mt-1 bg-white"
                onChange={(e) => updateFilter("jobType", e.target.value)}
              >
                <option value="">Any</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-500">Skills</label>
              <input
                placeholder="e.g. React"
                value={filters.skills}
                className="input_field-jobs px-3 py-2.5 mt-1"
                onChange={(e) => updateFilter("skills", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Tags</label>
              <input
                placeholder="e.g. Urgent"
                value={filters.tags}
                className="input_field-jobs px-3 py-2.5 mt-1"
                onChange={(e) => updateFilter("tags", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Experience</label>
              <select
                value={filters.experienceLevel}
                className="input_field-jobs px-3 py-2.5 mt-1 bg-white"
                onChange={(e) => updateFilter("experienceLevel", e.target.value)}
              >
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>


            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Salary Range</h3>
              <p className="text-sm text-gray-600 mb-3">
                Rs {filters.salaryMin.toLocaleString()} - Rs {filters.salaryMax.toLocaleString()}
              </p>

              <input
                type="range"
                min="0"
                max="200000"
                step="5000"
                value={filters.salaryMax}
                onChange={(e) => updateFilter("salaryMax", Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <button onClick={clearAllFilters} className="text-red-500 text-sm">
              Clear filters
            </button>
          </div>
        </aside>

        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-3xl font-semibold text-gray-900">Find Jobs</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg border border-gray-200 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("row")}
                className={`p-2 rounded-lg border border-gray-200 ${viewMode === "row" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-gray-500 text-sm">{jobs.length} jobs on this page</p>
            <div className="flex items-center gap-2">
              {/* <select value={sort} onChange={(e) => setSort(e.target.value)} 
              className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm">
                <option value="latest">Latest</option>
                <option value="salary">Highest Salary</option>
              </select> */}
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm focus_field" >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="salary_high">Highest Salary</option>
                    <option value="salary_low">Lowest Salary</option>
                    <option value="a_z">Job Title (A-Z)</option>
                    <option value="z_a">Job Title (Z-A)</option>
                </select>
              <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} 
                  className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm focus_field">
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={48}>48</option>

              </select>
            </div>
          </div>

          {loading && <p className="text-gray-500">Loading jobs...</p>}

          {!loading && jobs.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-500">No jobs found for selected filters.</div>
          )}

          <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-4" : "space-y-3"}>
            {jobs.map((job) => {
              const selected = selectedJobId === job._id;

              return (
                <div
                  key={job._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedJobId(job._id)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedJobId(job._id)}
                  className={`bg-white border rounded-xl p-4 transition ${selected ? "border-blue-600" : "border-gray-200 hover:border-blue-200"}`}
                >
                  <div className={`flex ${viewMode === "row" ? "items-center justify-between" : "items-start justify-between"} gap-3`}>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-gray-600 text-sm">{job.company}</p>
                      <p className="text-gray-500 text-sm">{job.location}</p>
                      {viewMode === "row" && (
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <span className="bg-gray-100 rounded-full px-2 py-1">{job.jobType || "Full-time"}</span>
                          {job.experienceLevel && <span className="bg-gray-100 rounded-full px-2 py-1">{job.experienceLevel}</span>}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSaved((prev) => (prev.includes(job._id) ? prev.filter((id) => id !== job._id) : [...prev, job._id]));
                      }}
                      className={saved.includes(job._id) ? "text-blue-600" : "text-gray-400"}
                    >
                      <Bookmark size={18} />
                    </button>
                  </div>

                  {viewMode === "grid" && (
                    <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
                      <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-1">{job.jobType || "Full-time"}</span>
                      {job.experienceLevel && <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-1">{job.experienceLevel}</span>}
                      <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-1">Openings: {job.openings || 1}</span>
                      {Array.isArray(job.skills) &&
                        job.skills.slice(0, 2).map((skill) => (
                          <span key={`${job._id}-${skill}`} className="bg-blue-50 text-blue-700 rounded-full px-2 py-1">
                            {skill}
                          </span>
                        ))}
                      {Array.isArray(job.tags) &&
                        job.tags.slice(0, 2).map((tag) => (
                          <span key={`${job._id}-tag-${tag}`} className="bg-amber-50 text-amber-700 rounded-full px-2 py-1">
                            #{tag}
                          </span>
                        ))}
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <span>{job.salary ? `Rs ${job.salary}` : "Salary not disclosed"}</span>
                    <span>{timeAgo(job.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className={`px-4 py-2 rounded-lg border text-sm ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-white"}`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg border text-sm ${page === pageNum ? "bg-blue-600 text-white border-blue-600" : "bg-white"}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className={`px-4 py-2 rounded-lg border text-sm ${page === totalPages ? "bg-gray-100 text-gray-400" : "bg-white"}`}
              >
                Next
              </button>
            </div>
          )}
        </div>

        <aside className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-24  h-[calc(100vh-7rem)] overflow-y-auto">
            {!selectedJob ? (
              <p className="text-gray-500">Select a job to preview details.</p>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-900">{selectedJob.title}</h3>
                <p className="text-gray-600">{selectedJob.company}</p>

                <div className="space-y-2 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <MapPin size={16} /> {selectedJob.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Building2 size={16} /> {selectedJob.jobType || "Full-time"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={16} /> {timeAgo(selectedJob.createdAt)}
                  </p>
                </div>

                <div className="border-t pt-4 h-30 ">
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-3">{selectedJob.description || "No description added."}</p>
                </div>

                <div className="border-t pt-4 space-y-3 text-sm text-gray-700">
                  <p><strong>Openings:</strong> {selectedJob.openings || 1}</p>
                  <p><strong>Skills:</strong> {Array.isArray(selectedJob.skills) && selectedJob.skills.length ? selectedJob.skills.join(", ") : "Not specified"}</p>
                  <p><strong>Tags:</strong> {Array.isArray(selectedJob.tags) && selectedJob.tags.length ? selectedJob.tags.join(", ") : "Not specified"}</p>
                  <p><strong>Requirements:</strong> {Array.isArray(selectedJob.requirements) && selectedJob.requirements.length ? selectedJob.requirements.join(", ") : "Not specified"}</p>
                </div>

                <button onClick={() => navigate(`/jobs/${selectedJob._id}`)} className="w-full bg-blue-600 text-white py-2.5 rounded-lg">
                  View Full Job
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

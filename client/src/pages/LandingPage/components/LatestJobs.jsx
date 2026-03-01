import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import JobCard from "../../../components/cards/JobCard";
import Loader from "../../../components/cards/Loader";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, List } from "lucide-react";

const LatestJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(API_PATHS.JOBS.ALL);
        setJobs(data.jobs || data);
        console.log(data.jobs);
        
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Latest Jobs
          </h2>
          <p className="text-gray-500 mt-2">
            Know your worth and find the job that qualifies your life
          </p>
        </div>

        {/* Toggle */}
        <div className="flex gap-3">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded ${
              view === "grid" ? "bg-blue-600 text-white" : "bg-white border"
            }`}
          >
            <LayoutGrid size={18} />
          </button>

          <button
            onClick={() => setView("list")}
            className={`p-2 rounded ${
              view === "list" ? "bg-blue-600 text-white" : "bg-white border"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Jobs */}
      <div
        className={
          view === "grid"
            ? "grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            : "flex flex-col gap-6"
        }
      >
        {jobs.slice(0, 4).map((job) => (
          <JobCard key={job._id} job={job} view={view} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <button
          onClick={() => navigate("/all-jobs")}
          className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700"
        >
          Load More Listing
        </button>
      </div>
    </section>
  );
};

export default LatestJobs;
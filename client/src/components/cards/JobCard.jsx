import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job, view }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/job/${job._id}`)}
      className={`cursor-pointer bg-white rounded-xl border hover:shadow-lg transition p-6 ${
        view === "list" ? "flex items-center gap-6" : ""
      }`}
    >
      {/* Logo */}
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold">
        {job.company?.charAt(0) || "J"}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">
          {job.title}
        </h3>

        <p className="text-sm text-green-600 mt-1">
          {job.company || "Company Name"}
        </p>
        <p className="text-sm text-green-600 mt-1">
          {job.employer?.company || job.company}
        </p>

        <p className="text-xs text-gray-500">
          {job.employer?.location}
        </p>

        <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
          <MapPin size={14} />
          {job.location || "Remote"}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
            {job.category || "General"}
          </span>
          <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
            {job.jobType || "Full Time"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
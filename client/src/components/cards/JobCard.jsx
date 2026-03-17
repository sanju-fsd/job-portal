import { Briefcase, Clock, MapPin } from "lucide-react";

const typeBadgeClasses = {
  "Full-time": "bg-blue-100 text-blue-700",
  "Part-time": "bg-purple-100 text-purple-700",
  Contract: "bg-yellow-100 text-yellow-700",
  Remote: "bg-green-100 text-green-700",
};

export default function JobCard({
  job,
  onView,
  viewLabel = "View / Apply",
  rightAction,
  footerActions = [],
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
      <div className="flex justify-between gap-6">
        <div className="flex gap-4 flex-1">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold">
            {job.company?.charAt(0) || "J"}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>

            <div className="flex flex-wrap gap-5 text-gray-500 mt-2 text-sm">
              <span className="flex items-center gap-1">
                <Briefcase size={14} /> {job.category || "General"}
              </span>

              <span className="flex items-center gap-1">
                <MapPin size={14} /> {job.location}
              </span>

              <span className="flex items-center gap-1">
                <Clock size={14} /> {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  typeBadgeClasses[job.jobType] || "bg-gray-100 text-gray-700"
                }`}
              >
                {job.jobType || "Full-time"}
              </span>

              {job.experienceLevel && (
                <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
                  {job.experienceLevel}
                </span>
              )}

              <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
                {job.salary ? `Rs ${job.salary}` : "Salary not disclosed"}
              </span>

              {onView && (
                <button
                  onClick={onView}
                  className="text-xs bg-blue-600 text-white rounded-full px-4 py-1.5 hover:bg-blue-700"
                >
                  {viewLabel}
                </button>
              )}
            </div>

            {footerActions.length > 0 && (
              <div className="mt-4 flex gap-2 flex-wrap">
                {footerActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className={action.className}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {rightAction ? <div>{rightAction}</div> : null}
      </div>
    </div>
  );
}

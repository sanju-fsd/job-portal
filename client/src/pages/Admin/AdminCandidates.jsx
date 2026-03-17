import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
};

const toAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `https://job-portal-1hxq.onrender.com${path}`;
};

export default function AdminCandidates() {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_PATHS.ADMIN.DASHBOARD);
      setCandidates(res.data?.candidates || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const resumeCount = useMemo(
    () => candidates.filter((candidate) => candidate.resumeUrl).length,
    [candidates]
  );
  const selectedCount = useMemo(
    () => candidates.reduce((sum, candidate) => sum + (candidate.selectedCount || 0), 0),
    [candidates]
  );

  const removeCandidate = async (candidateId) => {
    const confirmed = window.confirm("Delete this candidate account?");
    if (!confirmed) return;

    try {
      await axios.delete(API_PATHS.ADMIN.DELETE_CANDIDATE(candidateId));
      setCandidates((prev) => prev.filter((candidate) => candidate._id !== candidateId));
      toast.success("Candidate deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete candidate");
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Candidates</h1>
          <p className="text-gray-500">View all candidate accounts and resume availability.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-xl p-5 bg-gradient-to-r from-violet-600 to-violet-500 text-white">
            <p className="text-sm text-white/80">Total Candidates</p>
            <p className="text-3xl font-semibold mt-2">{candidates.length}</p>
          </div>
          <div className="rounded-xl p-5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
            <p className="text-sm text-white/80">Resumes Uploaded</p>
            <p className="text-3xl font-semibold mt-2">{resumeCount}</p>
          </div>
          <div className="rounded-xl p-5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
            <p className="text-sm text-white/80">Total Selected</p>
            <p className="text-3xl font-semibold mt-2">{selectedCount}</p>
          </div>
        </div>

        <section className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Candidate List</h2>

          {loading ? (
            <p className="text-gray-500">Loading candidates...</p>
          ) : candidates.length === 0 ? (
            <p className="text-gray-500">No candidates found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">Candidate</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Applied</th>
                    <th className="pb-2">Selected</th>
                    <th className="pb-2">Resume</th>
                    <th className="pb-2">Joined</th>
                    <th className="pb-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate._id} className="border-b last:border-0">
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          {candidate.profileImageUrl ? (
                            <img
                              src={toAssetUrl(candidate.profileImageUrl)}
                              alt={candidate.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              {candidate.name?.charAt(0) || "C"}
                            </div>
                          )}
                          <span>{candidate.name}</span>
                        </div>
                      </td>
                      <td className="py-2">{candidate.email}</td>
                      <td className="py-2">{candidate.appliedCount || 0}</td>
                      <td className="py-2">{candidate.selectedCount || 0}</td>
                      <td className="py-2">
                        {candidate.resumeUrl ? (
                          <a
                            href={toAssetUrl(candidate.resumeUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600"
                          >
                            View Resume
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-2">{formatDate(candidate.createdAt)}</td>
                      <td className="py-2">
                        <button
                          onClick={() => removeCandidate(candidate._id)}
                          className="bg-red-600 text-white rounded-lg px-3 py-1 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

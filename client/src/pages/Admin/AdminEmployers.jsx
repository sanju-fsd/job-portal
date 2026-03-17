import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
};

export default function AdminEmployers() {
  const [loading, setLoading] = useState(true);
  const [employers, setEmployers] = useState([]);

  const loadEmployers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_PATHS.ADMIN.DASHBOARD);
      setEmployers(res.data?.employers || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load employers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployers();
  }, []);

  const pendingCount = useMemo(
    () => employers.filter((employer) => !employer.isApproved).length,
    [employers]
  );

  const approveEmployer = async (employerId) => {
    try {
      await axios.patch(API_PATHS.ADMIN.APPROVE_EMPLOYER(employerId));
      setEmployers((prev) =>
        prev.map((employer) =>
          employer._id === employerId ? { ...employer, isApproved: true, isActive: true } : employer
        )
      );
      toast.success("Employer approved");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to approve employer");
    }
  };

  const toggleEmployerStatus = async (employerId, isActive) => {
    try {
      await axios.patch(API_PATHS.ADMIN.UPDATE_EMPLOYER_STATUS(employerId), { isActive });
      setEmployers((prev) =>
        prev.map((employer) =>
          employer._id === employerId
            ? { ...employer, isActive, isApproved: isActive ? true : employer.isApproved }
            : employer
        )
      );
      toast.success(isActive ? "Employer activated" : "Employer inactivated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update employer status");
    }
  };

  const removeEmployer = async (employerId) => {
    const confirmed = window.confirm("Delete this employer and all their jobs/applications?");
    if (!confirmed) return;

    try {
      await axios.delete(API_PATHS.ADMIN.DELETE_EMPLOYER(employerId));
      setEmployers((prev) => prev.filter((employer) => employer._id !== employerId));
      toast.success("Employer deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete employer");
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Employers</h1>
          <p className="text-gray-500">View all employer accounts and approve pending profiles.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-xl p-5 bg-gradient-to-r from-sky-600 to-sky-500 text-white">
            <p className="text-sm text-white/80">Total Employers</p>
            <p className="text-3xl font-semibold mt-2">{employers.length}</p>
          </div>
          <div className="rounded-xl p-5 bg-gradient-to-r from-amber-600 to-amber-500 text-white">
            <p className="text-sm text-white/80">Pending Employers</p>
            <p className="text-3xl font-semibold mt-2">{pendingCount}</p>
          </div>
          <div className="rounded-xl p-5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
            <p className="text-sm text-white/80">Approved Employers</p>
            <p className="text-3xl font-semibold mt-2">{employers.length - pendingCount}</p>
          </div>
        </div>

        <section className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Employer List</h2>

          {loading ? (
            <p className="text-gray-500">Loading employers...</p>
          ) : employers.length === 0 ? (
            <p className="text-gray-500">No employers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Company</th>
                    <th className="pb-2">Joined</th>
                    <th className="pb-2">Approval</th>
                    <th className="pb-2">Account</th>
                    <th className="pb-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employers.map((employer) => (
                    <tr key={employer._id} className="border-b last:border-0">
                      <td className="py-2">{employer.name}</td>
                      <td className="py-2">{employer.email}</td>
                      <td className="py-2">{employer.companyName || "-"}</td>
                      <td className="py-2">{formatDate(employer.createdAt)}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            employer.isApproved
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {employer.isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            employer.isActive === false
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {employer.isActive === false ? "Inactive" : "Active"}
                        </span>
                      </td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          {!employer.isApproved && (
                            <button
                              onClick={() => approveEmployer(employer._id)}
                              className="bg-blue-600 text-white rounded-lg px-3 py-1 text-xs"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => toggleEmployerStatus(employer._id, employer.isActive === false)}
                            className={`rounded-lg px-3 py-1 text-xs text-white ${
                              employer.isActive === false ? "bg-emerald-600" : "bg-orange-600"
                            }`}
                          >
                            {employer.isActive === false ? "Activate" : "Inactivate"}
                          </button>
                          <button
                            onClick={() => removeEmployer(employer._id)}
                            className="bg-red-600 text-white rounded-lg px-3 py-1 text-xs"
                          >
                            Delete
                          </button>
                        </div>
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

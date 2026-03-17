import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import { useAuth, getDefaultRouteForRole } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage/LandingPage";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import AuthModal from "./pages/Auth/AuthModal";
import Header from "./pages/LandingPage/components/Header";

import AllJobs from "./pages/Public/AllJobs";
import JobDetails from "./pages/JobSeeker/JobDetails";

import JobSeekerDashboard from "./pages/JobSeeker/JobSeekerDashboard";
import SavedJobs from "./pages/JobSeeker/SavedJobs";
import UserProfile from "./pages/JobSeeker/UserProfile";
import MyApplications from "./pages/JobSeeker/MyApplications";

import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import EmployerProfilePage from "./pages/Employer/EmployerProfilePage";
import ManageJobs from "./pages/Employer/ManageJobs";
import JobPosting from "./pages/Employer/JobPosting";
import ApplicationViewer from "./pages/Employer/ApplicationViewer";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminJobs from "./pages/Admin/AdminJobs";
import AdminEmployers from "./pages/Admin/AdminEmployers";
import AdminCandidates from "./pages/Admin/AdminCandidates";

function RoleProfileRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <Navigate
      to={
        user.role === "employer"
          ? "/employer/company-profile"
          : user.role === "admin"
            ? "/admin/dashboard"
            : "/candidate/profile"
      }
      replace
    />
  );
}

function RoleAwareFallback() {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
}

function LegacyJobRedirect() {
  const { jobId } = useParams();
  return <Navigate to={`/jobs/${jobId}`} replace />;
}

function App() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div>
      <BrowserRouter>
        <Header openAuth={() => setAuthOpen(true)} />
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/jobs" element={<AllJobs />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />

          <Route path="/all-jobs" element={<Navigate to="/jobs" replace />} />
          <Route path="/find-jobs" element={<Navigate to="/candidate/dashboard" replace />} />
          <Route path="/saved-jobs" element={<Navigate to="/candidate/saved-jobs" replace />} />
          <Route path="/employer-dashboard" element={<Navigate to="/employer/dashboard" replace />} />
          <Route path="/post-job" element={<Navigate to="/employer/jobs/new" replace />} />
          <Route path="/manage-job" element={<Navigate to="/employer/jobs" replace />} />
          <Route path="/manage-jobs" element={<Navigate to="/employer/jobs" replace />} />
          <Route path="/applicants" element={<Navigate to="/employer/jobs" replace />} />
          <Route path="/compant-profile" element={<Navigate to="/employer/company-profile" replace />} />
          <Route path="/profile" element={<RoleProfileRedirect />} />
          <Route path="/job/:jobId" element={<LegacyJobRedirect />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="candidate" />}>
            <Route path="/candidate/dashboard" element={<JobSeekerDashboard />} />
            <Route path="/candidate/profile" element={<UserProfile />} />
            <Route path="/candidate/saved-jobs" element={<SavedJobs />} />
            <Route path="/candidate/applications" element={<MyApplications />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="employer" />}>
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            <Route path="/employer/jobs/new" element={<JobPosting />} />
            <Route path="/employer/jobs/:jobId/edit" element={<JobPosting />} />
            <Route path="/employer/jobs" element={<ManageJobs />} />
            <Route path="/employer/jobs/:jobId/applications" element={<ApplicationViewer />} />
            <Route path="/employer/company-profile" element={<EmployerProfilePage />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/jobs" element={<AdminJobs />} />
            <Route path="/admin/employers" element={<AdminEmployers />} />
            <Route path="/admin/candidates" element={<AdminCandidates />} />
          </Route>

          <Route path="*" element={<RoleAwareFallback />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-center"
        toastOptions={{
          className: "",
          style: { fontSize: "13px" },
        }}
      />
    </div>
  );
}

export default App;

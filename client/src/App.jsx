import {BrowserRouter, Routes,Route,Navigate,} from "react-router-dom"
import {Toaster } from "react-hot-toast"

import ProtectedRoute from './routes/ProtectedRoute'
import LandingPage from "./pages/LandingPage/LandingPage"
import Signup from './pages/Auth/Signup'
import Login from './pages/Auth/Login'
import JobSeekerDashboard from "./pages/JobSeeker/JobSeekerDashboard"
import JobDetails from './pages/JobSeeker/JobDetails'
import SavedJobs from './pages/JobSeeker/SavedJobs'
import UserProfile from './pages/JobSeeker/UserProfile'
import EmployerDashboard from './pages/Employer/EmployerDashboard'
import EmployerProfilePage from "./pages/Employer/EmployerProfilePage"
import ManageJobs from "./pages/Employer/ManageJobs"
import JobPosting from "./pages/Employer/JobPosting"
import ApplicationViewer from './pages/Employer/ApplicationViewer'
import JobListPage from './pages/Public/AllJobs'


import { useState } from "react";
import AuthModal from "../src/pages/Auth/AuthModal";
import Header from "../src/pages/LandingPage/components/Header";


function App() {
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <div>

    <BrowserRouter>
    <Header openAuth={() => setAuthOpen(true)} />
    <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup /> } />
        <Route path="/Login" element={<Login /> } />
        <Route path="/all-jobs" element={<JobListPage />} />

        <Route path="/find-jobs" element={<JobSeekerDashboard />} />
        <Route path="/job:/jobId" element={<JobDetails />} />
        <Route path="/saved-jobs" element={<SavedJobs/>} />
        <Route path="/profile" element={<UserProfile />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute requiredRole="employer"/>} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/post-job" element={<JobPosting/>} />
          <Route path="/manage-job" element={<ManageJobs />} />
          <Route path="/applicants" element={<ApplicationViewer />} />
          <Route path="/compant-profile" element={<EmployerProfilePage />} />




      </Routes>
    </BrowserRouter>





      <Toaster 
        toastOptions={{
          className:"", style:{fontSize:"13px"},
        }}
        />
    </div>
  )
}

export default App
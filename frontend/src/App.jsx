import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/CandidateDashboard";
import Messages from "./pages/Messages";

import RecruiterDashboard from "./features/recruiter/RecruiterDashboard";
import CreateJob from "./features/recruiter/CreateJob";
import RecruiterJobs from "./features/recruiter/RecruiterJobs";
import JobMatches from "./features/recruiter/JobMatches";
import JobApplications from "./features/recruiter/JobApplications";
import AllApplications from "./features/recruiter/AllApplications";
import RankedCandidates from "./features/recruiter/RankedCandidates";

import AdminDashboard from "./pages/AdminDashboard";

import RecruiterLayout from "./components/RecruiterLayout";

import Jobs from "./pages/Jobs";
import Companies from "./pages/Companies";
import CompanyJobs from "./pages/CompanyJobs";
import SavedJobs from "./pages/SavedJobs";
import AppliedJobs from "./pages/AppliedJobs";

function ProtectedRoute({ children, allowedRole }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  const role = localStorage.getItem("role");

  if (allowedRole && role !== allowedRole) {
    if (role === "candidate") {
      return <Navigate to="/dashboard" replace />;
    }

    if (role === "recruiter") {
      return <Navigate to="/recruiter/dashboard" replace />;
    }

    if (role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

function HomeRedirect() {
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Login />;
  }

  if (role === "candidate") {
    return <Navigate to="/dashboard" replace />;
  }

  if (role === "recruiter") {
    return <Navigate to="/recruiter/dashboard" replace />;
  }

  if (role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return <Login />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home Route */}
        <Route path="/" element={<HomeRedirect />} />

        {/* Auth */}
        <Route path="/register" element={<Register />} />

        {/* Public Routes */}
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:company" element={<CompanyJobs />} />

        {/* Candidate Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute allowedRole="candidate">
              <Messages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute allowedRole="candidate">
              <SavedJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applied-jobs"
          element={
            <ProtectedRoute allowedRole="candidate">
              <AppliedJobs />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Routes */}
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterLayout>
                <RecruiterDashboard />
              </RecruiterLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/create-job"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterLayout>
                <CreateJob />
              </RecruiterLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/jobs"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterLayout>
                <RecruiterJobs />
              </RecruiterLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/jobs/:jobId/matches"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterLayout>
                <JobMatches />
              </RecruiterLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/jobs/:jobId/applications"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterLayout>
                <JobApplications />
              </RecruiterLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/applications"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterLayout>
                <AllApplications />
              </RecruiterLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/ranked-candidates"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterLayout>
                <RankedCandidates />
              </RecruiterLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={
            localStorage.getItem("access") ? (
              localStorage.getItem("role") === "candidate" ? (
                <Navigate to="/dashboard" replace />
              ) : localStorage.getItem("role") === "recruiter" ? (
                <Navigate to="/recruiter/dashboard" replace />
              ) : (
                <Navigate to="/admin-dashboard" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
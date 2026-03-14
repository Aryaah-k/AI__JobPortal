import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/CandidateDashboard";
import Messages from "./pages/Messages";
import RecruiterNavbar from "./components/RecruiterNavbar";
import RecruiterDashboard from "./features/recruiter/RecruiterDashboard";
import CreateJob from "./features/recruiter/CreateJob";
import RecruiterJobs from "./features/recruiter/RecruiterJobs";
import JobMatches from "./features/recruiter/JobMatches";
import JobApplications from "./features/recruiter/JobApplications";
import AllApplications from "./features/recruiter/AllApplications";
import AdminDashboard from "./pages/AdminDashboard";
import RecruiterLayout from "./components/RecruiterLayout";
import Jobs from "./pages/Jobs";
import Companies from "./pages/Companies";
import CompanyJobs from "./pages/CompanyJobs";
import SavedJobs from "./pages/SavedJobs";
import AppliedJobs from "./pages/AppliedJobs";


function ProtectedRoute({ children , allowedRole}) {
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role");
 
    if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // Redirect user to their correct dashboard
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/register" element={<Register />} />
        
        {/* Public Routes */}
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:company" element={<CompanyJobs />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/applied-jobs" element={<AppliedJobs />} />
        <Route
          path="/messages"
          element={
            <ProtectedRoute allowedRole="candidate">
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterLayout>
                <RecruiterJobs />
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
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


{/* Fallback */}
        <Route path="*" element={<Navigate to="/"  replace />} />

      </Routes>
       <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;

// src/pages/recruiter/RecruiterJobs.jsx

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import { toast } from "react-toastify";

import {
  Briefcase,
  Users,
  Pencil,
  Trash2,
  Search,
  Plus,
  CalendarDays,
  MapPin,
} from "lucide-react";

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ================= FETCH JOBS =================
  const fetchJobs = async () => {
    try {
      const res = await api.get("jobs/jobs/");
      const data = res.data;
      setJobs(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ================= DELETE JOB =================
  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await api.delete(`jobs/jobs/${jobId}/`);
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      toast.success("Job deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete job.");
    }
  };

  // ================= TOGGLE STATUS =================
  const toggleJobStatus = async (jobId, currentStatus) => {
    try {
      await api.patch(`jobs/jobs/${jobId}/`, {
        is_active: !currentStatus,
      });

      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? { ...job, is_active: !currentStatus }
            : job
        )
      );

      toast.success(
        currentStatus
          ? "Job closed successfully!"
          : "Job reopened successfully!"
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update job status.");
    }
  };

  // ================= FILTER JOBS =================
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.required_skills?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? job.is_active
          : !job.is_active;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);

  // ================= STATS =================
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((job) => job.is_active).length;
  const totalApplicants = jobs.reduce(
    (acc, job) => acc + (job.total_matches || 0),
    0
  );

  if (loading) {
    return <div className="p-6 text-gray-500">Loading jobs...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Recruiter Dashboard
          </h2>
          <p className="text-gray-500 mt-1">
            Manage your created jobs and applicants
          </p>
        </div>

        <Link
          to="/recruiter/create-job"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition shadow-md"
        >
          <Plus size={18} />
          Create Job
        </Link>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

        <div className="bg-white rounded-2xl shadow-md p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Jobs</p>
              <h3 className="text-3xl font-bold">{totalJobs}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Briefcase className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Jobs</p>
              <h3 className="text-3xl font-bold">{activeJobs}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <Users className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Applicants</p>
              <h3 className="text-3xl font-bold">{totalApplicants}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Users className="text-purple-600" />
            </div>
          </div>
        </div>

      </div>

      {/* ================= SEARCH + FILTER ================= */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2.5"
        >
          <option value="all">All Jobs</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* ================= JOB LIST ================= */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center">
          <h3 className="text-2xl font-bold mb-2">No Jobs Found</h3>
          <p className="text-gray-500 mb-6">
            Create your first job posting
          </p>

          <Link
            to="/recruiter/create-job"
            className="bg-blue-600 text-white px-5 py-3 rounded-xl"
          >
            Create Job
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border"
            >

              {/* TOP */}
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                    <MapPin size={15} />
                    {job.location || "Remote"}
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    job.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {job.is_active ? "Open" : "Closed"}
                </span>
              </div>

              {/* DESCRIPTION */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {job.description}
              </p>

              {/* SKILLS */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.required_skills?.split(",").map((skill, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>

              {/* META */}
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>{job.total_matches || 0} Applicants</span>

                <span className="flex items-center gap-1">
                  <CalendarDays size={14} />
                  {job.created_at
                    ? new Date(job.created_at).toLocaleDateString()
                    : "Recently"}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 flex-wrap">

                <Link
                  to={`/recruiter/jobs/${job.id}/applications`}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded-xl text-sm text-center"
                >
                  Applications
                </Link>

                <Link
                  to={`/recruiter/jobs/${job.id}/matches`}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-xl text-sm text-center"
                >
                  Matches
                </Link>

                <button
                  onClick={() =>
                    toggleJobStatus(job.id, job.is_active)
                  }
                  className="px-3 py-2 bg-gray-700 text-white rounded-xl"
                >
                  {job.is_active ? "Close" : "Open"}
                </button>

                <button
                  onClick={() => deleteJob(job.id)}
                  className="p-2 bg-red-500 text-white rounded-xl"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
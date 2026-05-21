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
  Eye,
  ToggleLeft,
  ToggleRight,
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

  // ================= DELETE =================
  const deleteJob = async (jobId) => {
    if (!window.confirm("Delete this job permanently?")) return;

    try {
      await api.delete(`jobs/jobs/${jobId}/`);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      toast.success("Job deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= TOGGLE =================
  const toggleJobStatus = async (jobId, current) => {
    try {
      await api.patch(`jobs/jobs/${jobId}/`, {
        is_active: !current,
      });

      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, is_active: !current } : j
        )
      );

      toast.success(current ? "Job closed" : "Job opened");
    } catch {
      toast.error("Status update failed");
    }
  };

  // ================= FILTER =================
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  if (loading) {
    return (
      <div className="p-6 text-gray-500">Loading recruiter jobs...</div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Jobs
          </h1>
          <p className="text-gray-500">
            Edit, close, and track all your job postings
          </p>
        </div>

        <Link
          to="/recruiter/create-job"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow"
        >
          <Plus size={18} />
          Post New Job
        </Link>
      </div>

      {/* ================= SEARCH + FILTER ================= */}
      <div className="bg-white p-4 rounded-2xl shadow flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or location..."
            className="w-full border rounded-xl pl-10 pr-4 py-2"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-xl px-4 py-2"
        >
          <option value="all">All Jobs</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow text-center">
          <h2 className="text-xl font-semibold mb-2">No Jobs Found</h2>
          <p className="text-gray-500 mb-4">
            Start by creating your first job posting
          </p>
          <Link
            to="/recruiter/create-job"
            className="bg-blue-600 text-white px-5 py-2 rounded-xl"
          >
            Create Job
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-x-auto">

          <table className="w-full text-sm">

            {/* HEADER */}
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-left p-4">Job</th>
                <th className="text-left p-4">Location</th>
                <th className="text-left p-4">Applicants</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Posted</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {filteredJobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  {/* JOB TITLE */}
                  <td className="p-4 font-semibold text-gray-800">
                    {job.title}
                  </td>

                  {/* LOCATION */}
                  <td className="p-4 text-gray-600 flex items-center gap-1">
                    <MapPin size={14} />
                    {job.location || "Remote"}
                  </td>

                  {/* APPLICANTS */}
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-gray-700">
                      <Users size={14} />
                      {job.total_matches || 0}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        job.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {job.is_active ? "Active" : "Closed"}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="p-4 text-gray-600">
                    {job.created_at
                      ? new Date(job.created_at).toLocaleDateString()
                      : "—"}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4">
                    <div className="flex justify-end gap-2">

                      <Link
                        to={`/recruiter/jobs/${job.id}/applications`}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg"
                      >
                        View
                      </Link>

                      <Link
                        to={`/recruiter/jobs/${job.id}/matches`}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                      >
                        Matches
                      </Link>

                      <button
                        onClick={() =>
                          toggleJobStatus(job.id, job.is_active)
                        }
                        className="px-3 py-1 bg-gray-700 text-white rounded-lg"
                      >
                        {job.is_active ? "Close" : "Open"}
                      </button>

                      <button
                        onClick={() => deleteJob(job.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}
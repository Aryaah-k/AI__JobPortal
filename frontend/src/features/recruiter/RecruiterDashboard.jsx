import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import { toast } from "react-toastify";

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await api.get("recruiter/jobs/");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`recruiter/jobs/${jobId}/`);
      toast.success("Job deleted successfully!");
      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete job.");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Jobs</h2>

      {loading ? (
        <p className="text-gray-500">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500">You haven't created any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
              <p className="text-gray-500 mt-1 mb-2">{job.description}</p>
              <p className="text-gray-600 mb-4">
                <span className="font-medium">Skills:</span> {job.required_skills}
              </p>

              <div className="flex justify-between items-center space-x-2">
                <Link
                  to={`/recruiter/job-matches/${job.id}`}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  View Matches
                </Link>

                <Link
                  to={`/recruiter/edit-job/${job.id}`}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteJob(job.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api.js";
import { toast } from "react-toastify";
import MessageModal from "../../components/MessageModal.jsx";

import {
  MapPin,
  Users,
  CalendarDays,
  Briefcase,
} from "lucide-react";

export default function JobApplications() {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCandidate, setSelectedCandidate] =
    useState(null);

  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
  const fetchData = async () => {
      try {
        // FETCH JOB DETAILS
        const jobRes = await api.get(
          `jobs/jobs/${jobId}/`
        );

        setJob(jobRes.data);

        // FETCH APPLICATIONS
       const appRes = await api.get(
  `applications/job/${jobId}/`
);

        setApplications(appRes.data);

        setJobTitle(jobRes.data.title);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ================= JOB CARD ================= */}

      {job && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
          {/* TOP */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {job.title}
              </h2>

              <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                <MapPin size={15} />

                <span>
                  {job.location || "Remote"}
                </span>
              </div>
            </div>

            {/* STATUS */}
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
          <p className="text-gray-600 text-sm mb-5">
            {job.description}
          </p>

          {/* INFO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Applicants */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Users size={18} />

                <span className="font-medium">
                  Applicants
                </span>
              </div>

              <h3 className="text-2xl font-bold text-blue-800">
                {applications.length}
              </h3>
            </div>

            {/* Job Type */}
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-purple-700 mb-2">
                <Briefcase size={18} />

                <span className="font-medium">
                  Job Type
                </span>
              </div>

              <h3 className="text-lg font-bold text-purple-800 capitalize">
                {job.job_type || "Full Time"}
              </h3>
            </div>

            {/* Created Date */}
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <CalendarDays size={18} />

                <span className="font-medium">
                  Posted
                </span>
              </div>

              <h3 className="text-lg font-bold text-green-800">
                {job.created_at
                  ? new Date(
                      job.created_at
                    ).toLocaleDateString()
                  : "Recently"}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* ================= APPLICATIONS ================= */}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Applications
        </h2>

        <Link
          to={`/recruiter/jobs/${jobId}/matches`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
        >
          View Matches
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center">
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No Applications Yet
          </h3>

          <p className="text-gray-500">
            Candidates will appear here once they apply.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white shadow-md rounded-2xl p-5 border border-gray-100 hover:shadow-xl transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  {/* AVATAR */}
                  <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
                    {app.candidate_detail?.username
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  {/* INFO */}
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {app.candidate_detail?.username ||
                        "Candidate"}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      {app.candidate_detail?.email}
                    </p>

                    <p className="text-gray-400 text-xs mt-1">
                      Applied on{" "}
                      {new Date(
                        app.applied_at
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">
                  {/* STATUS */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      app.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : app.status ===
                          "accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {app.status}
                  </span>

                  {/* CONTACT */}
                  <button
                    onClick={() =>
                      setSelectedCandidate({
                        id: app.candidate_detail
                          ?.id,
                        username:
                          app.candidate_detail
                            ?.username,
                        email:
                          app.candidate_detail
                            ?.email,
                      })
                    }
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition text-sm"
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}

      <MessageModal
        isOpen={!!selectedCandidate}
        onClose={() =>
          setSelectedCandidate(null)
        }
        candidate={selectedCandidate}
        jobTitle={jobTitle}
      />
    </div>
  );
}
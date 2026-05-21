import { useEffect, useState } from "react";
import api from "../../api.js";
import { toast } from "react-toastify";
import MessageModal from "../../components/MessageModal.jsx";

export default function AllApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("applications/recruiter/");
        setApplications(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch applications.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <p className="text-gray-500">Loading applications...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Applications</h2>

      {applications.length === 0 ? (
        <p className="text-gray-500">No applications received yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white shadow-md rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">
                    {app.candidate_detail?.username || "Candidate"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {app.candidate_detail?.email || ""}
                  </p>
                  <p className="text-blue-600 text-sm font-medium mt-1">
                    {app.job_detail?.title || "Job"}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Applied: {new Date(app.applied_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {app.status}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCandidate({
                        id: app.candidate_detail?.id,
                        username: app.candidate_detail?.username,
                        email: app.candidate_detail?.email
                      });
                      setJobTitle(app.job_detail?.title || "the job");
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Modal */}
      <MessageModal
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        candidate={selectedCandidate}
        jobTitle={jobTitle}
      />
    </div>
  );
}

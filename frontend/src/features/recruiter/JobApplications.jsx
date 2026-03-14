import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api.js";
import { toast } from "react-toastify";
import MessageModal from "../../components/MessageModal.jsx";

export default function JobApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get(`job/${jobId}/`);
        setApplications(res.data);
        // Get job title from first application if available
        if (res.data.length > 0 && res.data[0].job_detail) {
          setJobTitle(res.data[0].job_detail.title);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch applications.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [jobId]);

  if (loading) return <p className="text-gray-500">Loading applications...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Job Applications</h2>

      {applications.length === 0 ? (
        <p className="text-gray-500">No applications received for this job yet.</p>
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
                  <p className="text-sm text-gray-400 mt-1">
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
                    onClick={() => setSelectedCandidate({
                      id: app.candidate_detail?.id,
                      username: app.candidate_detail?.username,
                      email: app.candidate_detail?.email
                    })}
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

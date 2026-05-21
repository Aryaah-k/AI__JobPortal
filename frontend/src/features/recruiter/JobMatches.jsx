import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api.js";
import { toast } from "react-toastify";

export default function JobMatches() {
  const { jobId } = useParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get(`matching/recruiter/jobs/${jobId}/matches/`)
        setMatches(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch matches.");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [jobId]);

  if (loading) return <p className="text-gray-500">Loading matches...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Ranked Candidates</h2>

      {matches.length === 0 ? (
        <p className="text-gray-500">No candidates matched this job yet.</p>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="bg-white shadow-md rounded-xl p-4">
              <p className="font-semibold text-gray-800">{match.candidate_name}</p>
              <p>Match Score: {match.score}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
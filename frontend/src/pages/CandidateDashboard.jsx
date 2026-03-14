import { useEffect, useState } from "react";
import api from "../api.js";
import Layout from "../components/Layout";
import ResumeUpload from "./ResumeUpload";
import JobCard from "../components/JobCard";

export default function CandidateDashboard() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = () => {
    setLoading(true);
    api.get("matching/candidate/")
      .then((res) => {
        setMatches(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <Layout variant="dashboard">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Resume & Get Matches</h2>

      {/* Resume Upload Component */}
      <ResumeUpload onJobsFetched={setMatches} />

      <h2 className="text-2xl font-bold mt-10 mb-6 text-gray-800">My Matched Jobs</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : matches.length === 0 ? (
        <p className="text-gray-500">No matched jobs found. Upload your resume to get matched with jobs.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <JobCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </Layout>
  );
}

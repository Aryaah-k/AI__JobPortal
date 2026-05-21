import { useEffect, useState, useMemo } from "react";
import api from "../../api.js";
import { toast } from "react-toastify";
import MessageModal from "../../components/MessageModal.jsx";
import { Award, Briefcase, Mail, MapPin, Search, Star, MessageSquare } from "lucide-react";

export default function RankedCandidates() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [minScore, setMinScore] = useState(0);

  // Message modal state
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    const fetchAllMatches = async () => {
      try {
        const res = await api.get("matching/recruiter/matches/");
        setMatches(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch ranked candidates.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllMatches();
  }, []);

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const candidateName = match.candidate_name || "";
      const jobTitleText = match.job_detail?.title || "";
      const matchesSearch =
        candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jobTitleText.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesScore = (match.score || 0) >= minScore;

      return matchesSearch && matchesScore;
    });
  }, [matches, searchTerm, minScore]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Ranking candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <Award className="text-blue-600" size={32} />
          Ranked Candidates
        </h1>
        <p className="text-gray-500 mt-2">
          Candidates who applied to your job posts, ranked by keyword relevance and skill compatibility scores.
        </p>
      </div>

      {/* ================= CONTROLS ================= */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by candidate or job title..."
            className="w-full border border-gray-250 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
          />
        </div>

        {/* Score Filter */}
        <div className="w-full md:w-auto flex items-center gap-4 flex-1 md:justify-end">
          <span className="text-sm font-medium text-gray-650 whitespace-nowrap">
            Min Match Score: <strong className="text-blue-600">{minScore}%</strong>
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full md:w-48 accent-blue-600 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* ================= LIST ================= */}
      {filteredMatches.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Star className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Matches Found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Try adjusting your search criteria or compatibility score threshold.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => {
            const score = match.score || 0;
            // Determine colors based on matching score
            const scoreColor =
              score >= 70
                ? "bg-green-50 text-green-700 border-green-200"
                : score >= 40
                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : "bg-red-50 text-red-700 border-red-200";

            const progressColor =
              score >= 70 ? "bg-green-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500";

            return (
              <div
                key={match.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-350 border border-gray-100 p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Top Header Card */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        {match.candidate_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-850 text-base leading-tight">
                          {match.candidate_name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Mail size={12} />
                          {match.candidate_email}
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${scoreColor}`}>
                      {score}% Match
                    </span>
                  </div>

                  {/* Match score bar */}
                  <div className="w-full bg-gray-100 h-2 rounded-full mb-5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>

                  {/* Job Information */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-455 mb-1.5 uppercase tracking-wider">
                      <Briefcase size={13} className="text-gray-400" />
                      Applied Job
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm leading-snug">
                      {match.job_detail?.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin size={12} className="text-gray-450" />
                      {match.job_detail?.location || "Remote"}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex gap-2.5">
                  <button
                    onClick={() => {
                      setSelectedCandidate({
                        id: match.candidate_id,
                        username: match.candidate_name,
                        email: match.candidate_email,
                      });
                      setJobTitle(match.job_detail?.title || "the job");
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 text-sm"
                  >
                    <MessageSquare size={15} />
                    Contact
                  </button>
                </div>
              </div>
            );
          })}
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

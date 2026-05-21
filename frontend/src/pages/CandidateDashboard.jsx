import { useEffect, useState } from "react";
import api from "../api.js";
import Layout from "../components/Layout";
import ResumeUpload from "./ResumeUpload";
import JobCard from "../components/JobCard";
import { Briefcase, Sparkles, TrendingUp, HelpCircle } from "lucide-react";

export default function CandidateDashboard() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const usernameRaw = localStorage.getItem("username");
  const username = (usernameRaw || "User").trim();

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

  // Card Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 animate-pulse">
      <div className="flex gap-2">
        <div className="h-5 w-24 bg-gray-200 rounded-lg"></div>
        <div className="h-5 w-20 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="h-6 w-3/4 bg-gray-200 rounded-lg"></div>
      <div className="flex gap-2">
        <div className="h-4 w-16 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-20 bg-gray-200 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="pt-4 border-t border-gray-50">
        <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
      </div>
    </div>
  );

  return (
    <Layout variant="dashboard">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-650 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <span className="bg-white/15 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
            Candidate Hub
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-2">
            Welcome back, {username}!
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl">
            Get personalized job matches based on your skills, experience, and uploaded resume. Apply with a single click.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <Sparkles className="w-full h-full text-white" />
        </div>
      </div>

      {/* Grid: Resume upload & Quick metrics */}
      <div className="mb-10">
        <ResumeUpload onRefreshMatches={fetchMatches} />
      </div>

      {/* Matches Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <Sparkles className="text-yellow-500 fill-yellow-500" size={22} />
              AI Recommended Jobs
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Personalized career matches ranked by your profile compatibility
            </p>
          </div>
          {matches.length > 0 && (
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
              {matches.length} Matches Found
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm max-w-xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-500">
              <Briefcase size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No matched jobs found yet</h3>
            <p className="text-gray-500 text-sm max-w-sm mb-6 leading-relaxed">
              Upload your latest resume in PDF format in the section above to let our AI parse your credentials and match you with active jobs!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <JobCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

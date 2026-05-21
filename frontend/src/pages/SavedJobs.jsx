import { useEffect, useState } from "react";
import api from "../api";
import JobCard from "../components/JobCard";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { Bookmark, Compass, BookmarkX } from "lucide-react";

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const savedIds = JSON.parse(localStorage.getItem("savedJobs")) || [];
    
    if (savedIds.length === 0) {
      setJobs([]);
      setLoading(false);
      return;
    }

    api.get("jobs/jobs/public/")
      .then((res) => {
        const filtered = res.data.filter((job) => savedIds.includes(job.id));
        setJobs(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 animate-pulse">
      <div className="flex gap-2">
        <div className="h-5 w-24 bg-gray-200 rounded-lg"></div>
        <div className="h-5 w-20 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="h-6 w-3/4 bg-gray-200 rounded-lg"></div>
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
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <Bookmark className="text-blue-600 fill-blue-600/10" size={30} />
          Saved Jobs
        </h1>
        <p className="text-gray-500 mt-1">
          Keep track of job openings you've bookmarked. Review and submit your applications here.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-500">
            <BookmarkX size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No saved jobs yet</h3>
          <p className="text-gray-500 text-sm max-w-xs mb-6 leading-relaxed">
            You haven't bookmarked any jobs yet. Start exploring active job posts to save them for later!
          </p>
          <Link
            to="/jobs"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition inline-flex items-center gap-1.5 shadow-sm shadow-blue-500/10 hover:shadow-md"
          >
            <Compass size={16} />
            Explore Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </Layout>
  );
}
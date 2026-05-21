import { useEffect, useState } from "react";
import api from "../api";
import JobCard from "../components/JobCard";
import Layout from "../components/Layout";
import { Search, Compass, AlertTriangle } from "lucide-react";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("jobs/jobs/public/")
      .then((res) => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = [
    "All",
    ...new Set(jobs.map((job) => job.category).filter(Boolean)),
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesCategory = category === "All" || job.category === category;
    
    const searchString = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      job.title?.toLowerCase().includes(searchString) ||
      job.company_name?.toLowerCase().includes(searchString) ||
      job.location?.toLowerCase().includes(searchString) ||
      job.description?.toLowerCase().includes(searchString);

    return matchesCategory && matchesSearch;
  });

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
          <Compass className="text-blue-600" size={32} />
          Find Your Dream Job
        </h1>
        <p className="text-gray-500 mt-1">
          Explore and apply for the top job postings curated dynamically for your career goals.
        </p>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        
        {/* Search Field */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title, company, or location..."
            className="w-full border border-gray-200 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition duration-200"
          />
        </div>

        {/* Category Dropdown */}
        <div className="w-full md:w-60">
          <select
            className="w-full border border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition duration-200 bg-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat === "All" ? "Filter by Category: All" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-500">
            <AlertTriangle size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No jobs matched search</h3>
          <p className="text-gray-500 text-sm max-w-sm mb-2 leading-relaxed">
            We couldn't find any job posts matching your criteria. Try adjusting your query or resetting filters!
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setCategory("All");
            }}
            className="text-blue-600 font-bold hover:underline text-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </Layout>
  );
}

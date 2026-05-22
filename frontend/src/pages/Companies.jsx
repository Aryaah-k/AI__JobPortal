import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Layout from "../components/Layout";
import { Building2, Search, ArrowRight, Briefcase } from "lucide-react";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api.get("jobs/jobs/public/")
      .then((res) => {
        // Extract unique companies from jobs
        const uniqueCompanies = [...new Set(res.data.map((job) => job.company_name).filter(Boolean))];
        
        // Get job count for each company
        const companyData = uniqueCompanies.map((company) => ({
          name: company,
          jobCount: res.data.filter((job) => job.company_name === company).length,
        }));
        
        setCompanies(companyData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div className="h-5 w-16 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  );

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <Building2 className="text-blue-600" size={32} />
          Explore Top Companies
        </h1>
        <p className="text-gray-500 mt-1">
          Browse and research companies posting active openings, and view their career opportunities.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies by name..."
            className="w-full border border-gray-205 focus:border-blue-500 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition duration-200"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-500">
            <Building2 size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No companies found</h3>
          <p className="text-gray-500 text-sm max-w-sm mb-2 leading-relaxed">
            No companies matching "{searchQuery}" could be found. Try typing a different search query!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Link
              key={company.name}
              to={`/companies/${encodeURIComponent(company.name)}`}
              className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-150 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform duration-200">
                    {company.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Briefcase size={12} />
                    {company.jobCount} {company.jobCount === 1 ? "Job" : "Jobs"}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                  {company.name}
                </h3>
                <p className="text-gray-400 text-xs mt-1.5 flex items-center gap-1.5">
                  Verified Employer Partner
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
                <span>View Open Positions</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}

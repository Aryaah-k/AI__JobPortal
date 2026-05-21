import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import JobCard from "../components/JobCard";
import Layout from "../components/Layout";
import { Building2, ArrowLeft, Briefcase, AlertCircle } from "lucide-react";

export default function CompanyJobs() {
  const { company } = useParams();
  const decodedCompany = decodeURIComponent(company || "");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("jobs/jobs/public/")
      .then((res) => {
        const filtered = res.data.filter((job) => job.company_name === decodedCompany);
        setJobs(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [decodedCompany]);

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
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/companies"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-blue-600 transition"
        >
          <ArrowLeft size={16} />
          Back to Companies
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <Building2 className="text-blue-600" size={30} />
          Jobs at {decodedCompany}
        </h1>
        <p className="text-gray-500 mt-1">
          Explore all active job listings posted by {decodedCompany} on our portal.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-500">
            <AlertCircle size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No active jobs</h3>
          <p className="text-gray-500 text-sm max-w-sm mb-4 leading-relaxed">
            There are currently no active job vacancies registered at {decodedCompany}. Check back again later!
          </p>
          <Link
            to="/companies"
            className="text-blue-600 font-bold hover:underline text-sm"
          >
            Explore Other Companies
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

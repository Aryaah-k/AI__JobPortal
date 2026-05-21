import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, MapPin, Building, Briefcase, IndianRupee, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import ApplicationModal from "./ApplicationModal";

export default function JobCard({ job, match }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [readMore, setReadMore] = useState(false);

  const jobData = job || (match && match.job_detail);

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];

    if (savedJobs.includes(jobData?.id)) setSaved(true);
    if (appliedJobs.includes(jobData?.id)) setApplied(true);
  }, [jobData]);

  if (!jobData) return null;

  const handleApply = () => {
    const token = localStorage.getItem("access");
    if (!token) {
      toast.info("Please login to apply for this job.");
      navigate("/");
      return;
    }
    setShowModal(true);
  };

  const handleSave = () => {
    let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];

    if (saved) {
      savedJobs = savedJobs.filter((id) => id !== jobData.id);
      setSaved(false);
      toast.success("Job removed from saved jobs!");
    } else {
      savedJobs.push(jobData.id);
      setSaved(true);
      toast.success("Job saved successfully!");
    }

    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
  };

  const handleSuccess = () => {
    let appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];
    appliedJobs.push(jobData.id);
    localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));

    setApplied(true);
    setShowModal(false);
    toast.success("Application submitted successfully!");
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative group">
        
        {/* Save Bookmark */}
        <button
          onClick={handleSave}
          className={`absolute top-5 right-5 p-2 rounded-full hover:bg-gray-50 text-gray-400 hover:text-blue-600 transition duration-200 ${
            saved ? "text-blue-600 bg-blue-50/50 hover:bg-blue-50" : ""
          }`}
          title={saved ? "Unsave Job" : "Save Job"}
        >
          <Bookmark fill={saved ? "currentColor" : "none"} size={19} />
        </button>

        <div>
          {/* Company, Location & Status Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="flex items-center gap-1 text-xs text-gray-500 font-medium bg-gray-50 px-2.5 py-1 rounded-lg">
              <Building size={13} className="text-gray-400" />
              {jobData.company_name}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500 font-medium bg-gray-50 px-2.5 py-1 rounded-lg">
              <MapPin size={13} className="text-gray-400" />
              {jobData.location || "Remote"}
            </span>
            {jobData.is_active ? (
              <span className="flex items-center gap-1 text-xs text-green-700 font-semibold bg-green-50 px-2 rounded-md border border-green-100">
                Active
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-red-600 font-semibold bg-red-50 px-2 rounded-md border border-red-100">
                Closed
              </span>
            )}
          </div>

          {/* Job Title */}
          <h3 className="text-lg font-bold text-gray-850 tracking-tight leading-snug group-hover:text-blue-600 transition-colors mb-2.5 pr-8">
            {jobData.title}
          </h3>

          {/* Inline Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Category */}
            {jobData.category && (
              <span className="bg-blue-50/80 text-blue-600 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Briefcase size={12} />
                {jobData.category}
              </span>
            )}

            {/* Salary */}
            {jobData.salary && (
              <span className="bg-green-50 text-green-750 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-0.5">
                <IndianRupee size={12} />
                {jobData.salary}
              </span>
            )}

            {/* Match Score */}
            {match && (
              <span className="bg-purple-50 text-purple-750 text-[11px] font-bold px-2.5 py-1 rounded-full border border-purple-100/50 flex items-center gap-1 animate-pulse">
                <Sparkles size={12} />
                {Math.round(match.score)}% Match
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-650 text-sm leading-relaxed mb-4">
            {readMore
              ? jobData.description
              : jobData.description?.slice(0, 110)}
            {jobData.description?.length > 110 && (
              <button
                onClick={() => setReadMore(!readMore)}
                className="text-blue-605 hover:underline font-semibold ml-1.5 focus:outline-none inline-block text-xs"
              >
                {readMore ? "Show Less" : "Read More..."}
              </button>
            )}
          </p>
        </div>

        {/* Footer Area */}
        <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-4 mt-auto">
          {applied ? (
            <span className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-semibold text-green-750 bg-green-50 border border-green-155">
              <CheckCircle2 size={16} />
              Applied ✓
            </span>
          ) : !jobData.is_active ? (
            <span className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-semibold text-gray-500 bg-gray-50 border border-gray-200">
              Applications Closed
            </span>
          ) : (
            <button
              onClick={handleApply}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm shadow-blue-500/10 hover:shadow-md hover:shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <ApplicationModal
          job={jobData}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
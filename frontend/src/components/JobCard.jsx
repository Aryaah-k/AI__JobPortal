import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";
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
      navigate("/");
      return;
    }

    setShowModal(true);
  };

  const handleSave = () => {

    let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];

    if (saved) {
      savedJobs = savedJobs.filter(id => id !== jobData.id);
      setSaved(false);
    } else {
      savedJobs.push(jobData.id);
      setSaved(true);
    }

    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
  };

  const handleSuccess = () => {

    let appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];

    appliedJobs.push(jobData.id);

    localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));

    setApplied(true);
    setShowModal(false);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition relative">

        {/* Bookmark */}
        <button
          onClick={handleSave}
          className={`absolute top-4 right-4 ${
            saved ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <Bookmark fill={saved ? "currentColor" : "none"} />
        </button>

        <h2 className="text-xl font-semibold">
          {jobData.title}
        </h2>

        <p className="text-gray-600">
          {jobData.company_name}
        </p>

        <p className="text-gray-500">
          📍 {jobData.location}
        </p>

        {/* Category */}
        {jobData.category && (
          <span className="bg-blue-100 text-blue-600 px-3 py-1 text-sm rounded inline-block mt-2">
            {jobData.category}
          </span>
        )}

        {/* Salary */}
        {jobData.salary && (
          <p className="text-green-600 font-medium mt-2">
            ₹{jobData.salary}
          </p>
        )}

        {/* Match Score */}
        {match && (
          <p className="text-purple-600 font-medium mt-2">
            Match Score: {Math.round(match.score)}%
          </p>
        )}

        {/* Job Description */}
        <p className="text-gray-600 mt-3">

          {readMore
            ? jobData.description
            : jobData.description?.slice(0, 120)}

          {jobData.description?.length > 120 && (
            <span
              onClick={() => setReadMore(!readMore)}
              className="text-blue-600 cursor-pointer ml-1"
            >
              {readMore ? "Show Less" : "...Read More"}
            </span>
          )}

        </p>

        {/* Apply Button */}
        <button
          onClick={handleApply}
          disabled={applied}
          className={`mt-4 px-4 py-2 rounded ${
            applied
              ? "bg-green-500 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {applied ? "Applied ✓" : "Apply"}
        </button>

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
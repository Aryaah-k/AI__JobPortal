import { useState } from "react";
import api from "../api"; // Axios instance
import JobCard from "../components/JobCard";

export default function ResumeUpload(props) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [matchedJobs, setMatchedJobs] = useState([]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setMessage("");
    } else {
      setMessage("Please select a PDF file.");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setMessage("Uploading...");

      const res = await api.post("/resumes/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Get resume_id and extracted_text from response
      const resumeId = res.data.resume_id;
      const text = res.data.extracted_text || "No text extracted.";
      setExtractedText(text);

      // Call matching endpoint with resume_id to save matches to database
      const jobsRes = await api.post("/matching/jobs/match/", {
        resume_text: text,
        resume_id: resumeId,
      });

      setMatchedJobs(jobsRes.data);

      setMessage("Upload & job match successful!");
      
      // Notify parent component to refresh matches
      if (props && props.onJobsFetched) {
        props.onJobsFetched(jobsRes.data);
      }
    } catch (err) {
      console.error(err);
      setMessage("Upload failed. Try again.");
      setMatchedJobs([]);
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Resume</h1>
      
      <div className="mb-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        {uploading ? "Uploading..." : "Upload & Match Jobs"}
      </button>

      {message && (
        <p className="mt-4 text-sm">{message}</p>
      )}

      {extractedText && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Extracted Text</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-48">
            {extractedText}
          </pre>
        </div>
      )}

      {matchedJobs.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Matched Jobs</h2>
          {matchedJobs.map((job) => (
            <JobCard key={job.id} match={job} />
          ))}
        </div>
      )}
    </div>
  );
}

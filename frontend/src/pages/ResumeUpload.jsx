import { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api"; // Axios instance

export default function ResumeUpload({ onRefreshMatches }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      setFile(null);
      toast.error("Please upload a PDF file only.");
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning("No file selected. Please choose a PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      toast.info("Uploading and processing resume...");

      // 1. Upload resume
      const res = await api.post("/resumes/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const resumeId = res.data.resume_id;
      const text = res.data.extracted_text || "";
      setExtractedText(text);

      // 2. Trigger matching
      await api.post("/matching/jobs/match/", {
        resume_text: text,
        resume_id: resumeId,
      });

      toast.success("Resume processed! Your job matches are now updated.");

      // 3. Refresh dashboard
      if (onRefreshMatches) {
        onRefreshMatches();
      }

      setFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to process resume. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        <UploadCloud className="text-blue-600" size={24} />
        Upload Resume & Get Matched
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Upload your resume in PDF format. Our AI matches your skills with the most relevant active jobs instantly.
      </p>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? "border-blue-500 bg-blue-50/20 scale-[0.99]"
            : file
            ? "border-green-400 bg-green-50/5 hover:bg-green-50/10"
            : "border-gray-250 bg-gray-50/30 hover:bg-blue-50/5 hover:border-blue-400"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {file ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <FileText className="text-green-600 animate-bounce" size={26} />
            </div>
            <p className="text-gray-800 font-semibold text-sm max-w-md truncate mb-1">
              {file.name}
            </p>
            <p className="text-gray-400 text-xs mb-3">
              {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to match
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="text-red-500 hover:text-red-700 text-xs font-semibold hover:underline"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-3 group-hover:scale-110 transition duration-200">
              <UploadCloud className="text-blue-500" size={26} />
            </div>
            <p className="text-gray-700 font-medium text-sm mb-1">
              Drag and drop your resume here, or <span className="text-blue-600 font-bold hover:underline">browse</span>
            </p>
            <p className="text-gray-400 text-xs">
              Supports PDF files only (Max 5MB)
            </p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-5 flex items-center justify-end">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-200 disabled:text-gray-400 shadow-sm shadow-blue-500/10 hover:shadow-md hover:shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Analyzing & Matching...
            </>
          ) : (
            "Scan & Find Job Matches"
          )}
        </button>
      </div>

      {/* Extracted Text Accordion */}
      {extractedText && (
        <div className="mt-6 border border-gray-150 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 hover:bg-gray-100/80 transition font-semibold text-sm border-b border-gray-150"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="text-green-600" size={16} />
              AI Extracted Profile Keywords
            </span>
            <span className="text-gray-400 flex items-center gap-1 text-xs">
              {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
              {showPreview ? "Hide preview" : "View text preview"}
            </span>
          </button>
          
          {showPreview && (
            <div className="bg-gray-50/50 p-4 max-h-48 overflow-y-auto text-xs text-gray-650 leading-relaxed font-mono whitespace-pre-wrap">
              {extractedText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
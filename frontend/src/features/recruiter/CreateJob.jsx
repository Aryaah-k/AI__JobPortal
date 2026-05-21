import { useState } from "react";
import api from "../../api.js";
import { toast } from "react-toastify";

export default function CreateJob() {
  const [form, setForm] = useState({
    title: "",
    company_name: "",
    location: "",
    description: "",
    job_type: "",
    salary: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.company_name ||
      !form.location ||
      !form.description ||
      !form.job_type
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      await api.post("jobs/jobs/", {
        ...form,
        salary: form.salary || null, // send null if empty
      });

      toast.success("Job created successfully!");

      setForm({
        title: "",
        company_name: "",
        location: "",
        description: "",
        job_type: "",
        salary: "",
      });
    } catch (err) {
  console.log("Status:", err.response?.status);
  console.log("Data:", JSON.stringify(err.response?.data, null, 2));
  toast.error("Failed to create job.");
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <h2 className="text-2xl font-bold mb-6">Create New Job</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block mb-1 font-medium">Job Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Company Name</label>
          <input
            type="text"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Job Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Job Type</label>
          <select
            name="job_type"
            value={form.job_type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select Job Type</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Salary (Optional)</label>
          <input
            type="number"
            name="salary"
            value={form.salary}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-xl text-white font-semibold transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Job"}
        </button>
      </form>
    </div>
  );
}
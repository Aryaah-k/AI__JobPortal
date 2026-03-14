import { useEffect, useState } from "react";
import api from "../api";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";

export default function Jobs() {

  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    api.get("jobs/all/")
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
  }, []);

  const categories = [
    "All",
    ...new Set(jobs.map(job => job.category))
  ];

  const filteredJobs =
    category === "All"
      ? jobs
      : jobs.filter(job => job.category === category);

  return (
    <div>
      <Navbar />
      <div className="p-10 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold mb-6">
          Find Your Dream Job
        </h1>

        {/* Category Filter */}
        <select
          className="border p-2 mb-6 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat, index) => (
            <option key={index}>{cat}</option>
          ))}
        </select>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job}/>
          ))}
        </div>

      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../api";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";

export default function SavedJobs() {

  const [jobs, setJobs] = useState([]);

  useEffect(() => {

    const savedIds = JSON.parse(localStorage.getItem("savedJobs")) || [];

    api.get("jobs/all/").then(res => {

      const filtered = res.data.filter(job =>
        savedIds.includes(job.id)
      );

      setJobs(filtered);

    });

  }, []);

  return (
    <div>

      <Navbar />

      <div className="p-10 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold mb-6">
          Saved Jobs
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}

        </div>

      </div>
    </div>
  );
}
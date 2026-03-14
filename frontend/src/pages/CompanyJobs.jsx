import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";

export default function CompanyJobs() {

  const { company } = useParams();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("jobs/all/")
      .then(res => {

        const filtered =
          res.data.filter(job => job.company_name === company);

        setJobs(filtered);

      })
      .catch(err => console.log(err));
  }, [company]);

  return (
    <div>
      <Navbar />
      <div className="p-10 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold mb-6">
          Jobs at {company}
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          {jobs.map(job => (
            <JobCard key={job.id} job={job}/>
          ))}

        </div>

      </div>
    </div>
  );
}

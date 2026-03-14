import { useEffect, useState } from "react";
import api from "../api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("admin/stats/")
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!stats) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  const chartData = {
    labels: ["Users", "Jobs", "Applications"],
    datasets: [
      {
        label: "Platform Statistics",
        data: [
          stats.total_users,
          stats.total_jobs,
          stats.total_applications,
        ],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-8">
        Admin Analytics Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-gray-500">Total Users</h3>
          <p className="text-3xl font-bold text-blue-500">
            {stats.total_users}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-gray-500">Total Jobs</h3>
          <p className="text-3xl font-bold text-green-500">
            {stats.total_jobs}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-gray-500">Total Applications</h3>
          <p className="text-3xl font-bold text-yellow-500">
            {stats.total_applications}
          </p>
        </div>

      </div>

      {/* Chart Section */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <Bar data={chartData} />
      </div>

    </div>
  );
}
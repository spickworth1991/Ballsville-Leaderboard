import { useEffect, useState } from "react";
import Link from "next/link";
import Leaderboard from "../components/Leaderboard";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/leaderboard.json")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center text-white mt-10">Loading leaderboard...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-8">
          <img
            src="/logo.png" // ✅ Your logo file in /public/
            alt="League Banner"
            className="w-full max-w-5xl h-auto rounded-lg shadow-lg"
          />
        </div>


      </div>

      <h1 className="text-4xl font-bold text-center mb-4">Combined Leaderboard</h1>

      {/* ✅ Use shared Leaderboard with pagination */}
      <Leaderboard data={data} />

      <div className="text-center mt-8 flex justify-center gap-4">
        <Link href="/divisions">
          <button className="bg-blue-600 hover:bg-blue-800 px-6 py-3 rounded-lg transition">View Divisions</button>
        </Link>
        <Link href="/league">
          <button className="bg-green-600 hover:bg-green-800 px-6 py-3 rounded-lg transition">View Leagues</button>
        </Link>
      </div>
    </div>
  );
}

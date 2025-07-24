"use client";
import { useEffect, useState } from "react";
import LeaderboardTable from "../components/LeaderboardTable";
import OwnerModal from "../components/OwnerModal";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { fetchLeaderboardData } from "../lib/fetchSleeperData";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState(null);

  useEffect(() => {
    fetchLeaderboardData()
      .then(setData)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4">Mixed Leaderboard</h1>
      <p className="text-red-500 mb-4">
        *Warning: Weekly points do not account for stat corrections, however totals do.
      </p>
      <LeaderboardTable data={data} onOwnerClick={setSelectedOwner} />
      {selectedOwner && (
        <OwnerModal owner={selectedOwner} onClose={() => setSelectedOwner(null)} />
      )}
    </div>
  );
}
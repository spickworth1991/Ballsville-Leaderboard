"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LeaderboardTable from "../../components/LeaderboardTable";
import Loader from "../../components/Loader";
import Navbar from "../../components/Navbar";

export default function DivisionPage() {
  const router = useRouter();
  const { name } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) return;
    fetch(`/api/leaderboard?division=${encodeURIComponent(name)}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [name]);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">{name} Leaderboard</h1>
      <LeaderboardTable data={data} onOwnerClick={() => {}} />
    </div>
  );
}
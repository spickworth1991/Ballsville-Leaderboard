export async function fetchLeaderboardData() {
  const res = await fetch("/api/leaderboard");
  if (!res.ok) throw new Error("Failed to load leaderboard data");
  return await res.json();
}
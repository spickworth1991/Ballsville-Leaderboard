"use client";
import { createContext, useState } from "react";

export const LeaderboardContext = createContext();

export function LeaderboardProvider({ children }) {
  const [data, setData] = useState({ owners: [], weeks: [], divisions: [], leaguesByDivision: {} });

  const loadData = async () => {
    const res = await fetch("/data/leaderboard.json");
    const json = await res.json();
    setData(json);
  };

  return (
    <LeaderboardContext.Provider value={{ data, loadData }}>
      {children}
    </LeaderboardContext.Provider>
  );
}
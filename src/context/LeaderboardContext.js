// /context/LeaderboardContext.jsx
'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { computeYearStats } from '../utils/computeYearStats'; // adjust path if needed

export const LeaderboardContext = createContext();

export const LeaderboardProvider = ({ children, perModeMinSizes }) => {
  const [leaderboards, setLeaderboards] = useState(null);
  const [current, setCurrent] = useState({
    year: '2025',
    mode: 'big_game',
    filterType: 'all',
    filterValue: null,
  });

  useEffect(() => {
    (async () => {
      const res = await fetch('/data/leaderboards.json');
      const json = await res.json();
      setLeaderboards(json);
    })();
  }, []);

  // Compute stats per YEAR (independent of mode), honoring “full league” thresholds per mode
  const statsByYear = useMemo(() => {
    if (!leaderboards) return {};
    return computeYearStats(leaderboards, perModeMinSizes);
  }, [leaderboards, perModeMinSizes]);

  const value = useMemo(
    () => ({ leaderboards, current, setCurrent, statsByYear }),
    [leaderboards, current, statsByYear]
  );

  return <LeaderboardContext.Provider value={value}>{children}</LeaderboardContext.Provider>;
};

// 🔹 This is the hook you import and call in components:
export const useLeaderboard = () => useContext(LeaderboardContext);

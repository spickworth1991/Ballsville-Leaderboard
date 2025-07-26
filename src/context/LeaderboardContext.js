'use client';
import { createContext, useState, useEffect } from 'react';

export const LeaderboardContext = createContext();

export const LeaderboardProvider = ({ children }) => {
  const [leaderboards, setLeaderboards] = useState({});
  const [current, setCurrent] = useState({ year: null, type: null });

  useEffect(() => {
    fetch('/data/leaderboards.json')
      .then(res => res.json())
      .then(json => setLeaderboards(json));
  }, []);

  return (
    <LeaderboardContext.Provider value={{ leaderboards, current, setCurrent }}>
      {children}
    </LeaderboardContext.Provider>
  );
};

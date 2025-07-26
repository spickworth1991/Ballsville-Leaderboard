'use client';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Leaderboard from '../components/Leaderboard';

export default function Home() {
  const [leaderboards, setLeaderboards] = useState(null);
  const [current, setCurrent] = useState({ year: '2025', mode: 'big_game', filterType: 'all', filterValue: null });
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    fetch('/data/leaderboards.json')
      .then(res => res.json())
      .then(json => {
        setLeaderboards(json);
        // Initialize default view
        setFilteredData(json['2025']['big_game']);
      });
  }, []);

  useEffect(() => {
    if (!leaderboards) return;

    const fullData = leaderboards[current.year][current.mode];
    let filteredOwners = [...fullData.owners];

    if (current.filterType === 'division') {
      filteredOwners = filteredOwners.filter(o => o.division === current.filterValue);
    } else if (current.filterType === 'league') {
      filteredOwners = filteredOwners.filter(o => o.leagueName === current.filterValue);
    }

    setFilteredData({ ...fullData, owners: filteredOwners });
  }, [current, leaderboards]);

  if (!leaderboards) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div>
      <Navbar data={leaderboards} current={current} setCurrent={setCurrent} />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-6 text-indigo-500">
          {filteredData?.name} {current.filterType !== 'all' ? ` - ${current.filterValue}` : ''}
        </h1>
        {filteredData && <Leaderboard data={filteredData} />}
      </div>
    </div>
  );
}

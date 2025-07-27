import { useRef, useState, useEffect } from "react";
import OwnerModal from "./OwnerModal";

export default function Leaderboard({ data, year, category }) {
  const sortedOwners = [...data.owners].sort((a, b) => b.total - a.total);
  const [showWeeks, setShowWeeks] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(sortedOwners.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentOwners = sortedOwners.slice(startIndex, startIndex + itemsPerPage);

  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedRoster, setSelectedRoster] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [visibleWeeksStart, setVisibleWeeksStart] = useState(0);

  const weeksToShow = 3;
  const maxWeeks = data.weeks.length;

  // ✅ Cache for weekly data
  const weeklyCache = useRef(null);

  useEffect(() => {
    const loadWeeklyData = async () => {
      if (weeklyCache.current) {
        console.log("✅ Using cached weekly data");
        setWeeklyData(weeklyCache.current);
        return;
      }

      console.log("📥 Fetching weekly data...");
      let combinedData = {};
      let partCount = 0;

      for (let i = 1; i <= 20; i++) {
        const partUrl = `/data/weekly_rosters_part${i}.json`;
        console.log(`Fetching ${partUrl}...`);

        try {
          const res = await fetch(partUrl);

          if (res.status === 404) {
            console.log(`✅ No more files after part ${i - 1}`);
            break;
          }

          if (!res.ok) {
            console.error(`❌ Failed to fetch ${partUrl}: ${res.status}`);
            break;
          }

          const partData = await res.json();
          partCount++;

          for (const y in partData) {
            if (!combinedData[y]) combinedData[y] = {};
            for (const c in partData[y]) {
              if (!combinedData[y][c]) combinedData[y][c] = {};
              Object.assign(combinedData[y][c], partData[y][c]);
            }
          }
        } catch (err) {
          console.error(`❌ Error fetching ${partUrl}:`, err);
          break;
        }
      }

      console.log(`✅ Loaded ${partCount} parts, years: ${Object.keys(combinedData).join(", ")}`);
      weeklyCache.current = combinedData; // ✅ Save to cache
      setWeeklyData(combinedData);
    };

    loadWeeklyData();
  }, []); // ✅ Only runs once (on mount)

  const handleWeeklyClick = (owner, week) => {
    if (!showWeeks || !weeklyData) return;

    const leagueData = weeklyData[year]?.[category]?.[owner.leagueName]?.[week];
    if (!leagueData) {
      console.warn(`No data for Year: ${year}, Category: ${category}, League: ${owner.leagueName}, Week: ${week}`);
      return;
    }

    const match = leagueData.find(r => r.ownerName === owner.ownerName);
    if (match) {
      setSelectedOwner(owner);
      setSelectedRoster({
        week,
        starters: match.starters,
        bench: match.bench
      });
    }
  };

  const currentWeeks = showWeeks ? data.weeks.slice(visibleWeeksStart, visibleWeeksStart + weeksToShow) : [];
  const uniqueLeagues = new Set(sortedOwners.map(o => o.leagueName));
  const showLeagueColumn = uniqueLeagues.size > 1;

  const nextWeeks = () => {
    if (visibleWeeksStart + weeksToShow < maxWeeks) {
      setVisibleWeeksStart(visibleWeeksStart + weeksToShow);
    }
  };

  const prevWeeks = () => {
    if (visibleWeeksStart - weeksToShow >= 0) {
      setVisibleWeeksStart(visibleWeeksStart - weeksToShow);
    }
  };

  return (
    <div className="overflow-x-auto animate-fadeIn">
      {/* Toggle Weekly Scores */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-3">
          <span className="text-lg font-medium">Weekly Scores</span>
          <button
            onClick={() => setShowWeeks(!showWeeks)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition ${
              showWeeks ? "bg-blue-600" : "bg-gray-400"
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition ${
                showWeeks ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </button>
        </div>
      </div>

      {showWeeks && (
        <div className="flex justify-center items-center gap-3 mb-4">
          <button
            onClick={prevWeeks}
            disabled={visibleWeeksStart === 0}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            ◀ Prev
          </button>
          <span className="text-white">
            Showing weeks {visibleWeeksStart + 1}-{Math.min(visibleWeeksStart + weeksToShow, maxWeeks)}
          </span>
          <button
            onClick={nextWeeks}
            disabled={visibleWeeksStart + weeksToShow >= maxWeeks}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Next ▶
          </button>
        </div>
      )}

      {/* Table */}
      <table className="w-full text-left border border-gray-700 rounded-lg text-xs sm:text-sm md:text-base">
        <thead>
          <tr className="bg-gray-800 sticky top-0">
            <th className="p-2">Rank</th>
            <th className="p-2">Owner</th>
            <th>Draft Slot</th>
            {showLeagueColumn && <th className="p-2">League</th>}
            {showWeeks &&
              currentWeeks.map((w) => (
                <th key={w} className="p-2 text-center whitespace-nowrap">W{w}</th>
              ))}
            <th className="p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {currentOwners.map((o, idx) => (
            <tr
              key={`${o.ownerName}-${idx}`}
              className="border-b border-gray-700 hover:bg-gray-900"
              onClick={() => !showWeeks && setSelectedOwner(o)}
            >
              <td className="p-2">{startIndex + idx + 1}</td>
              <td className="p-2">{o.ownerName}</td>
              <td>{o.draftSlot ? `(${o.draftSlot})` : "-"}</td>
              {showLeagueColumn && <td className="p-2">{o.leagueName}</td>}
              {showWeeks &&
                currentWeeks.map((w) => (
                  <td
                    key={w}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWeeklyClick(o, w);
                    }}
                    className="p-2 text-center text-blue-400 cursor-pointer hover:bg-blue-700 hover:text-white rounded transition"
                  >
                    {o.weekly[w]?.toFixed(2) || "-"}
                  </td>
                ))}
              <td className="p-2 font-bold">{o.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedOwner && (
        <OwnerModal
          owner={selectedOwner}
          selectedRoster={selectedRoster}
          onClose={() => {
            setSelectedOwner(null);
            setSelectedRoster(null);
          }}
          allOwners={data.owners}
        />
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import OwnerModal from "./OwnerModal";

export default function Leaderboard({ data }) {
  const sortedOwners = [...data.owners].sort((a, b) => b.total - a.total);

  // ✅ Pagination
  const itemsPerPage = 25;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(sortedOwners.length / itemsPerPage);

  const startIndex = (page - 1) * itemsPerPage;
  const currentOwners = sortedOwners.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setPage(1); // Reset pagination on data change
  }, [data]);

  // ✅ Weekly Toggle
  const [showWeeks, setShowWeeks] = useState(false);

  // ✅ Modal
  const [selectedOwner, setSelectedOwner] = useState(null);

  // ✅ Hide League column if only 1 league
  const uniqueLeagues = new Set(sortedOwners.map(o => o.leagueName));
  const showLeagueColumn = uniqueLeagues.size > 1;

  return (
    <div className="overflow-x-auto animate-fadeIn">
      {/* ✅ Toggle Weekly Scores */}
      <div className="text-center mb-4 transition">
        <label className="flex items-center justify-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5"
            checked={showWeeks}
            onChange={() => setShowWeeks(!showWeeks)}
          />
          <span className="text-lg">Show Weekly Scores</span>
        </label>
      </div>

      {/* ✅ Warning when weekly columns are visible */}
      {showWeeks && (
        <p className="text-center text-yellow-400 mb-4 animate-fadeIn">
          *Weekly points do not account for stat corrections; totals do.
        </p>
      )}

      {sortedOwners.length === 0 ? (
        <p className="text-center text-gray-400">No owners available.</p>
      ) : (
        <>
          <table className="w-full text-left border border-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3">Rank</th>
                <th className="p-3">Owner</th>
                {showLeagueColumn && <th className="p-3">League</th>}
                {showWeeks &&
                  data.weeks.map(w => (
                    <th key={w} className="p-3">W{w}</th>
                  ))}
                <th className="p-3">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {currentOwners.map((o, idx) => (
                <tr
                  key={`${o.ownerName}-${idx}`}
                  className="border-b border-gray-700 hover:bg-gray-900 transition cursor-pointer"
                  onClick={() => setSelectedOwner(o)}
                >
                  <td className="p-3">{startIndex + idx + 1}</td>
                  <td className="p-3">{o.ownerName}</td>
                  {showLeagueColumn && <td className="p-3">{o.leagueName}</td>}
                  {showWeeks &&
                    data.weeks.map(w => (
                      <td key={w} className="p-3">{o.weekly[w]?.toFixed(2) || "-"}</td>
                    ))}
                  <td className="p-3 font-bold">{o.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-white">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* ✅ Owner Modal */}
      {selectedOwner && (
        <OwnerModal
          owner={selectedOwner}
          onClose={() => setSelectedOwner(null)}
          allOwners={data.owners}
        />
      )}
    </div>
  );
}

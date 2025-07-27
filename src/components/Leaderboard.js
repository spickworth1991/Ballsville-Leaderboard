import { useState, useEffect } from "react";
import OwnerModal from "./OwnerModal";

export default function Leaderboard({ data }) {
  const sortedOwners = [...data.owners].sort((a, b) => b.total - a.total);

  const itemsPerPage = 25;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(sortedOwners.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentOwners = sortedOwners.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => setPage(1), [data]);

  const [showWeeks, setShowWeeks] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);

  const uniqueLeagues = new Set(sortedOwners.map(o => o.leagueName));
  const showLeagueColumn = uniqueLeagues.size > 1;

  return (
    <div className="overflow-x-auto animate-fadeIn">
      {/* Toggle Weekly Scores */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-3">
          <span className="text-lg font-medium">Weekly Scores</span>
          <button
            onClick={() => setShowWeeks(!showWeeks)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition ${
              showWeeks ? 'bg-blue-600' : 'bg-gray-400'
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition ${
                showWeeks ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>

      </div>

      {showWeeks && (
        <p className="text-center text-yellow-400 mb-4 text-sm">
          *Weekly points do not account for stat corrections; totals do.
        </p>
      )}

      {sortedOwners.length === 0 ? (
        <p className="text-center text-gray-400">No owners available.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-700 rounded-lg text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-2 sm:p-3">Rank</th>
                  <th className="p-2 sm:p-3">Owner</th>
                  {showLeagueColumn && <th className="p-2 sm:p-3">League</th>}
                  {showWeeks && data.weeks.map(w => <th key={w} className="p-2">W{w}</th>)}
                  <th className="p-2 sm:p-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {currentOwners.map((o, idx) => (
                  <tr
                    key={`${o.ownerName}-${idx}`}
                    className="border-b border-gray-700 hover:bg-gray-900 cursor-pointer"
                    onClick={() => setSelectedOwner(o)}
                  >
                    <td className="p-2">{startIndex + idx + 1}</td>
                    <td className="p-2">{o.ownerName}</td>
                    {showLeagueColumn && <td className="p-2">{o.leagueName}</td>}
                    {showWeeks && data.weeks.map(w => (
                      <td key={w} className="p-2">{o.weekly[w]?.toFixed(2) || "-"}</td>
                    ))}
                    <td className="p-2 font-bold">{o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 w-full sm:w-auto"
              >
                Prev
              </button>
              <span className="text-white">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 w-full sm:w-auto"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      
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

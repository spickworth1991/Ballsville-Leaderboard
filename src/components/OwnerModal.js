"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function OwnerModal({ owner, onClose, allOwners }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => setVisible(true), []);
  if (!owner) return null;

  // ✅ Get other leagues for same owner
  const otherLeagues = allOwners
    .filter(o => o.ownerName === owner.ownerName && o.leagueName !== owner.leagueName)
    .map(o => ({ name: o.leagueName, total: o.total }))
    .sort((a, b) => b.total - a.total);

  

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg w-11/12 sm:max-w-2xl max-h-[90vh] overflow-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl hover:text-red-500"
        >
          ✖
        </button>

        {/* Header */}
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">{owner.ownerName}</h2>
        <p className="text-gray-400 mb-2 text-center text-sm sm:text-base">
          League: <span className="text-indigo-400">{owner.leagueName}</span>
        </p>
        <p className="text-center mb-4">
          Draft Slot: <span className="text-yellow-400 font-bold">#{owner.draftSlot || "-"} </span> - | -
          Total Points: <span className="text-blue-400 font-semibold">{owner.total}</span>
        </p>

        {/* ✅ Latest Roster Section */}
        {owner.latestRoster && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-center text-green-400">
              Latest Roster (Week {owner.latestRoster.week})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Starters */}
              <div>
                <h4 className="font-semibold text-blue-400 mb-1">Starters</h4>
                <ul className="border border-gray-700 rounded p-2 space-y-1 text-sm">
                  {owner.latestRoster.starters.map((p, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{p.name}</span>
                      <span className="text-gray-400">{p.points} pts</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bench */}
              <div>
                <h4 className="font-semibold text-gray-300 mb-1">Bench</h4>
                <ul className="border border-gray-700 rounded p-2 space-y-1 text-sm">
                  {owner.latestRoster.bench.map((p, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{p.name}</span>
                      <span className="text-gray-400">{p.points} pts</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}


        {/* Other Leagues */}
        {otherLeagues.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-center">Other Leagues</h3>
            <div className="max-h-32 overflow-y-auto border border-gray-700 rounded p-2">
              <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm sm:text-base">
                {otherLeagues.map((lg, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{lg.name}</span>
                    <span className="text-blue-400">{lg.total.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

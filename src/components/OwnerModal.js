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
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function OwnerModal({ owner, onClose, allOwners }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  if (!owner) return null;

  // ✅ Build list of other leagues dynamically
  const otherLeagues = allOwners
    .filter(o => o.ownerName === owner.ownerName && o.leagueName !== owner.leagueName)
    .map(o => ({
      name: o.leagueName,
      total: o.total
    }))
    .sort((a, b) => b.total - a.total);

  const weeks = Object.keys(owner.weekly).sort((a, b) => a - b);
  const points = weeks.map(week => Number(owner.weekly[week].toFixed(2)));

  const data = {
    labels: weeks.map(w => `Week ${w}`),
    datasets: [
      {
        label: "Weekly Points",
        data: points,
        borderColor: "#3b82f6",
        backgroundColor: "#1d4ed8",
        tension: 0.4,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-xl w-full relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl hover:text-red-500"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-4">{owner.ownerName}</h2>
        <p className="text-gray-400 mb-2">Current League: {owner.leagueName}</p>
        <p className="mb-4">Total Points: <span className="text-blue-400">{owner.total}</span></p>

        
        <div className="h-64">
          <Line data={data} options={options} />
        </div>

        {/* ✅ Show other leagues dynamically */}
        {otherLeagues.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Other Leagues:</h3>
            <div className="max-h-32 overflow-y-auto border border-gray-700 rounded p-2">
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {otherLeagues.map((lg, i) => (
                  <li key={i}>
                    {lg.name} — <span className="text-blue-400">{lg.total.toFixed(2)}</span>
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

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

export default function OwnerModal({ owner, onClose }) {
  const weeks = Object.keys(owner.weekly).map(Number).sort((a, b) => a - b);
  const data = {
    labels: weeks.map(w => `W${w}`),
    datasets: [
      {
        label: "Weekly Points",
        data: weeks.map(w => owner.weekly[w]),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1
      }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">{owner.name}</h2>
        <div className="mb-4">
          <Line data={data} />
        </div>
        <h3 className="font-semibold mb-2">Leagues:</h3>
        <ul className="mb-4">
          {owner.leagues.map((l, i) => (
            <li key={i} className="border-b py-1">
              {l.league_name}: <span className="font-bold">{l.points.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
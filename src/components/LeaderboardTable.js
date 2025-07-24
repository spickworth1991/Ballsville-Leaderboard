import { useState } from "react";

export default function LeaderboardTable({ data, onOwnerClick }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("total");
  const [asc, setAsc] = useState(false);

  const owners = Object.entries(data.owners)
    .filter(([owner]) => owner.toLowerCase().includes(search.toLowerCase()))
    .sort(([aName, aInfo], [bName, bInfo]) => {
      let valA = sortKey === "total" ? aInfo.total : aInfo.weekly[sortKey] || 0;
      let valB = sortKey === "total" ? bInfo.total : bInfo.weekly[sortKey] || 0;
      return asc ? valA - valB : valB - valA;
    });

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search owner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Owner</th>
              {data.weeks.map(week => (
                <th
                  key={week}
                  className="border px-4 py-2 cursor-pointer"
                  onClick={() => { setSortKey(week); setAsc(!asc); }}
                >
                  W{week}
                </th>
              ))}
              <th
                className="border px-4 py-2 cursor-pointer"
                onClick={() => { setSortKey("total"); setAsc(!asc); }}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {owners.map(([owner, info]) => (
              <tr
                key={owner}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => onOwnerClick({ name: owner, ...info })}
              >
                <td className="border px-4 py-2 font-bold">{owner}</td>
                {data.weeks.map(week => (
                  <td key={week} className="border px-4 py-2">
                    {info.weekly[week]?.toFixed(2) || "-"}
                  </td>
                ))}
                <td className="border px-4 py-2 font-bold">{info.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
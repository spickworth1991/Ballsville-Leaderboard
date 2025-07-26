'use client';
import { useState } from 'react';

export default function Navbar({ data, current, setCurrent }) {
  const [openMenu, setOpenMenu] = useState(null); // 'divisions' or 'leagues'

  if (!data) return null;

  const years = Object.keys(data);
  const modes = ['big_game', 'mini_game', 'redraft'];

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const closeMenu = () => setOpenMenu(null);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex flex-wrap gap-6 justify-center shadow-lg relative">
      {/* Year Selector */}
      <div className="flex gap-4">
        {years.map(year => (
          <button
            key={year}
            className={`px-4 py-2 rounded ${current.year === year ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => {
              setCurrent({ ...current, year, mode: 'big_game', filterType: 'all', filterValue: null });
              closeMenu();
            }}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Mode Selector */}
      <div className="flex gap-4">
        {modes.map(mode => (
          <button
            key={mode}
            className={`px-4 py-2 rounded ${current.mode === mode ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => {
              setCurrent({ ...current, mode, filterType: 'all', filterValue: null });
              closeMenu();
            }}
          >
            {data[current.year][mode].name.split(' ')[1]} {/* Big / Mini / Redraft */}
          </button>
        ))}
      </div>

      {/* Divisions Dropdown */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('divisions')}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          Divisions ▾
        </button>
        {openMenu === 'divisions' && (
          <ul className="absolute left-0 mt-2 bg-gray-800 rounded shadow-lg z-50 max-h-64 overflow-auto">
            {data[current.year][current.mode].divisions.map(div => (
              <li key={div}>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  onClick={() => {
                    setCurrent({ ...current, filterType: 'division', filterValue: div });
                    closeMenu();
                  }}
                >
                  {div}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Leagues Dropdown */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('leagues')}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          Leagues ▾
        </button>
        {openMenu === 'leagues' && (
          <ul className="absolute left-0 mt-2 bg-gray-800 rounded shadow-lg z-50 max-h-72 overflow-auto">
            {Object.entries(data[current.year][current.mode].leaguesByDivision).map(([division, leagues]) => (
              <li key={division} className="border-b border-gray-700">
                <span className="block px-4 py-2 font-semibold text-indigo-400">{division}</span>
                {leagues.map(league => (
                  <button
                    key={league}
                    className="block w-full text-left px-6 py-1 hover:bg-gray-700"
                    onClick={() => {
                      setCurrent({ ...current, filterType: 'league', filterValue: league });
                      closeMenu();
                    }}
                  >
                    {league}
                  </button>
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Click outside to close menu */}
      {openMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeMenu}
        ></div>
      )}
    </nav>
  );
}

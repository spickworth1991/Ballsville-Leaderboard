'use client';
import { useState } from 'react';

export default function Navbar({ data, current, setCurrent }) {
  const [openMenu, setOpenMenu] = useState(null); // 'divisions' or 'leagues'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!data) return null;

  const years = Object.keys(data);
  const modes = ['big_game', 'mini_game', 'redraft'];

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const closeMenu = () => setOpenMenu(null);

  const handleSelect = (updates) => {
    setCurrent({ ...current, ...updates });
    setOpenMenu(null);
    setMobileMenuOpen(false); // ✅ Closes mobile menu as well
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-lg relative">
      {/* Mobile Header */}
      <div className="flex justify-between items-center md:hidden">
        <h1 className="text-lg font-bold">Leaderboard</h1>
        <button
          className="text-white text-2xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile + Desktop Menu */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden md:overflow-visible md:flex md:items-center md:justify-center md:gap-6 ${
          mobileMenuOpen ? 'max-h-screen mt-3' : 'max-h-0 md:max-h-full'
        }`}
      >
        {/* Year Selector */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-3 md:mb-0">
          {years.map((year) => (
            <button
              key={year}
              className={`px-3 py-2 rounded text-sm md:text-base ${
                current.year === year
                  ? 'bg-indigo-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() =>
                handleSelect({
                  year,
                  mode: 'big_game',
                  filterType: 'all',
                  filterValue: null,
                })
              }
            >
              {year}
            </button>
          ))}
        </div>

        {/* Mode Selector */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-3 md:mb-0">
          {modes.map((mode) => (
            <button
              key={mode}
              className={`px-3 py-2 rounded text-sm md:text-base ${
                current.mode === mode
                  ? 'bg-indigo-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() =>
                handleSelect({
                  mode,
                  filterType: 'all',
                  filterValue: null,
                })
              }
            >
              {data[current.year][mode].name.split(' ')[1]}
            </button>
          ))}
        </div>

        {/* Dropdown Buttons */}
        <div className="flex flex-wrap gap-2 md:gap-4">
          {/* Divisions */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('divisions')}
              className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 text-sm md:text-base"
            >
              Divisions ▾
            </button>
            {openMenu === 'divisions' && (
              <ul className="absolute left-0 mt-2 bg-gray-800 rounded shadow-lg z-50 max-h-64 overflow-auto w-48">
                {data[current.year][current.mode].divisions.map((div) => (
                  <li key={div}>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                      onClick={() =>
                        handleSelect({
                          filterType: 'division',
                          filterValue: div,
                        })
                      }
                    >
                      {div}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Leagues */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('leagues')}
              className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 text-sm md:text-base"
            >
              Leagues ▾
            </button>
            {openMenu === 'leagues' && (
              <ul className="absolute left-0 mt-2 bg-gray-800 rounded shadow-lg z-50 max-h-72 overflow-auto w-64">
                {Object.entries(
                  data[current.year][current.mode].leaguesByDivision
                ).map(([division, leagues]) => (
                  <li
                    key={division}
                    className="border-b border-gray-700 last:border-none"
                  >
                    <span className="block px-4 py-2 font-semibold text-indigo-400">
                      {division}
                    </span>
                    {leagues.map((league) => (
                      <button
                        key={league}
                        className="block w-full text-left px-6 py-1 hover:bg-gray-700"
                        onClick={() =>
                          handleSelect({
                            filterType: 'league',
                            filterValue: league,
                          })
                        }
                      >
                        {league}
                      </button>
                    ))}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {openMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeMenu}
        ></div>
      )}
    </nav>
  );
}

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between mb-6 p-4 bg-gray-900 rounded-lg shadow-lg">
      <img src="/logo.png" alt="Logo" className="h-10" />
      <h1 className="text-xl font-bold text-white">Points Leaderboard</h1>
    </nav>
  );
}

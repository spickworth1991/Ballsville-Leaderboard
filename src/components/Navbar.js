import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex gap-4 mb-6">
      <Link href="/" className="text-blue-600 hover:underline">Home</Link>
      <Link href="/divisions" className="text-blue-600 hover:underline">Divisions</Link>
    </nav>
  );
}
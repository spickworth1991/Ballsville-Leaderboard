import Link from "next/link";

export default function DivisionSelector({ divisions }) {
  return (
    <div className="grid gap-4">
      {divisions.map((div) => (
        <Link
          key={div}
          href={`/division/${encodeURIComponent(div)}`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
        >
          {div}
        </Link>
      ))}
    </div>
  );
}
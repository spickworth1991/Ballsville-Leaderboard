import DivisionSelector from "../components/DivisionSelector";

export default function Divisions() {
  const divisions = ["Division 1", "Division 2"];
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Select a Division</h1>
      <DivisionSelector divisions={divisions} />
    </div>
  );
}
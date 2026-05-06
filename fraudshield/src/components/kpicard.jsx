export default function KpiCard({ title, value, color }) {
  return (
    <div className="bg-[#131720] border border-[#1e2535] rounded-xl p-5">
      <p className="text-sm text-gray-400">{title}</p>
      <h2 className={`text-2xl font-semibold mt-1 ${color || ""}`}>
        {value}
      </h2>
    </div>
  );
}
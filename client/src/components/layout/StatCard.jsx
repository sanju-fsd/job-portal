export default function StatCard({ title, value, color }) {
  return (
    <div className={`p-5 rounded-xl text-white ${color}`}>
      <p className="text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
      <p className="text-xs opacity-80">100%</p>
    </div>
  );
}
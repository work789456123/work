type Props = {
  title: string;
  value: number | string;
  trend?: string;
  color?: string;
};

export default function StatCard({ title, value, trend }: Props) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
         <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{trend}</span>
      </div>
      <h2 className="text-3xl font-bold text-gray-800">{value}</h2>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
    </div>
  );
}
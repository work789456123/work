import React from 'react';

export interface TableProps<T> {
  columns: { key: keyof T; label: string }[];
  data: T[];
}

export default function Table<T extends Record<string, any>>({ columns, data }: TableProps<T>) {
  return (
    <div className="overflow-x-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((col) => (
              <th key={String(col.key)} className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider bg-gray-50/50 first:rounded-tl-2xl last:rounded-tr-2xl">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
              {columns.map((col) => (
                <td key={String(col.key)} className="px-6 py-4 text-sm text-gray-700">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

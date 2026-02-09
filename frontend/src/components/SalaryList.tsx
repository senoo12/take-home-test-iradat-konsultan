import React from "react";

interface SalaryListProps {
  consolers: any[];
  onDetail: (id: string) => void;
}

const SalaryList: React.FC<SalaryListProps> = ({ consolers, onDetail }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-gray-900">Name</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-900">Email</th>
            <th className="px-6 py-4 text-center font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {consolers.map((con: any) => (
            <tr key={con.id_consoler} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-gray-800 font-medium">{con.name}</td>
              <td className="px-6 py-4 text-gray-600">{con.email}</td>
              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => onDetail(con.id_consoler)}
                  className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-all"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryList;
import React from "react";
import { Consoler } from "../types";
import { formatRupiah } from "../helpers/currency";
import { Link } from "react-router-dom";

interface ConsolerListProps {
  consolers: Consoler[];
  onDelete: (id: string) => void; 
}

const ConsolerList: React.FC<ConsolerListProps> = ({ consolers, onDelete }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-gray-900">Name</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-900">Email</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-900">Rate</th>
            <th className="px-6 py-3 text-center font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {consolers.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-gray-700 font-medium">{c.name}</td>
              <td className="px-6 py-4 text-gray-600">{c.email}</td>
              <td className="px-6 py-4 text-gray-600 font-mono">{formatRupiah(c.rate)}</td>
              <td className="px-6 py-4 text-center space-x-2">
                {/* tombol edit */}
                <Link
                  to={`/consoler/edit/${c.id}`}
                  className="inline-block px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  Edit
                </Link>
                {/* tombol delete */}
                <button
                  onClick={() => {
                    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
                      onDelete(c.id);
                    }
                  }}
                  className="px-3 py-1 text-xs font-medium text-red-600 border border-red-600 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConsolerList;
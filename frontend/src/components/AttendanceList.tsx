import React from "react";
import { Attendance } from "../types";
import { Link } from "react-router-dom";

interface AttendanceListProps {
  attendances: Attendance[];
  onDelete: (id: string) => void;
  onDetail: (attendance: Attendance) => void; 
}

const AttendanceList: React.FC<AttendanceListProps> = ({ attendances, onDelete, onDetail }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-gray-900">Event Name</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-900">Consoler Name</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-900">Date Attendance</th>
            <th className="px-6 py-3 text-center font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {attendances.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{item.event.name_event}</td>
              <td className="px-6 py-4">{item.consoler.name}</td>
              <td className="px-6 py-4">{item.status_attendance}</td>
              <td className="px-6 py-4">{item.date_attendance}</td>
              <td className="px-6 py-4 text-center space-x-2">
                <button
                  onClick={() => onDetail(item)}
                  className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-600 rounded hover:bg-gray-50"
                >
                  Detail
                </button>
                <Link
                  to={`/attendance/edit/${item.id}`}
                  className="inline-block px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  Edit
                </Link>
                <button
                  onClick={() => {
                    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
                      onDelete(item.id);
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

export default AttendanceList;
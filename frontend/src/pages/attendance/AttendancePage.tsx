import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAttendance, deleteAttendance } from "../../api/attendance";
import AttendanceList from "../../components/AttendanceList";
import { Attendance } from "../../types";
import { Link } from "react-router-dom";

const AttendancePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedData, setSelectedData] = useState<Attendance | null>(null);

  const { data: attendances = [], isLoading } = useQuery<Attendance[]>({
    queryKey: ["attendance"],
    queryFn: getAttendance,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      alert("Data berhasil dihapus");
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Data Attendances</h1>
        <Link
          to="/attendance/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
        >
          + Add Data Attendance
        </Link>
      </div>
      
      <AttendanceList 
        attendances={attendances} 
        onDelete={(id) => deleteMutation.mutate(id)}
        onDetail={(data) => setSelectedData(data)}
      />

      {selectedData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-800">Attendance Detail</h3>
              <button 
                onClick={() => setSelectedData(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">Event</label>
                <p className="text-gray-800">{selectedData.event.name_event}</p>
                <p className="text-xs text-gray-400">{selectedData.event.description}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">Consoler</label>
                <p className="text-gray-800">{selectedData.consoler.name}</p>
                <p className="text-xs text-gray-400">{selectedData.consoler.email}</p>
              </div>
              <div className="flex justify-between border-t pt-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold">Status</label>
                  <p className="font-semibold text-blue-600">{selectedData.status_attendance}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold">Hours</label>
                  <p className="font-semibold">{selectedData.hours}h</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedData(null)}
              className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
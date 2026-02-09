import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAttendance } from "../../api/attendance";
import { getEvent } from "../../api/event";
import { getConsoler } from "../../api/consoler";

const AddAttendance: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    id_event: "",
    id_consoler: "",
    status_attendance: "PRESENT",
    hours: 0,
    date_attendance: "" 
  });

  const { data: events = [], isLoading: loadingEvents } = useQuery({
    queryKey: ["event"],
    queryFn: getEvent,
  });

  const { data: consolers = [], isLoading: loadingConsolers } = useQuery({
    queryKey: ["consoler"],
    queryFn: getConsoler,
  });

  const mutation = useMutation({
    mutationFn: createAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      alert("Attendance berhasil ditambahkan!");
      navigate("/attendance");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Gagal menambah data");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      date_attendance: formData.date_attendance === "" ? null : formData.date_attendance
    };
    
    mutation.mutate(payload as any);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Add New Attendance</h2>
      <form onSubmit={handleSubmit} className="space-y-4">        
        <div>
          <label className="block text-sm font-medium text-gray-700">Event</label>
          <select
            required
            className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500 bg-white"
            value={formData.id_event}
            onChange={(e) => setFormData({ ...formData, id_event: e.target.value })}
          >
            <option value="">-- Select Event --</option>
            {events.map((ev: any) => (
              <option key={ev.id} value={ev.id}>{ev.name_event}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Consoler</label>
          <select
            required
            className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500 bg-white"
            value={formData.id_consoler}
            onChange={(e) => setFormData({ ...formData, id_consoler: e.target.value })}
          >
            <option value="">-- Select Consoler --</option>
            {consolers.map((con: any) => (
              <option key={con.id} value={con.id}>{con.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date Attendance <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="date"
            className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500 bg-white"
            value={formData.date_attendance}
            onChange={(e) => setFormData({ ...formData, date_attendance: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500 bg-white"
            value={formData.status_attendance}
            onChange={(e) => setFormData({ ...formData, status_attendance: e.target.value })}
          >
            <option value="PRESENT">PRESENT</option>
            <option value="ABSENT">ABSENT</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Hours</label>
          <input
            type="number"
            min="0"
            className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500"
            placeholder="Example: 2"
            value={formData.hours || ""}
            onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/attendance")}
            className="flex-1 px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending || loadingEvents || loadingConsolers}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {mutation.isPending ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAttendance;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAttendanceById, updateAttendance } from "../../api/attendance";
import { getEvent } from "../../api/event";
import { getConsoler } from "../../api/consoler";

const EditAttendance: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    id_event: "",
    id_consoler: "",
    status_attendance: "PRESENT",
    hours: "" as string | number, 
    date_attendance: "",
  });

  const { data: events = [] } = useQuery({ queryKey: ["event"], queryFn: getEvent });
  const { data: consolers = [] } = useQuery({ queryKey: ["consoler"], queryFn: getConsoler });

  const { data: attendance, isLoading } = useQuery({
    queryKey: ["attendance", id],
    queryFn: () => getAttendanceById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (attendance) {
      setFormData({
        id_event: attendance.event.id_event || attendance.id,
        id_consoler: attendance.consoler.id_consoler || attendance.id,
        status_attendance: attendance.status_attendance,
        hours: attendance.hours ?? "", 
        date_attendance: attendance.date_attendance ?? "",
      });
    }
  }, [attendance]);

  const mutation = useMutation({
    mutationFn: (payload: any) => updateAttendance({ id: id!, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      alert("Attendance berhasil diperbarui!");
      navigate("/attendance");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Gagal update data");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      // Konversi ke null jika kosong untuk field non-required
      hours: formData.hours === "" ? null : Number(formData.hours),
      date_attendance: formData.date_attendance === "" ? null : formData.date_attendance,
    };

    mutation.mutate(payload);
  };

  if (isLoading) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Edit Attendance</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Event</label>
          <select
            className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500 bg-white"
            value={formData.id_event}
            onChange={(e) => setFormData({ ...formData, id_event: e.target.value })}
            required
          >
            <option value="">-- Choose Event --</option>
            {events.map((ev: any) => (
              <option key={ev.id} value={ev.id}>{ev.name_event}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Select Consoler</label>
          <select
            className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500 bg-white"
            value={formData.id_consoler}
            onChange={(e) => setFormData({ ...formData, id_consoler: e.target.value })}
            required
          >
            <option value="">-- Choose Consoler --</option>
            {consolers.map((con: any) => (
              <option key={con.id} value={con.id}>{con.name}</option>
            ))}
          </select>
        </div>

        {/* Date Attendance (Optional) */}
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

        {/* Hours (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hours <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="number"
            min="0"
            className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500"
            placeholder="Example: 2"
            value={formData.hours}
            onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={() => navigate("/attendance")}
            className="flex-1 px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {mutation.isPending ? "Updating..." : "Update Attendance"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAttendance;
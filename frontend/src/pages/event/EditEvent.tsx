import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEventById, updateEvent } from "../../api/event";

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name_event: "",
    description: "",
    start_time: "",
    end_time: "",
    date: ""
  });

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (event) {
      const extractTime = (isoString: string) => isoString.split('T')[1]?.substring(0, 5) || "";
      const extractDate = (isoString: string) => isoString.split('T')[0] || "";

      setFormData({
        name_event: event.name_event,
        description: event.description,
        start_time: extractTime(event.start_time),
        end_time: extractTime(event.end_time),
        date: extractDate(event.date)
      });
    }
  }, [event]);

  const mutation = useMutation({
    mutationFn: (payload: any) => updateEvent({ id: id!, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event"] });
      alert("Event berhasil diperbarui!");
      navigate("/event");
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;
      alert(serverMessage || "Gagal memperbarui event");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      start_time: new Date(`${formData.date}T${formData.start_time}`).toISOString(),
      end_time: new Date(`${formData.date}T${formData.end_time}`).toISOString(),
      date: new Date(formData.date).toISOString(),
    };

    mutation.mutate(payload);
  };

  if (isLoading) return <p className="p-4 text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Edit Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Name</label>
          <input
            type="text"
            className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500"
            value={formData.name_event}
            onChange={(e) => setFormData({ ...formData, name_event: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500 min-h-[100px]"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Event Date</label>
          <input
            type="date"
            className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={() => navigate("/event")}
            className="flex-1 px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {mutation.isPending ? "Updating..." : "Update Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
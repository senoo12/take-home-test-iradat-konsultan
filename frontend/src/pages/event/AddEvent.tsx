import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../api/event";

const AddEventPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name_event: "",
    description: "",
    start_time: "",
    end_time: "",
    date: ""
  });

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event"] });
      navigate("/event");
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;
      alert("Gagal menambah data: " + (serverMessage || error.message));
    }
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

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-4">Add New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Name</label>
          <input
            type="text"
            required
            className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500"
            onChange={(e) => setFormData({ ...formData, name_event: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            required
            className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500"
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              required
              className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500"
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              required
              className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500"
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            required
            className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500"
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/event")}
            className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {mutation.isPending ? "Saving..." : "Save Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEventPage;
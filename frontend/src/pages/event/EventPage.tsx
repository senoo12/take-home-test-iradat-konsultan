import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Event } from "../../types";
import { Link } from "react-router-dom";
import { deleteEvent, getEvent } from "../../api/event";
import EventList from "../../components/EventList";

const EventPage: React.FC = () => {
  const queryClient = useQueryClient();

  // query untuk ambil data
  const { data: events = [], isLoading, isError } = useQuery<Event[]>({
    queryKey: ["event"],
    queryFn: getEvent,
  });

  // mutation untuk hapus data
  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event"] });
      alert("Data berhasil dihapus");
    },
    onError: (error: any) => {
      alert("Gagal menghapus data: " + error.message);
    }
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div className="p-4 animate-pulse">Loading data...</div>;
  if (isError) return <div className="p-4 text-red-500">Error loading data</div>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Data Events</h1>
        <Link
          to="/event/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
        >
          + Add Data Event
        </Link>
      </div>
      
      <EventList 
        events={events} 
        onDelete={handleDelete} 
      />
    </div>
  );
};

export default EventPage;
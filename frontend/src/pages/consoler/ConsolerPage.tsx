import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getConsoler, deleteConsoler } from "../../api/consoler"; // Import delete function
import ConsolerList from "../../components/ConsolerList";
import { Consoler } from "../../types";
import { Link } from "react-router-dom";

const ConsolerPage: React.FC = () => {
  const queryClient = useQueryClient();

  // query untuk ambil data
  const { data: consolers = [], isLoading, isError } = useQuery<Consoler[]>({
    queryKey: ["consoler"],
    queryFn: getConsoler,
  });

  // mutation untuk hapus data
  const deleteMutation = useMutation({
    mutationFn: deleteConsoler,
    onSuccess: () => {
      // refresh data tabel setelah berhasil hapus
      queryClient.invalidateQueries({ queryKey: ["consoler"] });
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
        <h1 className="text-2xl font-bold text-gray-800">Data Consolers</h1>
        <Link
          to="/consoler/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
        >
          + Add Data Consoler
        </Link>
      </div>
      
      <ConsolerList 
        consolers={consolers} 
        onDelete={handleDelete} 
      />
    </div>
  );
};

export default ConsolerPage;
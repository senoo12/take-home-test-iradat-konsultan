import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getConsolerById, updateConsoler } from "../../api/consoler";

const EditConsoler: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rate: 0,
  });

  const { data: consoler, isLoading } = useQuery({
    queryKey: ["consoler", id],
    queryFn: () => getConsolerById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (consoler) {
      setFormData({
        name: consoler.name,
        email: consoler.email,
        rate: consoler.rate,
      });
    }
  }, [consoler]);

  const mutation = useMutation({
    mutationFn: (payload: typeof formData) => updateConsoler({ id: id!, payload }),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["consoler"] });
        alert("Data berhasil diperbarui!");
        navigate("/consoler");
    },
    onError: (error: any) => {
        const serverMessage = error.response?.data?.message;
        alert(serverMessage || "Terjadi kesalahan saat update data");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) return <p className="p-4">Loading data...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border">
      <h2 className="text-xl font-bold mb-6">Edit Consoler</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rate</label>
          <input
            type="number"
            className="w-full mt-1 px-3 py-2 border rounded-md outline-blue-500"
            value={formData.rate}
            onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })}
            required
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate("/consoler")}
            className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {mutation.isPending ? "Updating..." : "Update Data"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditConsoler;
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createConsoler } from "../../api/consoler";

const AddConsolerPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: "", email: "", rate: 0 });

  const mutation = useMutation({
    mutationFn: createConsoler,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consoler"] });
      navigate("/consoler"); 
    },
    onError: (error) => {
      alert("Gagal menambah data: " + error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-4">Add New Consoler</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            required
            className="w-full mt-1 px-3 py-2 border rounded-md"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            className="w-full mt-1 px-3 py-2 border rounded-md"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rate</label>
          <input
            type="number"
            required
            className="w-full mt-1 px-3 py-2 border rounded-md"
            onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })}
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {mutation.isPending ? "Saving..." : "Save Consoler"}
        </button>
      </form>
    </div>
  );
};

export default AddConsolerPage;
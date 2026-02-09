import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSalaries, getSalaryByConsoler, updateSalaryStatus } from "../../api/salary";
import { formatRupiah } from "../../helpers/currency";
import SalaryList from "../../components/SalaryList";

const SalaryPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "PAID">("ALL");

  const { data: rawSalaries = [], isLoading, isError } = useQuery({
    queryKey: ["salaries"],
    queryFn: getSalaries,
  });

  const { data: detail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["salary-detail", selectedId],
    queryFn: () => getSalaryByConsoler(selectedId!),
    enabled: !!selectedId,
  });

  const payMutation = useMutation({
    mutationFn: (id: string) => updateSalaryStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salaries"] });
      queryClient.invalidateQueries({ queryKey: ["salary-detail"] });
      alert("Pembayaran berhasil dikonfirmasi!");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Gagal memperbarui status");
    },
  });

  const uniqueConsolers = Array.from(
    new Map(
      rawSalaries
        .filter((s: any) => s?.consoler?.id_consoler)
        .map((s: any) => [s.consoler.id_consoler, s.consoler])
    ).values()
  );

  // data filter untuk tab PENDING / PAID
  const filteredData = rawSalaries.filter((s: any) => s.status === activeTab);

  if (isLoading) return <p className="p-6 text-gray-500">Loading data...</p>;
  if (isError) return <p className="p-6 text-red-500">Error loading data.</p>;

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Salary Management</h1>
      </div>

      {/* tab menu navigation */}
      <div className="flex space-x-1 mb-6 border-b border-gray-200">
        {["ALL", "PENDING", "PAID"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 text-sm font-medium transition-all ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "ALL" ? "All Consolers" : tab === "PENDING" ? "Pending Payments" : "Paid History"}
          </button>
        ))}
      </div>

      {/* konten berdasarkan tab */}
      {activeTab === "ALL" ? (
        <SalaryList 
          consolers={uniqueConsolers} 
          onDetail={(id) => setSelectedId(id)} 
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Consoler Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Date Created</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{item.consoler.name}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">{formatRupiah(item.consoler.rate)}</td>
                  <td className="px-6 py-4 text-center">
                    {item.status === "PENDING" ? (
                      <button
                        onClick={() => {
                          if (window.confirm(`Konfirmasi pembayaran untuk ${item.consoler.name}?`)) {
                            payMutation.mutate(item.id);
                          }
                        }}
                        disabled={payMutation.isPending}
                        className="px-3 py-1 text-xs font-bold text-white bg-emerald-600 rounded hover:bg-emerald-700 disabled:bg-gray-300 transition-colors"
                      >
                        {payMutation.isPending ? "Processing..." : "Mark as Paid"}
                      </button>
                    ) : (
                      <span className="px-3 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                    Tidak ada data ditemukan untuk status ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* modal detail */}
      {selectedId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-800">Salary Summary</h3>
              <button 
                onClick={() => setSelectedId(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>

            {isLoadingDetail || !detail ? (
              <div className="py-10 text-center">
                <p className="text-gray-500 animate-pulse">Fetching information...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold">Consoler Details</label>
                  <p className="text-gray-800 font-semibold text-lg">{detail?.name || "Unknown"}</p>
                  <p className="text-xs text-gray-400 italic">{detail?.email || "-"}</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg">
                    <label className="text-[10px] text-orange-600 uppercase font-black">Total Pending</label>
                    <p className="text-lg font-bold text-orange-700">
                      {formatRupiah(detail?.salary?.total_salary_pending ?? 0)}
                    </p>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                    <label className="text-[10px] text-green-600 uppercase font-black">Total Paid</label>
                    <p className="text-lg font-bold text-green-700">
                      {formatRupiah(detail?.salary?.total_salary_paid ?? 0)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold">Total Work Hours</label>
                    <p className="font-semibold text-gray-800 text-lg">{detail?.total_hours_attendance ?? 0} hrs</p>
                  </div>
                  <div className="text-right">
                    <label className="text-xs text-gray-500 uppercase font-bold">Accumulated Salary</label>
                    <p className="font-bold text-blue-600 text-xl">
                      {formatRupiah(detail?.salary?.total_salary ?? 0)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedId(null)}
              className="w-full mt-8 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-bold transition-all"
            >
              Close Detail
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryPage;
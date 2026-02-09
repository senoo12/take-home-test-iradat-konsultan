import { api } from "./index";

export const getSalaries = async () => {
  const res = await api.get("/salary");
  return res.data.data;
};

export const getSalaryByConsoler = async (id: string) => {
  const res = await api.get(`/salary/consoler/${id}`);
  return res.data.data;
};

export const updateSalaryStatus = async (id: string) => {
  const res = await api.patch(`/salary/${id}`, { status: "PAID" });
  return res.data;
};
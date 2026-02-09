import { api } from "./index";
import { Consoler } from "../types";

interface GetConsolerResponse {
  success: boolean;
  message: string;
  data: Consoler[];
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export const getConsoler = async (): Promise<Consoler[]> => {
  try {
    const res = await api.get<GetConsolerResponse>("/consoler");
    console.log("Full Response:", res); 
    return res.data.data; 
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

interface CreateConsolerInput {
  name: string;
  email: string;
  rate: number;
}

export const createConsoler = async (payload: CreateConsolerInput) => {
  const res = await api.post("/consoler", payload);
  return res.data;
};

export const getConsolerById = async (id: string): Promise<Consoler> => {
  const res = await api.get<GetConsolerResponse>(`/consoler/${id}`);
  return res.data.data[0] || res.data.data; 
};

export const updateConsoler = async ({ id, payload }: { id: string; payload: Partial<Consoler> }) => {
  const res = await api.put(`/consoler/${id}`, payload);
  return res.data;
};

export const deleteConsoler = async (id: string) => {
  await api.delete(`/consoler/${id}`);
};
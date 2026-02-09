import { api } from "./index";
import { Attendance } from "../types";

interface GetAttendanceResponse {
  success: boolean;
  message: string;
  data: Attendance[];
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export const getAttendance = async (): Promise<Attendance[]> => {
  try {
    const res = await api.get<GetAttendanceResponse>("/attendance");
    console.log("Full Response:", res); 
    return res.data.data; 
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

interface CreateAttendanceInput {
  id_event: string;
  id_consoler: string;
  hours: number | null;
  status_attendance: string;
  date_attendance: string | null;
}

export const createAttendance = async (payload: CreateAttendanceInput) => {
  const res = await api.post("/attendance", payload);
  return res.data;
};

export const getAttendanceById = async (id: string): Promise<Attendance> => {
  const res = await api.get<GetAttendanceResponse>(`/attendance/${id}`);
  return res.data.data[0] || res.data.data; 
};

export const updateAttendance = async ({ id, payload }: { id: string; payload: Partial<Attendance> }) => {
  const res = await api.put(`/attendance/${id}`, payload);
  return res.data;
};

export const deleteAttendance = async (id: string) => {
  await api.delete(`/attendance/${id}`);
};
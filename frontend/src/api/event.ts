import { api } from "./index";
import { Event } from "../types";

interface GetEventResponse {
  success: boolean;
  message: string;
  data: Event[];
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export const getEvent = async (): Promise<Event[]> => {
  try {
    const res = await api.get<GetEventResponse>("/event");
    console.log("Full Response:", res); 
    return res.data.data; 
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

interface CreateEventInput {
  name_event: string;
  description: string;
  start_time: string;
  end_time: string;
  date: string;
}

export const createEvent = async (payload: CreateEventInput) => {
  const res = await api.post("/event", payload);
  return res.data;
};

export const getEventById = async (id: string): Promise<Event> => {
  const res = await api.get<GetEventResponse>(`/event/${id}`);
  return res.data.data[0] || res.data.data; 
};

export const updateEvent = async ({ id, payload }: { id: string; payload: Partial<Event> }) => {
  const res = await api.put(`/event/${id}`, payload);
  return res.data;
};

export const deleteEvent = async (id: string) => {
  await api.delete(`/event/${id}`);
};
export interface CreateEventRequest {
  name_event: string;
  description: string;
  start_time: string;
  end_time: string;
  date: String;
}

export interface UpdateEventRequest extends CreateEventRequest {
  id: string;
}

export interface EventResponse {
  id: string;
  name_event: string;
  description: string;
  start_time: string;
  end_time: string;
  date: string;
  created_at: Date;
  updated_at: Date;
}
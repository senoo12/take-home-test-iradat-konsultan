export interface CreateAttendanceRequest {
  id_event: string;
  id_consoler: string;
  status_attendance: string;
  hours: number;
  date_attendance: string;
}

export interface UpdateAttendanceRequest extends CreateAttendanceRequest {
  id: string;
}

export interface AttendanceResponse {
  id: string;
  event: {
    id_event: string;
    name_event: string;
    description: string;
  }
  consoler: {
    id_consoler: string;
    name: string;
    email: string;
  };
  status_attendance: string;
  date_attendance: string | null;
  hours: number | null;
  created_at: Date;
  updated_at: Date;
}
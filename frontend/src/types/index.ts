export enum SalaryStatus {
  PENDING = "PENDING",
  PAID = "PAID",
}

export enum StatusAttendance {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
}

export interface Consoler {
  id: string;
  name: string;
  email: string;
  rate: number;
  walet: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Event {
  id: string;
  name_event: string;
  description: string;
  start_time: string;
  end_time: string;
  date: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Attendance {
  id: string;
  status_attendance: "PRESENT" | "ABSENT";
  date_attendance: string;
  hours: number;
  event: {
    id_event: string;
    name_event: string;
    description: string;
  };
  consoler: {
    id_consoler: string;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Salary {
  id: string;
  id_consoler: string;
  id_attandance: string;
  salary: number;
  status: SalaryStatus;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

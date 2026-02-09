export interface CreateSalaryRequest {
  id_consoler: string;
  id_attendance: string;
  status: string;
}

export interface UpdateSalaryRequest extends CreateSalaryRequest {
  id: string;
  status: string;
}

export interface SalaryResponse {
  id: string;
  consoler: {
    id_consoler: string;
    name: string;
    email: string;
    rate: number;
  }
  total_salary: number;
  date_paid: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface TotalSalaryResponse {
  name: string;
  email: string;
  rate: number;
  total_hours_attendance: number;
  salary: {
    total_salary_pending: number;
    total_salary_paid: number;
    total_salary: number;
  }
}
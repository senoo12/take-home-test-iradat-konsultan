export interface CreateConsolerRequest {
  name: string;
  email: string;
  rate: number;
  walet: number;
}

export interface UpdateConsolerRequest extends CreateConsolerRequest {
  id: string;
}

export interface ConsolerResponse {
  id: string;
  name: string;
  email: string;
  rate: number;
  walet: number;
  created_at: Date;
  updated_at: Date;
}
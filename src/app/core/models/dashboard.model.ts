import { WebsiteResponse } from './website.model';

export interface DashboardResponse {
  upCount: number;
  downCount: number;
  slowCount: number;
  totalCount: number;
  websites: WebsiteResponse[];
}

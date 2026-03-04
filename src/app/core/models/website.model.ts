import { TagResponse } from './tag.model';

export interface WebsiteRequest {
  url: string;
  alias?: string;
  enabled?: boolean;
}

export interface WebsiteResponse {
  id: string;
  url: string;
  alias: string;
  enabled: boolean;
  tags: TagResponse[];
  status: 'UP' | 'DOWN' | 'SLOW' | null;
  httpCode: number | null;
  responseMs: number | null;
  lastCheckedAt: string | null;
  createdAt: string;
}

export interface WebsiteTagRequest {
  tagIds: string[];
}

export interface CheckResult {
  id: string;
  websiteId: string;
  status: 'UP' | 'DOWN' | 'SLOW';
  httpCode: number;
  responseMs: number;
  errorMsg: string | null;
  checkedAt: string;
}

export interface StatusUpdateMessage {
  websiteId: string;
  url: string;
  alias: string;
  status: 'UP' | 'DOWN' | 'SLOW';
  httpCode: number;
  responseMs: number;
  checkedAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface HourlyStatsResponse {
  hourBucket: string;
  checkCount: number;
  upCount: number;
  downCount: number;
  slowCount: number;
  avgResponseMs: number | null;
  minResponseMs: number | null;
  maxResponseMs: number | null;
}

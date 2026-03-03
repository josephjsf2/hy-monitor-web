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

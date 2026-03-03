export interface TagRequest {
  name: string;
  color: string;
}

export interface TagResponse {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

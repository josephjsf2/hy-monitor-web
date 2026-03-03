import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TagRequest, TagResponse } from '../models/tag.model';

@Injectable({ providedIn: 'root' })
export class TagService {
  private http = inject(HttpClient);
  private baseUrl = '/api/tags';

  getAll(): Observable<TagResponse[]> {
    return this.http.get<TagResponse[]>(this.baseUrl);
  }

  create(request: TagRequest): Observable<TagResponse> {
    return this.http.post<TagResponse>(this.baseUrl, request);
  }

  update(id: string, request: TagRequest): Observable<TagResponse> {
    return this.http.put<TagResponse>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

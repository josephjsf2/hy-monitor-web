import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WebsiteRequest, WebsiteResponse, WebsiteTagRequest, CheckResult } from '../models/website.model';

@Injectable({ providedIn: 'root' })
export class WebsiteService {
  private http = inject(HttpClient);
  private baseUrl = '/api/websites';

  getAll(): Observable<WebsiteResponse[]> {
    return this.http.get<WebsiteResponse[]>(this.baseUrl);
  }

  create(request: WebsiteRequest): Observable<WebsiteResponse> {
    return this.http.post<WebsiteResponse>(this.baseUrl, request);
  }

  update(id: string, request: WebsiteRequest): Observable<WebsiteResponse> {
    return this.http.put<WebsiteResponse>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  setTags(id: string, request: WebsiteTagRequest): Observable<WebsiteResponse> {
    return this.http.put<WebsiteResponse>(`${this.baseUrl}/${id}/tags`, request);
  }

  getHistory(id: string, page = 0, size = 100): Observable<CheckResult[]> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<CheckResult[]>(`${this.baseUrl}/${id}/history`, { params });
  }
}

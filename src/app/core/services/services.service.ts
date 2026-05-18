import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Service } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private readonly base = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Service[]> {
    return this.http.get<Service[]>(this.base);
  }

  getOne(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.base}/${id}`);
  }

  create(data: { name: string; description?: string; slug: string }): Observable<Service> {
    return this.http.post<Service>(this.base, data);
  }

  update(id: string, data: { name: string; description?: string; slug: string }): Observable<Service> {
    return this.http.patch<Service>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  getBySlug(slug: string): Observable<Service> {
    return this.http.get<Service>(`${environment.apiUrl}/public/services/${slug}`);
  }
}

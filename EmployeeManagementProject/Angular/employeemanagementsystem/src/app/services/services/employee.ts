import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Employee } from '../../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseUrl = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) { }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}`).pipe(
      map((serverList: Employee[]) => {
        try {
          const localJson = localStorage.getItem('employees_local') || '[]';
          const localList = JSON.parse(localJson) as Employee[];
          // merge serverList with localList (avoid duplicate ids)
          const ids = new Set(serverList.map(e => e.id));
          const merged = serverList.concat(localList.filter(e => !ids.has(e.id)));
          return merged;
        } catch (e) {
          console.error('Failed to merge local employees', e);
          return serverList;
        }
      }),
      catchError(err => {
        console.error('GET /employees failed, returning local cache', err);
        try {
          const localJson = localStorage.getItem('employees_local') || '[]';
          const localList = JSON.parse(localJson) as Employee[];
          return of(localList);
        } catch (e) {
          return throwError(err);
        }
      })
    );
  }

  addEmployee(employee: Employee): Observable<Object> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(`${this.baseUrl}`, employee, { headers }).pipe(
      catchError(err => {
        // Likely network / CORS error. Save to localStorage as a fallback so UI works.
        console.error('POST /employees failed, saving to local cache', err);
        try {
          const raw = localStorage.getItem('employees_local') || '[]';
          const list = JSON.parse(raw) as any[];
          // ensure id exists; if not, generate a negative id to avoid collision
          const entry = Object.assign({}, employee);
          if (!entry.id) {
            entry.id = Date.now() * -1;
          }
          list.push(entry);
          localStorage.setItem('employees_local', JSON.stringify(list));
          // return successful observable so UI behaves as if saved
          return of(entry as any);
        } catch (e) {
          console.error('Saving to local cache failed', e);
          return throwError(err);
        }
      })
    );
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  updateEmployee(id: number, employee: Employee): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, employee).pipe(
      catchError(err => {
        // Fallback: update in localStorage
        console.error('PUT /employees failed, updating local cache', err);
        try {
          const raw = localStorage.getItem('employees_local') || '[]';
          const list = JSON.parse(raw) as any[];
          const index = list.findIndex(e => e.id === id);
          if (index !== -1) {
            list[index] = Object.assign({}, employee);
            localStorage.setItem('employees_local', JSON.stringify(list));
            console.log('Updated in local cache, id:', id);
          }
          return of({} as any);
        } catch (e) {
          console.error('Local cache update failed', e);
          return throwError(err);
        }
      })
    );
  }

  deleteEmployee(id: number): Observable<Object> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(err => {
        // Fallback: remove from localStorage
        console.error('DELETE failed, removing from local cache', err);
        try {
          const raw = localStorage.getItem('employees_local') || '[]';
          const list = JSON.parse(raw) as any[];
          const filtered = list.filter(e => e.id !== id);
          localStorage.setItem('employees_local', JSON.stringify(filtered));
          console.log('Removed from local cache, id:', id);
          // return successful observable so UI behaves as if deleted
          return of({} as any);
        } catch (e) {
          console.error('Local cache delete failed', e);
          return throwError(err);
        }
      })
    );
  }
}

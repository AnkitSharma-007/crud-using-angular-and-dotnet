import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { City } from '../models/city';
import { Employee } from '../models/employee';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly http = inject(HttpClient);
  baseURL = '/api/employee/';
  employees$ = new BehaviorSubject<Employee[]>([]);

  private city$ = this.http.get<City[]>(`${this.baseURL}/GetCityList`);
  cityList = toSignal(this.city$, { initialValue: [] });

  fetchEmployeeData() {
    return this.http.get<Employee[]>(this.baseURL).pipe(
      map((result) => {
        this.employees$.next(result);
      }),
      shareReplay(1)
    );
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(this.baseURL + id);
  }

  saveEmployee(employee: Partial<Employee>) {
    return this.http.post(this.baseURL, employee);
  }

  updateEmployee(employee: Partial<Employee>) {
    return this.http.put(this.baseURL, employee);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(this.baseURL + id);
  }
}

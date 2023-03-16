import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { City } from '../models/city';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  baseURL = '/api/employee/';
  movies$ = new BehaviorSubject<Employee[]>([]);

  city$ = this.http
    .get<City[]>(`${this.baseURL}/GetCityList`)
    .pipe(shareReplay(1));

  constructor(private readonly http: HttpClient) {}

  fetchEmployeeData() {
    return this.http.get<Employee[]>(this.baseURL).pipe(
      map((result) => {
        this.movies$.next(result);
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

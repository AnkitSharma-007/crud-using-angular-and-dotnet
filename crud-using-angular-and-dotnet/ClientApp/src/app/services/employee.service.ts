import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, shareReplay, tap } from 'rxjs';
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

 mockCities: City[] = [{ cityId: 1, cityName: 'New York' }, { cityId: 2, cityName: 'Los Angeles' }];

  private city$ = this.http.get<City[]>(`${this.baseURL}GetCityList`);
  cityList = toSignal(this.city$, { initialValue: [] });
  
  cityList1 = of(this.mockCities);
  fetchEmployeeData() {
    return this.http.get<Employee[]>(this.baseURL).pipe(
      tap((result) => {
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

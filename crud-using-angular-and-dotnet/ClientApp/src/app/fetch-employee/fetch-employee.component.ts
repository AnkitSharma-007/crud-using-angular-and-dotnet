import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-fetch-employee',
  templateUrl: './fetch-employee.component.html',
  styleUrls: ['./fetch-employee.component.css'],
})
export class FetchEmployeeComponent implements OnInit, OnDestroy {
  readonly employees$ = this.employeeService.employees$;
  private destroyed$ = new ReplaySubject<void>(1);

  constructor(private readonly employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService
      .fetchEmployeeData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe();
  }

  delete(employeeID: number): void {
    const confirmDelete = confirm(
      'Do you want to delete the employee with Id: ' + employeeID
    );
    if (confirmDelete) {
      this.employeeService
        .deleteEmployee(employeeID)
        .pipe(
          switchMap(() => this.employeeService.fetchEmployeeData()),
          takeUntil(this.destroyed$)
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

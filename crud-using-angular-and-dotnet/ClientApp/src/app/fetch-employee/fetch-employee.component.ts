import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-fetch-employee',
  templateUrl: './fetch-employee.component.html',
  styleUrls: ['./fetch-employee.component.css'],
  imports: [RouterLink, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FetchEmployeeComponent implements OnDestroy {
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);
  private destroyed$ = new ReplaySubject<void>(1);
  readonly employees$ = this.employeeService.employees$;

  constructor() {
    this.employeeService
      .fetchEmployeeData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe();
  }

  delete(employeeID: number): void {
      const confirmDelete = confirm(
        'Do you want to delete the employee with Id: ' + employeeID
      );
      if (confirmDelete)
        this.employeeService
          .deleteEmployee(employeeID)
          .pipe(
            switchMap(() => this.employeeService.fetchEmployeeData()),
            takeUntil(this.destroyed$)
          )
          .subscribe();
  }


  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

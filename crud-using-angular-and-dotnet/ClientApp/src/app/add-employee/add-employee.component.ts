import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { Employee } from '../models/employee';
import { EmployeeRegistration } from '../models/employee-registration';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class AddEmployeeComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  protected readonly employeeService = inject(EmployeeService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  formTitle = signal('Add');
  submitted = signal(false);
  employeeId = signal(0);

  employeeForm: FormGroup<EmployeeRegistration> = this.formBuilder.group({
    employeeId: 0,
    name: ['', Validators.required],
    gender: ['', Validators.required],
    department: ['', Validators.required],
    city: ['', Validators.required],
  });

  private destroyed$ = new ReplaySubject<void>(1);

  ngOnInit(): void {
    this.fetchEmployeeDetails();
  }

  onFormSubmit(): void {
    this.submitted.set(true);
    if (!this.employeeForm.valid) {
      return;
    }

    if (this.employeeId() > 0) {
      this.updateEmployee();
    } else {
      this.addEmployee();
    }
  }

  navigateToFetchEmployee(): void {
    this.router.navigate(['/employee/fetch']);
  }

  get employeeFormControl() {
    return this.employeeForm.controls;
  }

  private fetchEmployeeDetails(): void {
    this.activatedRoute.paramMap
      .pipe(
        switchMap((params) => {
          this.employeeId.set(Number(params.get('employeeId')));
          if (this.employeeId() > 0) {
            this.formTitle.set('Edit');
            return this.employeeService.getEmployeeById(this.employeeId());
          } else {
            return EMPTY;
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe({
        next: (result: Employee) => {
          if (result) {
            this.employeeForm.setValue(result);
          }
        },
        error: (error) => {
          console.error('Error ocurred while fetching employee data : ', error);
        },
      });
  }

  private addEmployee(): void {
    this.employeeService
      .saveEmployee(this.employeeForm.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => {
          this.navigateToFetchEmployee();
        },
        error: (error) => console.error(error),
      });
  }

  private updateEmployee(): void {
    this.employeeService
      .updateEmployee(this.employeeForm.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => {
          this.navigateToFetchEmployee();
        },
        error: (error) => console.error(error),
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { Employee } from '../models/employee';
import { EmployeeRegistration } from '../models/employee-registration';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent implements OnInit, OnDestroy {
  employeeForm!: FormGroup<EmployeeRegistration>;

  formTitle = 'Add';
  submitted = false;
  employeeId!: number;

  readonly cityList$ = this.employeeService.city$;
  private destroyed$ = new ReplaySubject<void>(1);

  constructor(
    private readonly formBuilder: NonNullableFormBuilder,
    private readonly employeeService: EmployeeService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.fetchEmployeeDetails();
  }

  onFormSubmit(): void {
    this.submitted = true;
    if (!this.employeeForm.valid) {
      return;
    }

    if (this.employeeId) {
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

  private initializeForm(): void {
    this.employeeForm = this.formBuilder.group({
      employeeId: 0,
      name: ['', Validators.required],
      gender: ['', Validators.required],
      department: ['', Validators.required],
      city: ['', Validators.required],
    });
  }

  private fetchEmployeeDetails(): void {
    this.activatedRoute.paramMap
      .pipe(
        switchMap((params) => {
          this.employeeId = Number(params.get('employeeId'));
          if (this.employeeId > 0) {
            this.formTitle = 'Edit';
            return this.employeeService.getEmployeeById(this.employeeId);
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

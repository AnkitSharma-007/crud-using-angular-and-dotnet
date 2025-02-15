import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { FetchEmployeeComponent } from './fetch-employee.component';
import { createSpyFromClass } from 'jest-auto-spies';
import { EmployeeService } from '../services/employee.service';
import { of } from 'rxjs';
import userEvent from '@testing-library/user-event';
import { provideRouter, Router, Routes } from '@angular/router';

const employeeList = [
  {
    employeeId: 1,
    name: 'John Doe',
    city: 'New York',
    department: 'IT',
    gender: 'Male',
  },
];

describe('FetchEmployeeComponent', () => {
  async function setup({ confirmDelete = false, noData = false } = {}) {
    const mockEmployeeService = createSpyFromClass(EmployeeService, {
      observablePropsToSpyOn: ['employees$'],
      methodsToSpyOn: ['fetchEmployeeData', 'deleteEmployee'],
    });

    if (noData) {
      mockEmployeeService.employees$.next([]);
    } else {
      mockEmployeeService.employees$.nextWith(employeeList);
    }

    mockEmployeeService.fetchEmployeeData.mockReturnValue(of(employeeList));
    mockEmployeeService.deleteEmployee.mockReturnValue(of({}));

    jest.spyOn(window, 'confirm').mockReturnValue(confirmDelete);
    const appRoutes: Routes = [];
    const { fixture } = await render(FetchEmployeeComponent, {
      imports: [FetchEmployeeComponent],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        provideRouter(appRoutes),
      ],
    });

    const router = fixture.debugElement.injector.get(Router);
    const navigateSpy = jest.spyOn(router, 'navigateByUrl');

    return {
      component: fixture.componentInstance,
      mockEmployeeService,
      router,
      navigateSpy,
    };
  }

  it('should display the table when employees are present', async () => {
    await setup();
    expect(
      screen.getByRole('button', { name: /Add new employee/i })
    ).toBeVisible();
    expect(screen.getAllByRole('table').length).toBe(1);
  });

  it('should navigate to the add employee page', async () => {
    const { navigateSpy, router } = await setup();
    const button = screen.getByRole('button', { name: /Add new employee/i });
    fireEvent.click(button);
    await waitFor(() =>
      expect(navigateSpy).toHaveBeenCalledWith('/employee/add')
    );
    expect(router.navigate).toHaveBeenCalledTimes(1);
  });

  it('should navigate to the edit employee page', async () => {
    const { navigateSpy, router } = await setup();
    const button = screen.getByRole('button', { name: /Edit/i });
    fireEvent.click(button);
    await waitFor(() => expect(navigateSpy).toHaveBeenCalledWith('/dashboard'));
    // expect(router.navigate).toHaveBeenCalledTimes(1);
  });

  it('should fetch employee data on init', async () => {
    const { mockEmployeeService } = await setup();
    expect(mockEmployeeService.fetchEmployeeData).toHaveBeenCalled();
  });

  it('should invoke the delete function when delete button is clicked', async () => {
    const { mockEmployeeService } = await setup({ confirmDelete: true });
    const button = screen.getAllByRole('button', { name: /Delete/i });
    await userEvent.click(button[0]);
    expect(mockEmployeeService.deleteEmployee).toHaveBeenCalledWith(
      employeeList[0].employeeId
    );
    expect(mockEmployeeService.fetchEmployeeData).toHaveBeenCalledTimes(2);
  });

  it('should not delete employee if confirm is cancelled', async () => {
    const { mockEmployeeService } = await setup();
    const button = screen.getAllByRole('button', { name: /Delete/i });
    await userEvent.click(button[0]);
    expect(mockEmployeeService.deleteEmployee).not.toHaveBeenCalled();
    expect(mockEmployeeService.fetchEmployeeData).toHaveBeenCalledTimes(1);
  });
});

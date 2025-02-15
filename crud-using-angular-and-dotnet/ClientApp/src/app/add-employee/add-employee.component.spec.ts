import { AddEmployeeComponent } from './add-employee.component';
import { createSpyFromClass } from 'jest-auto-spies';
import { EmployeeService } from '../services/employee.service';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { City } from '../models/city';
import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';

const employeeList = [
  {
    employeeId: 1,
    name: 'John Doe',
    city: 'New York',
    department: 'IT',
    gender: 'Male',
  },
];

const mockCities: City[] = [
  { cityId: 1, cityName: 'New York' },
  { cityId: 2, cityName: 'Los Angeles' },
];

describe('AddEmployeeComponent', () => {
  async function setup({ updateEmployee = false } = {}) {
    const mockEmployeeService = createSpyFromClass(EmployeeService, {
      methodsToSpyOn: [
        'getEmployeeById',
        'saveEmployee',
        'updateEmployee',
        'cityList',
      ],
    });

    const route = createSpyFromClass(ActivatedRoute, {
      observablePropsToSpyOn: ['paramMap'],
    });
    if (updateEmployee) {
      route.paramMap.nextWith(
        convertToParamMap({
          employeeId: '1',
        })
      );
    }

    mockEmployeeService.cityList.mockReturnValue(mockCities);
    mockEmployeeService.getEmployeeById.mockReturnValue(of(employeeList[0]));
    mockEmployeeService.saveEmployee.mockReturnValue(of({}));
    mockEmployeeService.updateEmployee.mockReturnValue(of({}));

    const { fixture } = await render(AddEmployeeComponent, {
      imports: [AddEmployeeComponent],
      providers: [
        // provideHttpClientTesting(),
        { provide: EmployeeService, useValue: mockEmployeeService },
        // {
        //   provide: ActivatedRoute,
        //   useValue: route,
        // },
      ],
    });

    const router = fixture.debugElement.injector.get(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    return {
      component: fixture.componentInstance,
      mockEmployeeService,
      router,
      navigateSpy,
    };
  }

  it('should validate the form UI controls and form validations messages', async () => {
    await setup();
    expect(screen.getByText('Add employee')).toBeVisible();
    expect(screen.getByText('Name')).toBeVisible();
    expect(screen.getByText('Gender')).toBeVisible();
    expect(screen.getByText('Department')).toBeVisible();
    expect(screen.getByText('City')).toBeVisible();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeVisible();

    const button = screen.getByRole('button', { name: /Save/i });
    await userEvent.click(button);

    expect(screen.getByText('Name is required')).toBeVisible();
    expect(screen.getByText('Gender is required')).toBeVisible();
    expect(screen.getByText('Department is required')).toBeVisible();
    expect(screen.getByText('City is required')).toBeVisible();
  });

  it('should save the new employee data', async () => {
    const { mockEmployeeService, navigateSpy, router } = await setup();

    const name = screen.getByRole('textbox', { name: /name/i });
    const gender = screen.getByRole('combobox', { name: /gender/i });
    const department = screen.getByRole('textbox', { name: /department/i });
    const city = screen.getByRole('combobox', { name: /city/i });

    await userEvent.type(name, 'John Doe');

    userEvent.selectOptions(gender, 'Male');
    await userEvent.type(department, 'IT');

    userEvent.selectOptions(city, 'Los Angeles');
    const saveButton = screen.getByRole('button', { name: /Save/i });
    await userEvent.click(saveButton);

    // expect(mockEmployeeService.saveEmployee).toHaveBeenCalledTimes(1);
    // expect(mockEmployeeService.saveEmployee).toHaveBeenCalledWith({
    //   employeeId: 0,
    //   name: 'John Doe',
    //   gender: 'Male',
    //   department: 'IT',
    //   city: 'Los Angeles',
    // });

    await waitFor(() =>
      expect(navigateSpy).toHaveBeenCalledWith(['/employee/fetch'])
    );
    expect(router.navigate).toHaveBeenCalledTimes(1);
  });

  it('should update the existing employee data', async () => {
    const { mockEmployeeService, navigateSpy, router } = await setup({
      updateEmployee: true,
    });

    expect(screen.getByText('Edit employee')).toBeVisible();

    const department = screen.getByRole('textbox', { name: /department/i });
    const city = screen.getByRole('combobox', { name: /city/i });

    await userEvent.clear(department);
    await userEvent.type(department, 'Marketing');
    userEvent.selectOptions(city, 'New York');

    const saveButton = screen.getByRole('button', { name: /Save/i });
    await fireEvent.click(saveButton);

    expect(mockEmployeeService.updateEmployee).toHaveBeenCalledTimes(1);
    expect(mockEmployeeService.updateEmployee).toHaveBeenCalledWith({
      employeeId: 1,
      name: 'John Doe',
      gender: 'Male',
      department: 'Marketing',
      city: 'New York',
    });

    await waitFor(() =>
      expect(navigateSpy).toHaveBeenCalledWith(['/employee/fetch'])
    );
    expect(router.navigate).toHaveBeenCalledTimes(1);
  });

  it('should validate the function of cancel button', async () => {
    const { router, navigateSpy } = await setup();
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);
    await waitFor(() =>
      expect(navigateSpy).toHaveBeenCalledWith(['/employee/fetch'])
    );
    expect(router.navigate).toHaveBeenCalledTimes(1);
  });
});

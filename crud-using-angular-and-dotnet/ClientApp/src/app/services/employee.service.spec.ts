import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { createSpyFromClass } from 'jest-auto-spies';
import { EmployeeService } from './employee.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { createTokenWithContext } from 'src/app/utility/create-token-with-context';
import { City } from '../models/city';

const mockCities: City[] = [{ cityId: 1, cityName: 'New York' }, { cityId: 2, cityName: 'Los Angeles' }];

describe('EmployeeService', () => {
  function setup({ isCityApi = false } = {}) {
    const mockHttpClient = createSpyFromClass(HttpClient);

    if(isCityApi) {
      mockHttpClient.get.mockReturnValue(of(mockCities));
    } else {
    mockHttpClient.get.mockReturnValue(of({ name: 'John Doe' }));
    }

    mockHttpClient.post.mockReturnValue(of({ success: true }));
    mockHttpClient.put.mockReturnValue(of({ success: true }));
    mockHttpClient.delete.mockReturnValue(of({ success: true }));

    const service = createTokenWithContext({
      tokenOrFunc: EmployeeService,
      providers: [
        {
          provide: HttpClient,
          useValue: mockHttpClient,
        },
      ],
    });
    return { service, mockHttpClient };
  }

  it('fetches City List', () => {
    const { service, mockHttpClient } = setup({isCityApi: true});
    const cityList = service.cityList();
    expect(cityList).toEqual(mockCities);
    expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
    expect(mockHttpClient.get).toHaveBeenCalledWith('/api/employee/GetCityList');
  });

  it('fetches Employee Data', () => {
    const { service, mockHttpClient } = setup();
    subscribeSpyTo(service.fetchEmployeeData()).getLastValue();
    expect(mockHttpClient.get).toHaveBeenCalledTimes(2);
    expect(mockHttpClient.get).toHaveBeenCalledWith('/api/employee/');
  });

  it('gets Employee by ID', () => {
    const { service, mockHttpClient } = setup();
    const employeeId = 1;
    service.getEmployeeById(employeeId).subscribe();
    expect(mockHttpClient.get).toHaveBeenCalledTimes(2);  
    expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/employee/${employeeId}`);
  });

  it('saves Employee', () => {
    const { service, mockHttpClient } = setup();
    const employee = { name: 'John Doe' };
    service.saveEmployee(employee).subscribe();
    expect(mockHttpClient.post).toHaveBeenCalledTimes(1);
    expect(mockHttpClient.post).toHaveBeenCalledWith('/api/employee/', employee);
  });

  it('updates Employee', () => {
    const { service, mockHttpClient } = setup();
    const employee = { id: 1, name: 'John Doe' };
    service.updateEmployee(employee).subscribe();
    expect(mockHttpClient.put).toHaveBeenCalledTimes(1);
    expect(mockHttpClient.put).toHaveBeenCalledWith('/api/employee/', employee);
  });

  it('deletes Employee', () => {
    const { service, mockHttpClient } = setup();
    const employeeId = 1;
    service.deleteEmployee(employeeId).subscribe();
    expect(mockHttpClient.delete).toHaveBeenCalledTimes(1);
    expect(mockHttpClient.delete).toHaveBeenCalledWith(`/api/employee/${employeeId}`);
  });
});

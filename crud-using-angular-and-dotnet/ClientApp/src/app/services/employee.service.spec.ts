import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { createSpyFromClass } from 'jest-auto-spies';
import { EmployeeService } from './employee.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { createTokenWithContext } from 'src/app/utility/create-token-with-context';

describe('EmployeeService', () => {
  function setup() {
    const mockHttpClient = createSpyFromClass(HttpClient);
    // const RESPONSE_STRING =
    //   'column 1,column 2,column 3,column 4' +
    //   'column 5,column 6,column 7,column 8,';
    // mockHttpClient.get.mockReturnValue(of(RESPONSE_STRING));
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

  it('fetches Employee Data', () => {
    const { service, mockHttpClient } = setup();
    subscribeSpyTo(service.fetchEmployeeData()).getLastValue();
    expect(mockHttpClient.get).toHaveBeenCalledWith('/api/employee/');
  });
});

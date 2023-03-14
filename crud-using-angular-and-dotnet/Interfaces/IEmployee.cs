using crud_using_angular_and_dotnet.Models;

namespace crud_using_angular_and_dotnet.Interfaces
{
    public interface IEmployee
    {
        List<Employee> GetAllEmployees();
        void AddEmployee(Employee employee);
        void UpdateEmployee(Employee employee);
        Employee GetEmployeeData(int employeeId);
        void DeleteEmployee(int employeeId);
        List<City> GetCities();
    }
}

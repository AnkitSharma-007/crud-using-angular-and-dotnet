using crud_using_angular_and_dotnet.Interfaces;
using crud_using_angular_and_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace crud_using_angular_and_dotnet.DataAccess
{
    public class EmployeeDataAccessLayer : IEmployee
    {
        private readonly EmployeeDbContext dbContext;

        public EmployeeDataAccessLayer(EmployeeDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        public List<Employee> GetAllEmployees()
        {
            try
            {
                List<Employee> lstEmploye = new();

                lstEmploye = dbContext.Employees.OrderBy(x => x.EmployeeId).ToList();

                return lstEmploye;
            }
            catch
            {
                throw;
            }
        }

        public void AddEmployee(Employee employee)
        {
            try
            {
                dbContext.Employees.Add(employee);
                dbContext.SaveChanges();
            }
            catch
            {
                throw;
            }
        }

        public void UpdateEmployee(Employee employee)
        {
            try
            {
                dbContext.Entry(employee).State = EntityState.Modified;
                dbContext.SaveChanges();
            }
            catch
            {
                throw;
            }
        }

        public Employee GetEmployeeData(int employeeId)
        {
            try
            {
                Employee? employee = dbContext?.Employees.Find(employeeId);

                if (employee is not null)
                {
                    return employee;
                }
                return new Employee();

            }
            catch
            {
                throw;
            }
        }

        public void DeleteEmployee(int employeeId)
        {
            try
            {
                Employee? employee = dbContext.Employees.Find(employeeId);
                if (employee is not null)
                {
                    dbContext.Employees.Remove(employee);
                    dbContext.SaveChanges();
                }
            }
            catch
            {
                throw;
            }
        }

        public List<City> GetCities()
        {
            return dbContext.Cities.OrderBy(x => x.CityId).ToList();
        }
    }
}

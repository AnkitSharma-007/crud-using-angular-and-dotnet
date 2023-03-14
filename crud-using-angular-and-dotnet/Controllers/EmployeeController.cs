using crud_using_angular_and_dotnet.Interfaces;
using crud_using_angular_and_dotnet.Models;
using Microsoft.AspNetCore.Mvc;

namespace crud_using_angular_and_dotnet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployee objemployee;

        public EmployeeController(IEmployee _objemployee)
        {
            objemployee = _objemployee;
        }

        [HttpGet]
        public List<Employee> Get()
        {
            return objemployee.GetAllEmployees();
        }

        [HttpPost]
        public IActionResult Post(Employee employee)
        {
            objemployee.AddEmployee(employee);
            return Ok();
        }

        [HttpGet("{id}")]
        public Employee Get(int id)
        {
            return objemployee.GetEmployeeData(id);
        }

        [HttpPut]
        public IActionResult Put(Employee employee)
        {
            objemployee.UpdateEmployee(employee);
            return Ok();
        }

        [HttpDelete("{employeeId}")]
        public IActionResult Delete(int employeeId)
        {
            objemployee.DeleteEmployee(employeeId);
            return Ok();
        }

        [HttpGet]
        [Route("GetCityList")]
        public IEnumerable<City> GetCityList()
        {
            return objemployee.GetCities();
        }
    }
}

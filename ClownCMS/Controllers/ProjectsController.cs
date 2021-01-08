using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClownCMS.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {

        private readonly ILogger<ProjectsController> _logger;

        public ProjectsController(ILogger<ProjectsController> logger)
        {
            _logger = logger;
            _logger.LogInformation("CREATE");
        }

        [HttpGet]
        public IEnumerable<Project> Get()
        {
            _logger.LogInformation("FETCH");
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new Project
            {
                projectID = rng.Next(1000),

                projectName = rng.Next(20).ToString()

            })
            .ToArray();
        }
    }
}

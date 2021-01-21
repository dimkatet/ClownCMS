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
            using (ApplicationContext db = new ApplicationContext())
            {
                return db.Projects.ToArray();
            }
        }

        [HttpPost]
        public int Post([FromBody] string projectName)
        {
            _logger.LogInformation("POST");
            using (var db = new ApplicationContext())
            {
                db.Projects.Add(new Project
                {
                    ProjectName = projectName
                });
                db.SaveChanges();
            }
            return 1;
        }

        [HttpDelete]
        public int Delete([FromBody] int projectID)
        {
            _logger.LogInformation("POST");
            using (var db = new ApplicationContext())
            {
                var projects = db.Projects.ToList().Where(x => x.ProjectID == projectID);
                if(projects.Count() == 0)
                    return -1;
                db.Projects.Remove(projects.First());
                db.SaveChanges();
            }
            return 1;
        }
    }
}

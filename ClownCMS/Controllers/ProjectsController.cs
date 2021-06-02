using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ClownCMS.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {

        private readonly ILogger<ProjectsController> _logger;
        private int UserId => Int32.Parse(User.Claims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value);
        private ApplicationContext db;
        public ProjectsController(ILogger<ProjectsController> logger, ApplicationContext context)
        {
            db = context;
            _logger = logger;
            _logger.LogInformation("CREATE");
        }

        [HttpGet]
        public IEnumerable<Project> Get()
        {
            _logger.LogInformation("GET");
            return db.Projects.ToArray();
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            _logger.LogInformation("GET DATA");
            var project = db.Projects.Find(id);
            if (project == null)
                return BadRequest();
            return Ok(project.ProjectName);
        }

        [Authorize]
        [HttpPost]
        public IActionResult Post([FromBody] string projectName)
        {
            _logger.LogInformation("POST");
            db.Projects.Add(new Project
            {
                ProjectName = projectName
            });
            db.SaveChanges();
            return Ok();
        }
        [Authorize]
        [HttpDelete]
        public IActionResult Delete([FromBody] int projectID)
        {
            _logger.LogInformation("DELETE");
            var projects = db.Projects.ToList().Where(x => x.ProjectID == projectID);
            if(projects.Count() == 0)
                return BadRequest();
            db.Projects.Remove(projects.First());
            db.SaveChanges();
            return Ok();
        }

        [Authorize]
        [HttpPut]
        public IActionResult Put([FromBody] EditPtojectAtribut atribut)
        {
            _logger.LogInformation("PUT");
            var project = db.Projects.Find(atribut.ProjectId);
            if (project == null)
                return BadRequest();
            project.ProjectName = atribut.ProjectName;
            db.SaveChanges();
            return Ok();
        }

    }

    public class EditPtojectAtribut
    {
        public string ProjectName { get; set; }
        public int ProjectId { get; set; }
    }
}

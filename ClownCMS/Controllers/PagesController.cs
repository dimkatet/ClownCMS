using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace ClownCMS.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PagesController : Controller
    {
        private readonly ILogger<ProjectsController> _logger;

        private ApplicationContext db;
        public PagesController(ILogger<ProjectsController> logger, ApplicationContext context)
        {
            db = context;
            _logger = logger;
            _logger.LogInformation("CREATE");
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            _logger.LogInformation("GET");
            var p = db.Previews.Include(p => p.Page).Where(p=>p.PreviewId == id).First();
            if (p == null)
            {  
                return BadRequest(new { massage = "Page dont exists" });
            }
            return Json(p.Page.Content);
                
        }
        [Authorize]
        [HttpPost]
        public IActionResult Post([FromBody]PageContent _page)
        {
            _logger.LogInformation("POST");
            Page page = db.Previews.Include(p => p.Page).Where(p => p.PreviewId == _page.previewId).First().Page;
            if (page == null)
            {
                return BadRequest(new { massage = "Page dont exists" });
            }
            page.Content = _page.content;
            db.SaveChanges();
            return Ok();
        }

        public class PageContent
        {
            public int previewId { get; set; }
            public string content { get; set; }

        }
    }
}

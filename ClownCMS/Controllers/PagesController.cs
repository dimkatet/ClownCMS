using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ClownCMS.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PagesController : Controller
    {
        private readonly ILogger<ProjectsController> _logger;

        public PagesController(ILogger<ProjectsController> logger)
        {
            _logger = logger;
            _logger.LogInformation("CREATE");
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            _logger.LogInformation("GET");
            using (ApplicationContext db = new ApplicationContext())
            {
                Page p = db.Previews.Include(p => p.Page).Where(p=>p.PreviewId == id).First().Page;
                if (p == null)
                {
                    return BadRequest();
                }
                return Json(p.Content);
                
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody]PageContent _page)
        {
            _logger.LogInformation("POST");
            using (ApplicationContext db = new ApplicationContext())
            {
                Page page = db.Previews.Include(p => p.Page).Where(p => p.PreviewId == _page.previewId).First().Page;
                if (page == null)
                {
                    db.Add(new Page
                    {
                        Content = _page.content
                    });
                    db.SaveChanges();
                    return Ok();
                }
                page.Content = _page.content;
                db.SaveChanges();
            }
            return Ok();
        }

        public class PageContent
        {
            public int previewId { get; set; }
            public string content { get; set; }

        }
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
                Page p = db.Pages.Find(id);
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
                Page page = db.Pages.Find(_page.pageId);
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
            public int pageId { get; set; }
            public string content { get; set; }

        }
    }
}

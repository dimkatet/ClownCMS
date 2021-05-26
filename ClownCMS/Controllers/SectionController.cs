using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace ClownCMS.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class SectionController : ControllerBase
    {
        private readonly ILogger<SectionController> _logger;

        private ApplicationContext db;
        public SectionController(ILogger<SectionController> logger, ApplicationContext context)
        {
            db = context;
            _logger = logger;
            _logger.LogInformation("CREATE");
        }
        
        [HttpPost]
        public IActionResult Post([FromBody] Section section)
        {
            _logger.LogInformation("POST");

            Section sectionChange = db.Sections.Find(section.SectionId);
            if (sectionChange == null)
                return BadRequest();
            sectionChange.SectionName = section.SectionName;
            db.SaveChanges();
            return Ok();
        }

        public class PutSectionAtribut
        {
            public Section Section { get; set; }
            public int MenuItemId { get; set; }
        }

        [HttpPut]
        public IActionResult Put([FromBody] PutSectionAtribut putAtribut)
        {
            _logger.LogInformation("PUT");
            Section sectionValue = new Section() { SectionName = putAtribut.Section.SectionName, MenuItem = db.MenuItems.Find(putAtribut.MenuItemId) };
            db.Sections.Add(sectionValue);
            db.SaveChanges();
            return Ok();
        }
        [HttpDelete]
        public IActionResult Delete([FromBody] Section section)
        {
            _logger.LogInformation("Delete");
            db.Sections.Remove(section);
            db.SaveChanges();
            return Ok();
        }

    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;



namespace ClownCMS.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ILogger<CategoryController> _logger;

        public CategoryController(ILogger<CategoryController> logger)
        {
            _logger = logger;
            _logger.LogInformation("CREATE");
        }

        [HttpPost]
        public IActionResult Post([FromBody] Category category)
        {
            _logger.LogInformation("POST");

            using (ApplicationContext db = new ApplicationContext())
            {
                Category categoryChange = db.Categories.Find(category.CategoryId);
                if (categoryChange == null)
                    return BadRequest();
                categoryChange.CategoryName = category.CategoryName;
                db.SaveChanges();
            }
            return Ok();
        }

        public class PutSectionAtribut
        {
            public Category Category { get; set; }
            public int SectionId { get; set; }
        }

        [HttpPut]
        public IActionResult Put([FromBody] PutSectionAtribut putAtribut)
        {
            _logger.LogInformation("PUT");
            using (ApplicationContext db = new ApplicationContext())
            {
                Category categoryValue = new Category() { CategoryName = putAtribut.Category.CategoryName, Section = db.Sections.Find(putAtribut.SectionId) };
                db.Categories.Add(categoryValue);
                db.SaveChanges();
                return Ok();
            }
        }
        [HttpDelete]
        public IActionResult Delete([FromBody] Category category)
        {
            _logger.LogInformation("Delete");
            using (ApplicationContext db = new ApplicationContext())
            {
                db.Categories.Remove(category);
                db.SaveChanges();
            }
            return Ok();
        }

    }
}

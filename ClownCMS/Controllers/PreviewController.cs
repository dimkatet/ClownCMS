using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;



namespace ClownCMS.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PreviewController : ControllerBase
    {
        private readonly ILogger<PreviewController> _logger;

        public PreviewController(ILogger<PreviewController> logger)
        {
            _logger = logger;
            _logger.LogInformation("CREATE");
        }

        [HttpPost]
        public IActionResult Post([FromBody] Preview preview)
        {
            _logger.LogInformation("POST");

            using (ApplicationContext db = new ApplicationContext())
            {
                Preview PreviewChange = db.Previews.Find(preview.PreviewId);
                if (PreviewChange == null)
                    return BadRequest();
                PreviewChange.PreviewName = preview.PreviewName;
                PreviewChange.PreviewDescription = preview.PreviewDescription;
                PreviewChange.ImageURL = preview.ImageURL;
                db.SaveChanges();
            }
            return Ok();
        }

        public class PutSectionAtribut
        {
            public Preview Preview { get; set; }
            public int CategoryId { get; set; }
        }

        [HttpPut]
        public IActionResult Put([FromBody] PutSectionAtribut putAtribut)
        {
            _logger.LogInformation("PUT");
            using (ApplicationContext db = new ApplicationContext())
            {
                Preview previewValue = new Preview() { 
                    PreviewName = putAtribut.Preview.PreviewName, 
                    PreviewDescription = putAtribut.Preview.PreviewDescription,
                    ImageURL = putAtribut.Preview.ImageURL,
                    Category = db.Categories.Find(putAtribut.CategoryId), 
                    Page = new Page() {
                        Content= "{\"blocks\":[{\"key\":\"eihf9\",\"text\":\"\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}" } 
                };
                db.Previews.Add(previewValue);
                db.SaveChanges();
                return Ok();
            }
        }
        [HttpDelete]
        public IActionResult Delete([FromBody] Preview preview)
        {
            _logger.LogInformation("Delete");
            using (ApplicationContext db = new ApplicationContext())
            {
                db.Previews.Remove(preview);
                db.SaveChanges();
            }
            return Ok();
        }

    }
}

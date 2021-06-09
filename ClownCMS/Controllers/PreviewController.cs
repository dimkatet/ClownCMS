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
    public class PreviewController : ControllerBase
    {
        private readonly ILogger<PreviewController> _logger;

        private ApplicationContext db;
        public PreviewController(ILogger<PreviewController> logger, ApplicationContext context)
        {
            db = context;
            _logger = logger;
            _logger.LogInformation("CREATE");
        }

        [HttpPost]
        public IActionResult Post([FromBody] Preview preview)
        {
            _logger.LogInformation("POST");

            Preview PreviewChange = db.Previews.Find(preview.PreviewId);
            if (PreviewChange == null)
                return BadRequest();
            PreviewChange.PreviewName = preview.PreviewName;
            PreviewChange.PreviewDescription = preview.PreviewDescription;
            PreviewChange.ImageURL = preview.ImageURL;
            db.SaveChanges();
            return Ok();
        }

        public class PutPreviewAtribut
        {
            public Preview Preview { get; set; }
            public int CategoryId { get; set; }
        }

        [HttpPut]
        public IActionResult Put([FromBody] PutPreviewAtribut putAtribut)
        {
            _logger.LogInformation("PUT");
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
        [HttpDelete]
        public IActionResult Delete([FromBody] Preview preview)
        {
            _logger.LogInformation("Delete");
            db.Previews.Remove(preview);
            db.SaveChanges();
            return Ok();
        }

    }
}

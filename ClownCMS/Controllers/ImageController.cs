using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace ClownCMS.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ImageController : Controller
    {
        private readonly ILogger<ImageController> _logger;
        private static Random random = new Random();


        public ImageController(ILogger<ImageController> logger)
        {
            _logger = logger;
            _logger.LogInformation("CREATE");
        }

        [HttpGet("{url}")]
        public IActionResult Get(string URL)
        {
            _logger.LogInformation("GET");
            using (ApplicationContext db = new ApplicationContext())
            {
                var image = db.Images.Where(image => image.URL == URL).FirstOrDefault();
                if (image == null)
                    return BadRequest();
                return File(image.ImageData, image.FileType);
            }
        }

        [HttpPost]
        public string Post(IFormFile data)
        {
            using (ApplicationContext db = new ApplicationContext())
            {
                _logger.LogInformation("POST");
                if (data == null)
                    return "Bad";
                Span<byte> buffer = new Span<byte>(new byte[data.Length]);
                data.OpenReadStream().Read(buffer);

                var URL = RandomString(10);
                while(db.Images.Where(image => image.URL == URL).Count() != 0)
                    URL = RandomString(10);

                db.Add(new Image
                {
                    ImageData = buffer.ToArray(),
                    URL = URL,
                    FileType = data.ContentType
                });
                db.SaveChanges();
                return "/image/" + URL;
            }
        }

        public static string RandomString(int length)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}

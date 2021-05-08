using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ClownCMS.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class NavigationController : ControllerBase
    {
        private readonly ILogger<NavigationController> _logger;

        public NavigationController(ILogger<NavigationController> logger)
        {
            _logger = logger;
            _logger.LogInformation("CREATE");
        }

        [HttpGet("{id}")]
        public IEnumerable<Section> Get(int id)
        {
            _logger.LogInformation("FETCH");
            using (ApplicationContext db = new ApplicationContext())
            {
                return db.Sections.Include(s => s.Categories).ThenInclude(c => c.Previews).Where(s=>s.MenuItemId == id).ToArray();
            }
        }
    }
}
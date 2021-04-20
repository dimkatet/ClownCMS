using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;



namespace ClownCMS.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MenuItemsController : ControllerBase
    {
        private readonly ILogger<MenuItemsController> _logger;

        public MenuItemsController(ILogger<MenuItemsController> logger)
        {
            _logger = logger;
            _logger.LogInformation("CREATE");
        }

        [HttpGet("{id}")]
        public IEnumerable<MenuItem> Get(int id)
        {

            _logger.LogInformation("FETCH");
            using (ApplicationContext db = new ApplicationContext())
            {
                return db.MenuItems.Where(p=>p.ProjectId == id).ToArray();
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] MenuItem menuItem)
        {
            _logger.LogInformation("POST");

            using (ApplicationContext db = new ApplicationContext())
            {
                MenuItem menuItemChange = db.MenuItems.Find(menuItem.MenuItemId);
                if (menuItemChange == null)
                    return BadRequest();
                menuItemChange.MenuItemName = menuItem.MenuItemName;
                menuItemChange.MenuItemType = menuItem.MenuItemType;
                db.SaveChanges();
            }
            return Ok();
        }

        public class PutAtribut
        {
            public MenuItem MenuItem { get; set; }
            public int ProjectId { get; set; }
        }

        [HttpPut]
        public MenuItem Put([FromBody] PutAtribut putAtribut)
        {
            _logger.LogInformation("PUT");
            using (ApplicationContext db = new ApplicationContext())
            {
                MenuItem menuItemValue = new MenuItem() { MenuItemName = putAtribut.MenuItem.MenuItemName, MenuItemType = putAtribut.MenuItem.MenuItemType, Project = db.Projects.Find(putAtribut.ProjectId) };
                db.MenuItems.Add(menuItemValue);
                db.SaveChanges();
                return new MenuItem() { MenuItemId = menuItemValue.MenuItemId, MenuItemName = menuItemValue.MenuItemName, MenuItemType = menuItemValue.MenuItemType };
            }
        }

        [HttpDelete]
        public IActionResult Delete([FromBody] MenuItem menuItem)
        {
            _logger.LogInformation("Delete");
            using (ApplicationContext db = new ApplicationContext())
            {
                db.MenuItems.Remove(menuItem);
                db.SaveChanges();
            }
            return Ok();
        }

    }
}

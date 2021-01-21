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

        [HttpGet]
        public IEnumerable<MenuItem> Get()
        {

            _logger.LogInformation("FETCH");
            using (ApplicationContext db = new ApplicationContext())
            {
                /*if (db.MenuItems.Count() == 0)
                {
                    db.MenuItems.Add(new MenuItem() { MenuItemName = "Hi", MenuItemType = 3 });
                    db.MenuItems.Add(new MenuItem() { MenuItemName = "321", MenuItemType = 2 });
                    db.MenuItems.Add(new MenuItem() { MenuItemName = "Lol", MenuItemType = 0 });
                    db.SaveChanges();
                }
                if (db.Projects.Count() == 0)
                {
                    db.Projects.Add(new Project() { ProjectName = "test1" });
                    db.Projects.Add(new Project() { ProjectName = "test2" });
                    db.Projects.Add(new Project() { ProjectName = "test3" });
                    db.SaveChanges();
                }*/
                return db.MenuItems.ToArray();
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
                db.MenuItems.Update(menuItemChange);
                db.SaveChanges();
            }
            return Ok();
        }

        [HttpPut]
        public MenuItem Put([FromBody] MenuItem menuItem)
        {
            _logger.LogInformation("PUT");
            using (ApplicationContext db = new ApplicationContext())
            {
                MenuItem menuItemValue = new MenuItem() { MenuItemName = menuItem.MenuItemName, MenuItemType = menuItem.MenuItemType };
                db.MenuItems.Add(menuItemValue);
                db.SaveChanges();
                return menuItemValue;
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

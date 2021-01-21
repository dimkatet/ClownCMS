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
                /*if (db.Projects.Count() == 0)
                {
                    Project Project1 = new Project() { ProjectName = "test1" };
                    Project Project2 = new Project() { ProjectName = "test2" };
                    Project Project3 = new Project() { ProjectName = "test3" };
                    db.Projects.Add(Project1);
                    db.Projects.Add(Project2);
                    db.Projects.Add(Project3);

                    MenuItem MenuItem1 = new MenuItem() { MenuItemName = "Hi", MenuItemType = 3, Project = Project1 };
                    MenuItem MenuItem2 = new MenuItem() { MenuItemName = "321", MenuItemType = 2, Project = Project1 };
                    MenuItem MenuItem3 = new MenuItem() { MenuItemName = "Lol", MenuItemType = 0, Project = Project1 };
                    MenuItem MenuItem4 = new MenuItem() { MenuItemName = "512", MenuItemType = 1, Project = Project2 };
                    MenuItem MenuItem5 = new MenuItem() { MenuItemName = "Ltm", MenuItemType = 3, Project = Project2 };
                    MenuItem MenuItem6 = new MenuItem() { MenuItemName = "21wql", MenuItemType = 2, Project = Project3 };
                    MenuItem MenuItem7 = new MenuItem() { MenuItemName = "3gfh", MenuItemType = 0, Project = Project3 };
                    db.MenuItems.Add(MenuItem1);
                    db.MenuItems.Add(MenuItem2);
                    db.MenuItems.Add(MenuItem3);
                    db.MenuItems.Add(MenuItem4);
                    db.MenuItems.Add(MenuItem5);
                    db.MenuItems.Add(MenuItem6);
                    db.MenuItems.Add(MenuItem7);

                    db.SaveChanges();
                }*/

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

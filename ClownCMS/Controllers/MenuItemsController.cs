using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;



namespace ClownCMS.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MenuItemsController : ControllerBase
    {
        private readonly ILogger<MenuItemsController> _logger;

        private List<Section> baseNavigation(int menuType)
        {
            Section section = new Section();
            Category category = new Category();
            Preview preview = new Preview();
            switch(menuType)
            {
                case 0: category.Previews.Add(preview); section.Categories.Add(category); return new List<Section> { section };
                case 1: section.Categories.Add(category); return new List<Section> { section };
                case 2: section.Categories.Add(category); return new List<Section> { section };
                case 3: return new List<Section> { section };
                case 4: return new List<Section> { section };
                case 5: return new List<Section>();
                default: return new List<Section>();
            }
            return new List<Section>();
        }
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
                //menuItemChange.MenuItemType = menuItem.MenuItemType;
                if (menuItemChange.MenuItemType != menuItem.MenuItemType)
                {
                    db.Sections.RemoveRange(db.MenuItems.Include(m => m.Sections).Where(m => m.MenuItemId == menuItem.MenuItemId).First().Sections);
                    menuItemChange.Sections = baseNavigation(menuItem.MenuItemType);
                    menuItemChange.MenuItemType = menuItem.MenuItemType;
                }
                db.SaveChanges();
            }
            return Ok();
        }

        public class PutMenuItemsAtribut
        {
            public MenuItem MenuItem { get; set; }
            public int ProjectId { get; set; }
        }

        [HttpPut]
        public MenuItem Put([FromBody] PutMenuItemsAtribut putAtribut)
        {
            _logger.LogInformation("PUT");
            using (ApplicationContext db = new ApplicationContext())
            {
                MenuItem menuItemValue = new MenuItem() { MenuItemName = putAtribut.MenuItem.MenuItemName, MenuItemType = putAtribut.MenuItem.MenuItemType, Project = db.Projects.Find(putAtribut.ProjectId), Sections = baseNavigation(putAtribut.MenuItem.MenuItemType) };
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

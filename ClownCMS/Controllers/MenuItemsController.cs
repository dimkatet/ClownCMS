using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System;

namespace ClownCMS.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MenuItemsController : ControllerBase
    {
        private readonly ILogger<MenuItemsController> _logger;

        private ApplicationContext db;
        private static string DefaultContent = "{\"blocks\":[{\"key\":\"eihf9\",\"text\":\"\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}";
        private List<Section> baseNavigation(int menuType)
        {
            Section section = new Section();
            Category category = new Category();
            Preview preview = new Preview() { Page = new Page()
            {
                Content = DefaultContent
            }};
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
        public MenuItemsController(ILogger<MenuItemsController> logger, ApplicationContext context)
        {
            db = context;
            _logger = logger;
            _logger.LogInformation("CREATE");
        }

        private int UserId => Int32.Parse(User.Claims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value);

        [HttpGet("{id}")]
        public IEnumerable<MenuItem> Get(int id)
        {
            _logger.LogInformation("FETCH");
            return db.MenuItems.Where(p=>p.ProjectId == id).ToArray();
        }

        [Authorize]
        [HttpPost]
        public IActionResult Post([FromBody] MenuItem menuItem)
        {
            _logger.LogInformation("POST");

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

            return Ok();
        }

        public class PutMenuItemsAtribut
        {
            public MenuItem MenuItem { get; set; }
            public int ProjectId { get; set; }
        }
        [Authorize]
        [HttpPut]
        public MenuItem Put([FromBody] PutMenuItemsAtribut putAtribut)
        {
            _logger.LogInformation("PUT");
            MenuItem menuItemValue = new MenuItem() { 
                MenuItemName = putAtribut.MenuItem.MenuItemName, 
                MenuItemType = putAtribut.MenuItem.MenuItemType, 
                Project = db.Projects.Find(putAtribut.ProjectId), 
                Sections = baseNavigation(putAtribut.MenuItem.MenuItemType) 
            };
            db.MenuItems.Add(menuItemValue);
            db.SaveChanges();
            return menuItemValue;
        }

        [Authorize]
        [HttpDelete]
        public IActionResult Delete([FromBody] MenuItem menuItem)
        {
            _logger.LogInformation("Delete");
            db.MenuItems.Remove(menuItem);
            db.SaveChanges();
            return Ok();
        }

    }
}

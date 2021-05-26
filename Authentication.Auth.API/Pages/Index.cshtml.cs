using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.IO.Compression;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Authentication.Auth.API
{
    public class IndexModel : PageModel
    {
        public string Name { get; set; }
        public void OnGet()
        {
            Name = HttpContext.Session.GetString("Name");
        }

        public IActionResult OnPostExit()
        {
            HttpContext.Session.Clear();
            return RedirectToPage("/");
        }
    }
}

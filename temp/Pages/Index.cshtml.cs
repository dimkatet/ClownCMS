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

        /*public async Task<IActionResult> OnGetDownloadBots()
        {
            Response.ContentType = "application/octet-stream";
            Response.Headers.Add("Content-Disposition", "attachment; filename=\"Bots.zip\"");

            var botsFolderPath = "C:\\VS\\VKR\\ClownCMS\\picture";
            var botFilePaths = Directory.GetFiles(botsFolderPath);
            using (ZipArchive archive = new ZipArchive(Response.BodyWriter.AsStream(), ZipArchiveMode.Create))
            {
                foreach (var botFilePath in botFilePaths)
                {
                    var botFileName = Path.GetFileName(botFilePath);
                    var entry = archive.CreateEntry(botFileName);
                    using (var entryStream = entry.Open())
                    using (var fileStream = System.IO.File.OpenRead(botFilePath))
                    {
                        await fileStream.CopyToAsync(entryStream);
                    }
                }
            }

            return new EmptyResult();
        }*/
    }
}

using Authentication.Common;
using Authentication.Auth.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.IO.Compression;
using System.IO;
using System.Diagnostics;

namespace Authentication.Auth.API
{
    [Route("[controller]")]
    [ApiController]
    public class DownloadController : Controller
    {

        //dtList  = dtList.Where(s => !string.IsNullOrEmpty(s)).Distinct().ToList()
        [HttpPost]
        public async Task DownloadBots([FromForm] string DBType,[FromForm] string Connection)
        {
            if (HttpContext.Session.GetInt32("Id") == null)
                return ;
            
            Response.ContentType = "application/octet-stream";
            Response.Headers.Add("Content-Disposition", "attachment; filename=\"CMS.zip\"");

            string root = GetDir();
            int UserId = HttpContext.Session.GetInt32("Id") ?? default;
            var CMSPath = $"{root}WebSite";
            //set SecretKey and BDConnection
            SettingsProvider.GenerateSetting(CMSPath, UserId, Connection, DBType);
            using (ZipArchive archive = new ZipArchive(Response.BodyWriter.AsStream(), ZipArchiveMode.Create))
            {
                await archive.CreateEntryFromAny(CMSPath);
            }
        }

        private string GetDir()
        {
            List<string> dir = AppContext.BaseDirectory.Split('\\').ToList();
            string path = "";
            foreach (string node in dir)
            {
                if (node == "site")
                {
                    break;
                }
                path += node + "\\";
            }
            return path;
        }

    }
}


/*ProcessStartInfo psi = new ProcessStartInfo();
psi.RedirectStandardOutput = true;
psi.RedirectStandardError = true;
psi.UseShellExecute = false;
psi.CreateNoWindow = true;

psi.FileName = "powershell";
psi.Arguments = $"dotnet publish -c Release -o {path}WebSite";
psi.WorkingDirectory = path + "ClownCMS\\ClownCMS";

Process process = new Process() { StartInfo = psi, EnableRaisingEvents = true };
process.Start();
process.WaitForExit(2*60*1000);*/
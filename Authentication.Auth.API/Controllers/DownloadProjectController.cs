using Authentication.Auth.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Auth.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DownloadProjectController : ControllerBase
    {

        [HttpPost]
        public async Task DownloadBots([FromBody] ProjectDownload project)
        {
            Response.ContentType = "application/octet-stream";
            Response.Headers.Add("Content-Disposition", "attachment; filename=\"Project.zip\"");
            
            string root = GetDir();
            //set SecretKey and BDConnection
            //projectPath + "\\src\\store"
            var projectPath = $"{root}ClientApp";
            ProjectSettingsProvider.GenerateSetting(projectPath + "\\src\\store", true, project.Id, project.URL);
            ProcessStartInfo psi = new ProcessStartInfo("powershell", "npm run build");
            psi.WorkingDirectory = projectPath;
            Process process = new Process() { StartInfo = psi };
            try
            {
                process.Start();
                process.WaitForExit();
            }
            catch(Exception e)
            {
                process.Kill();
            }

            using (ZipArchive archive = new ZipArchive(Response.BodyWriter.AsStream(), ZipArchiveMode.Create))
            {
                await archive.CreateEntryFromAny(projectPath + "\\build");
            }
        }

        private string GetDir()
        {
            List<string> dir = AppContext.BaseDirectory.Split('\\').ToList();
            string path = "";
            foreach (string node in dir)
            {
                if (node == "net5.0")
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
psi.Arguments = "npm run build";
psi.WorkingDirectory = path + "ClownCMS\\ClownCMS\\ClientApp";

Process process = new Process() { StartInfo = psi, EnableRaisingEvents = true };
process.Start();
process.WaitForExit(2*60*1000);*/
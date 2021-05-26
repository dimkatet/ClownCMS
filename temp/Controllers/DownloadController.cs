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

namespace Authentication.Auth.API
{
    [Route("[controller]")]
    [ApiController]
    public class DownloadController : Controller
    {
        public DownloadController()
        {
        }

        private async Task AddZip(ZipArchive archive, string botsFolderPath)
        {
            var botFilePaths = Directory.GetFiles(botsFolderPath);
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
            var botPaths = Directory.GetDirectories(botsFolderPath);
            foreach (var botPath in botPaths)
            {
                await AddZip(archive, botPath);
            }
        }
        [HttpGet]
        public async Task DownloadBots()
        {
            Response.ContentType = "application/octet-stream";
            Response.Headers.Add("Content-Disposition", "attachment; filename=\"CMS.zip\"");

            var botsFolderPath = "C:\\VS\\VKR\\ClownCMS\\ClownCMS";
            using (ZipArchive archive = new ZipArchive(Response.BodyWriter.AsStream(), ZipArchiveMode.Create))
            {
                await archive.CreateEntryFromAny(botsFolderPath);
            }
        }
    }
}

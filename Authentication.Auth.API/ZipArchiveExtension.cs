using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Auth.API
{
    public static class ZipArchiveExtension
    {
        public static async Task CreateEntryFromAny(this ZipArchive archive, string sourceName, string entryName = "")
        {
            var fileName = Path.GetFileName(sourceName);
            if (File.GetAttributes(sourceName).HasFlag(FileAttributes.Directory))
            {
                await archive.CreateEntryFromDirectory(sourceName, Path.Combine(entryName, fileName));
            }
            else
            {
                var entry = archive.CreateEntryFromFile(sourceName, Path.Combine(entryName, fileName), CompressionLevel.Fastest);
                using (var entryStream = entry.Open())
                using (var fileStream = System.IO.File.OpenRead(entryName))
                {
                    await fileStream.CopyToAsync(entryStream);
                }
                
            }
        }

        public static async Task CreateEntryFromDirectory(this ZipArchive archive, string sourceDirName, string entryName = "")
        {
            string[] files = Directory.GetFiles(sourceDirName).Concat(Directory.GetDirectories(sourceDirName)).ToArray();
            foreach (var file in files)
            {
                 archive.CreateEntryFromAny(file, entryName);
            }            
        }
    }
}

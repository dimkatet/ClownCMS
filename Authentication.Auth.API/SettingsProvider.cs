using Authentication.Auth.API.Models;
using Authentication.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Auth.API
{
    public static class SettingsProvider
    {
        private static Item LoadJson(string path)
        {
            Item item;
            using (StreamReader r = new StreamReader(path))
            {
                string json = r.ReadToEnd();
                item = JsonConvert.DeserializeObject<Item>(json);
            }
            return item;
        }
        private static async Task WriteJson(Item item, string path)
        {
            using (StreamWriter file = File.CreateText(path))
            {
                JsonSerializer serializer = new JsonSerializer();
                //serialize object directly into file stream
                serializer.Serialize(file, item);
            }
        }
        public static void GenerateSetting(string root, int userId, string Connection, string DBType)
        {
            Account user = UserSupporting.GetUser(userId);
            Item item = LoadJson($"{root}\\appsettings.json");
            item.ConnectionStrings.DefaultConnection = Connection; 
            item.ConnectionStrings.Subd = DBType;
            item.Auth.Secret = user.Secret;
            WriteJson(item, $"{root}\\appsettings.json");
        }

        private class Item
        {
            public MyLogging Logging { get; set; }
            public AuthOptions Auth { get; set; }
            public MyConnectionStrings ConnectionStrings { get; set; }
            public string AllowedHosts { get; set; }

            public class MyLogging
            {
                public MyLogLevel LogLevel { get; set; }
                public class MyLogLevel
                {
                    public string Default { get; set; }
                    public string Warning { get; set; }
                    public string Information { get; set; }
                }
            }
            public class MyConnectionStrings
            {
                public string DefaultConnection { get; set; }
                public string Subd { get; set; }
            }
        }
    }
}

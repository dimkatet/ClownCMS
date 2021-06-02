using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Auth.API
{
    public class ProjectSettingsProvider
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
        public static void GenerateSetting(string root, bool IsProject, int ProjectId, string URL)
        {
            Item item = LoadJson($"{root}\\project_config.json");
            item.IsProject = IsProject;
            item.Project.ProjectId = ProjectId;
            item.URL = URL;
            WriteJson(item, $"{root}\\project_config.json");
        }

        private class Item
        {
            public bool IsProject { get; set; }
            public MyProject Project { get; set; }
            public string URL { get; set; }
            public class MyProject
            {
                public int ProjectId { get; set; }
            }
        }
    }
}

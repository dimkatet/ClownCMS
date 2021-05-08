using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ClownCMS
{
    public class Section
    {
        public int SectionId { get; set; }
        public string SectionName { get; set; }
        public int MenuItemId { get; set; }

        [JsonIgnore]
        public MenuItem MenuItem { get; set; }
        public List<Category> Categories { get; set; } = new List<Category>();

    }
}

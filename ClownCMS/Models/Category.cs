using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ClownCMS
{
    public class Category
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int SectionId { get; set; }
        [JsonIgnore]
        public Section Section { get; set; }
        public List<Preview> Previews { get; set; } = new List<Preview>();
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ClownCMS
{
    public class Category
    {
        public int CategoryId { get; set; }

        [StringLength(20, MinimumLength = 2, ErrorMessage = "not valid length")]
        public string CategoryName { get; set; }
        public int SectionId { get; set; }
        [JsonIgnore]
        public Section Section { get; set; }
        public List<Preview> Previews { get; set; } = new List<Preview>();
    }
}

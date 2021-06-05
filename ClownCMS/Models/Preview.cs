using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ClownCMS
{
    public class Preview
    {
        public int PreviewId { get; set; }
        [StringLength(20, MinimumLength = 2, ErrorMessage = "not valid length")]
        public string PreviewName { get; set; }
        public string PreviewDescription { get; set; }
        public string ImageURL { get; set; }
        public int CategoryId { get; set; }
        [JsonIgnore]
        public Category Category { get; set; }
        [JsonIgnore]
        public Page Page { get; set; }

        /// page

    }
}

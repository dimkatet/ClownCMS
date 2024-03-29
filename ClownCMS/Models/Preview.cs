﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ClownCMS
{
    public class Preview
    {
        public int PreviewId { get; set; }
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

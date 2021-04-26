using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClownCMS
{
    public class Preview
    {
        public int PreviewId { get; set; }
        public string PreviewName { get; set; }
        public bool PreviewShowMode { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public Page Page { get; set; }

        /// page

    }
}

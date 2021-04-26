using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ClownCMS
{
    public class Page
    {
        public int PageId { get; set; }
        //public int PreviewId { get; set; }

        public string Content { get; set; }
        //public Preview Preview { get; set; }
    }
}

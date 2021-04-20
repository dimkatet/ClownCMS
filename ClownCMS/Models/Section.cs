using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClownCMS
{
    public class Section
    {
        public int SectionId { get; set; }
        public string SectionName { get; set; }
        public bool SectionShow { get; set; }
        public int TopicId { get; set; }
        public Topic Topic { get; set; }
        public List<Category> Categories { get; set; } = new List<Category>();

    }
}

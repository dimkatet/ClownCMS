using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClownCMS
{
    public class ProjectData
    {
        public int ProjectDataId { get; set; }
        public int ProjectId { get; set; }
        public Project project { get; set; }
        public string FooterContent { get; set; }
    }
}

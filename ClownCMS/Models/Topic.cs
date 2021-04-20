using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClownCMS
{
    /// <summary>
    /// Begin of nav sistem 'topic->section->category->preview->page'
    /// Every MenuItem have this structure despite type
    /// 
    /// topic: Technics
    /// section: kitchen office ...
    /// kitchen category: refrigerator teapot ...
    /// previews: different refrigerators
    /// </summary>
    public class Topic
    {
        public int TopicId { get; set; }
        public int MenuItemId { get; set; }
        public MenuItem MenuItem { get; set; }
        public List<Section> Sections { get; set; } = new List<Section>();

    }
}

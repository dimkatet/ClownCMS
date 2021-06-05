using Microsoft.AspNetCore.Builder;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ClownCMS
{

    /// <summary>
    /// Begin of nav sistem 'section->category->preview->page'
    /// Every MenuItem have this structure despite type
    /// </summary>
    public class MenuItem
    {
        public int MenuItemId { get; set; }
        [StringLength(20, MinimumLength = 2, ErrorMessage = "not valid length")]
        public string MenuItemName { get; set; }

        public int MenuItemType { get; set; }

        public int ProjectId { get; set; }
        [JsonIgnore]
        public Project Project { get; set; }

        public List<Section> Sections { get; set; } = new List<Section>();

    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Auth.API.Models
{
    public class Customization
    {
        public string DatabaseName { get; set; }
        public string BackUrl { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClownCMS
{
    public class Image
    {
        public int ImageId { get; set; }

        public byte[] ImageData { get; set; }

        public string URL { get; set; }

        public string FileType { get; set; }
    }
}

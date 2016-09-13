using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace webmanager.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string password { get; set; }
        public string ImgSrc { get; set; }
    }
}
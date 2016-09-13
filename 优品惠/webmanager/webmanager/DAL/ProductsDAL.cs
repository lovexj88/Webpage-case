using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using webmanager.Models;
using System.IO;
using Newtonsoft.Json;

namespace webmanager.DAL
{
    public class ProductsDAL
    {      

        public List<Product> getProductsByJson()
        {
            var userdata = new List<Product>();

            var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"datajson\products.json");
            if (File.Exists(path))
            {
                string str = File.ReadAllText(path);
                userdata = JsonConvert.DeserializeObject<List<Product>>(str);              

            }
            return userdata;
           
        }

        public Product getUser(int id)
        {
            var userList = getProductsByJson();
            var user = userList.FirstOrDefault(s => s.Id == id);
            return user;
        }

    }
   
}
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using webmanager.Models;

namespace webmanager.Controllers
{
    public class Default1Controller : Controller
    {
        Product[] products = new Product[] 
        { 
            new Product { Id = 1, Name = "Tomato Soup", Category = "Groceries", Price = 1 }, 
            new Product { Id = 2, Name = "Yo-yo", Category = "Toys", Price = 3.75M }, 
            new Product { Id = 3, Name = "Hammer", Category = "Hardware", Price = 16.99M } 
        };
        //
        // GET: /Default1/

        public void Index()
        {
            var productssub = products.Skip(2 * (1 - 1)).Take(1);
            var result = JsonConvert.SerializeObject(productssub);
           
            Response.Write("fn(" + result + ")");
        }

    }
}

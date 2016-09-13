using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using webmanager.DAL;
using webmanager.Models;

namespace webmanager.Controllers
{
    public class ProductsController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }
       

        public void GetAllProducts()
        {
            var dal = new ProductsDAL();
            var userdata = JsonConvert.SerializeObject(dal.getProductsByJson());
            Response.Write(userdata);
        }

        public void GetProductsByPage(int pagesize, int pageindex, string callback)
        {
            var dal = new ProductsDAL();
            var products = dal.getProductsByJson();
            var productssub = products.Skip(pagesize * (pageindex - 1)).Take(pagesize);
            var userdata = JsonConvert.SerializeObject(productssub);
            var result = callback + "(" + userdata + ")";
            Response.Write(result);

        }
      
        //public Product GetProductById(int id)
        //{
        //    var product = products.FirstOrDefault((p) => p.Id == id);
        //    if (product == null)
        //    {
        //        throw new HttpResponseException(HttpStatusCode.NotFound);
        //    }
        //    return product;
        //}
        //public IEnumerable<Product> GetProductsByCategory(string category)
        //{
        //    return products.Where(
        //        (p) => string.Equals(p.Category, category,
        //            StringComparison.OrdinalIgnoreCase));
        //}
        //public string GetProductByPage(int pageSize, int pageIndex)
        //{
        //    var productssub = products.Skip(pageSize * (pageIndex - 1)).Take(pageSize);
        //    var result = JsonConvert.SerializeObject(productssub);
        //    return "fn(" + result + ")";
        //}

    }
}

using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using webmanager.DAL;

namespace webmanager.Controllers
{
    public class iDataController : Controller
    {
        //
        // GET: /iData/       

        public void GetIDataAll(string callback)
        {
            var dal = new iDataDAL();
            var products = dal.getall();
            var userdata = JsonConvert.SerializeObject(products);
            if (string.IsNullOrEmpty(callback))
            {
                Response.Write(userdata);
            }
            else
            {
                var result = callback + "(" + userdata + ")";
                Response.Write(result);
            }           

        }
        public void GetIDataByid(string id,string callback)
        {
            var dal = new iDataDAL();
            var product = dal.getDataById(id);
            var userdata = JsonConvert.SerializeObject(product);
            if (string.IsNullOrEmpty(callback))
            {               
                Response.Write(userdata);
            }
            else
            {
                var result = callback + "(" + userdata + ")";
                Response.Write(result);
            }
            
        }

        public void GetDataByiddata(string id, string data, string callback)
        {
            var dal = new iDataDAL();
            var product = dal.insertUser(id, data);
            var userdata = JsonConvert.SerializeObject(product);
            if (string.IsNullOrEmpty(callback))
            {
                Response.Write(userdata);
            }
            else
            {
                var result = callback + "(" + userdata + ")";
                Response.Write(result);
            }

        }
    }
}

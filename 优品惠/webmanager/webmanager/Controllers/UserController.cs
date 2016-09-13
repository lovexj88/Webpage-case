using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using webmanager.DAL;

namespace webmanager.Controllers
{
    public class UserController : Controller
    {
        //
        // GET: /User/

        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public void CheckUserName(string username,string callback)
        {
            UserDAL userDal = new UserDAL();
            var user=userDal.checkname(username);
            var data = JsonConvert.SerializeObject(user);
            if (string.IsNullOrEmpty(callback))
            {
                Response.Write(data);
            }
            else
            {
                var result = callback + "(" + data + ")";
                Response.Write(result);
            }
        }
        [HttpPost]
        public void register(string name, string password, string callback)
        {
            UserDAL userDal = new UserDAL();
            var exist = userDal.checkname(name);
            if (exist<0)
            {
                var result1=userDal.insertUser(name, password);
                var data = JsonConvert.SerializeObject(result1);
                if (string.IsNullOrEmpty(callback))
                {
                    Response.Write(data);
                }
                else
                {
                    var result = callback + "(" + data + ")";
                    Response.Write(result);
                }
            }
            else
            {
                var data = JsonConvert.SerializeObject(-1);
                if (string.IsNullOrEmpty(callback))
                {
                    Response.Write(data);
                }
                else
                {
                    var result = callback + "(" + data + ")";
                    Response.Write(result);
                }
            }
        }

        [HttpPost]
        public void login(string name, string password, string callback)
        {
            UserDAL userDal = new UserDAL();
            var user = userDal.getUser(name);
            try
            {
                var result = 1;
                if (user.password == password)
                {
                    result = 1;
                }
                else
                {
                    result = -1;
                }               
                var data = JsonConvert.SerializeObject(result);
                if (string.IsNullOrEmpty(callback))
                {
                    Response.Write(data);
                }
                else
                {                   
                    Response.Write(callback + "(" + data + ")");
                }
            }
            catch (Exception ex)
            {               
                var data = JsonConvert.SerializeObject(-1);
                if (string.IsNullOrEmpty(callback))
                {
                    Response.Write(data);
                }
                else
                {                   
                    Response.Write(callback + "(" + data + ")");
                }
            }
        }

        [HttpGet]        
        public void CheckUserNameGet(string username, string callback)
        {
            UserDAL userDal = new UserDAL();
            var user = userDal.checkname(username);
            var data = JsonConvert.SerializeObject(user);
            if (string.IsNullOrEmpty(callback))
            {
                Response.Write(data);
            }
            else
            {
                var result = callback + "(" + data + ")";
                Response.Write(result);
            }
        }

        [HttpGet]
        public void registerGet(string name, string password, string callback)
        {
            UserDAL userDal = new UserDAL();
            var exist = userDal.checkname(name);
            if (exist < 0)
            {
                var result1 = userDal.insertUser(name, password);
                var data = JsonConvert.SerializeObject(result1);
                if (string.IsNullOrEmpty(callback))
                {
                    Response.Write(data);
                }
                else
                {
                    var result = callback + "(" + data + ")";
                    Response.Write(result);
                }
            }
            else
            {
                var data2 = JsonConvert.SerializeObject(-1);
                if (string.IsNullOrEmpty(callback))
                {
                    Response.Write(data2);
                }
                else
                {
                    var result = callback + "(" + data2 + ")";
                    Response.Write(result);
                }
            }
        }


        [HttpGet]
        public void getAllUsers(string callback)
        {
            UserDAL userDal = new UserDAL();
            var users = userDal.getAllUsers();
            var data = JsonConvert.SerializeObject(users);
            if (string.IsNullOrEmpty(callback))
            {
                Response.Write(data);
            }
            else
            {
                var result = callback + "(" + data + ")";
                Response.Write(result);
            }
        }

        [HttpGet]
        public void loginGet(string name, string password, string callback)
        {
            UserDAL userDal = new UserDAL();
            var user = userDal.getUser(name);
            try
            {
                var result = 1;
                if (user.password == password)
                {
                    result = 1;
                }
                else
                {
                    result = -1;
                }
                var data = JsonConvert.SerializeObject(result);
                if (string.IsNullOrEmpty(callback))
                {
                    Response.Write(data);
                }
                else
                {
                    Response.Write(callback + "(" + data + ")");
                }
            }
            catch (Exception ex)
            {
                var data = JsonConvert.SerializeObject(-1);
                if (string.IsNullOrEmpty(callback))
                {
                    Response.Write(data);
                }
                else
                {
                    Response.Write(callback + "(" + data + ")");
                }
            }
        }

        [HttpGet]
        public void updatepasswordget(string name, string password,string newpassword, string callback)
        {
            UserDAL userDal = new UserDAL();
            var user = userDal.updatepassword(name, password, newpassword);
            var data = JsonConvert.SerializeObject(user);
            if (string.IsNullOrEmpty(callback))
            {
                Response.Write(data);
            }
            else
            {
                Response.Write(callback + "(" + data + ")");
            }
        }

        [HttpPost]
        public void updatepassword(string name, string password, string newpassword, string callback)
        {
            UserDAL userDal = new UserDAL();
            var user = userDal.updatepassword(name, password, newpassword);
            var data = JsonConvert.SerializeObject(user);
            if (string.IsNullOrEmpty(callback))
            {
                Response.Write(data);
            }
            else
            {
                Response.Write(callback + "(" + data + ")");
            }
        }


        [HttpGet]
        public void deleteuserget(string name, string password, string callback)
        {
            UserDAL userDal = new UserDAL();
            var user = userDal.deletepassword(name, password);
            var data = JsonConvert.SerializeObject(user);
            if (string.IsNullOrEmpty(callback))
            {
                Response.Write(data);
            }
            else
            {
                Response.Write(callback + "(" + data + ")");
            }
        }

        [HttpPost]
        public void deleteuser(string name, string password, string callback)
        {
            UserDAL userDal = new UserDAL();
            var user = userDal.deletepassword(name, password);
            var data = JsonConvert.SerializeObject(user);
            if (string.IsNullOrEmpty(callback))
            {
                Response.Write(data);
            }
            else
            {
                Response.Write(callback + "(" + data + ")");
            }
        }

        


    }
}

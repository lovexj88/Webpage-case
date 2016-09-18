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
    public class UserDAL
    {
        string connectionString = ConfigurationManager.ConnectionStrings["MySQLconnStr"].ConnectionString;
        public List<UserModel> getAllUsers()
        {
            var userdata = new List<UserModel>();

            var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"datajson\user.json");
            if (File.Exists(path))
            {
                string str = File.ReadAllText(path);
                userdata = JsonConvert.DeserializeObject<List<UserModel>>(str);

            }
            return userdata;
        }

        public List<UserModel> getUserByJson()
        {
            var userdata = new List<UserModel>();

            var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"datajson\user.json");
            if (File.Exists(path))
            {
                string str = File.ReadAllText(path);
                userdata = JsonConvert.DeserializeObject<List<UserModel>>(str);              

            }
            return userdata;
           
        }
        public int insertUser(string name,string password)
        {
            var userList = getUserByJson();
            var isExist = userList.Exists(s => s.Name == name);
            if (isExist)
            {
                return -1;
            }
            else
            {
                try
                {

                    UserModel userInfo = new UserModel();
                    userInfo.Id = 1;
                    userInfo.Name = name;
                    userInfo.password = password;
                    userList.Add(userInfo);
                    var userdata = JsonConvert.SerializeObject(userList);
                    var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"datajson\user.json");
                    File.WriteAllText(path, userdata);
                    return 1;
                }
                catch (Exception ex)
                {
                    return  -1;
                }
            }            
        }

        public UserModel getUser(string name)
        {
            var userList = getUserByJson();
            var user = userList.FirstOrDefault(s => s.Name == name);
            return user;
        }
        public int checkname(string name)
        {
            var userList = getUserByJson();
            var user = userList.Exists(s => s.Name == name);
            if (user)
            {
                return 1;
            }
            else
            {
                return -1;
            }
        }

        public int updatepassword(string name,string password,string newpassword)
        {
            try
            {
                var isExist = false;
                List<UserModel> userList = getUserByJson();
                for (var i = 0; i < userList.Count; i++)
                {
                    if (userList[i].Name == name && userList[i].password == password)
                    {
                        userList[i].password = newpassword;
                        isExist = true;
                    }
                }
                if (isExist)
                {
                    var userdata = JsonConvert.SerializeObject(userList);
                    var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"datajson\user.json");
                    File.WriteAllText(path, userdata);
                    return 1;
                }else
                {
                    return -1;
                }
               
            }
            catch (Exception ex)
            {
                return -1;
            }

        }

        public int deletepassword(string name, string password)
        {
            try
            {
                var isExist = false;
                List<UserModel> userList = getUserByJson();
                for (var i = 0; i < userList.Count; i++)
                {
                    if (userList[i].Name == name && userList[i].password == password)
                    {
                        userList.Remove(userList[i]);
                        isExist = true;
                    }
                }
                if (isExist)
                {
                    var userdata = JsonConvert.SerializeObject(userList);
                    var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"datajson\user.json");
                    File.WriteAllText(path, userdata);
                    return 1;
                }
                else
                {
                    return -1;
                }

            }
            catch (Exception ex)
            {
                return -1;
            }

        }


    }
   
}
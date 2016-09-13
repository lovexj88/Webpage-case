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
    public class iDataDAL
    {       

        public List<iData> getall()
        {
            var userdata = new List<iData>();

            var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"datajson\idata.json");
            if (File.Exists(path))
            {
                string str = File.ReadAllText(path);
                userdata = JsonConvert.DeserializeObject<List<iData>>(str);              

            }
            return userdata;
           
        }

        public iData getDataById(string id)
        {
            var list = getall();
            return list.FirstOrDefault(s => s.Id == id);
        }
        public int insertUser(string id, string data)
        {
            var userList = getall();
            var isExist = userList.Exists(s => s.Id == id);
            if (isExist)
            {
                var u = getDataById(id);
                for (var i = 0; i < userList.Count; i++)
                {
                    if (userList[i].Id == id)
                    {
                        userList.Remove(userList[i]);
                        i--;
                    }
                }
            }
            try
            {

                iData userInfo = new iData();
                userInfo.Id = id;
                userInfo.Data = data;
                userList.Add(userInfo);
                var userdata = JsonConvert.SerializeObject(userList);
                var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"datajson\idata.json");
                File.WriteAllText(path, userdata);
                return 1;
            }
            catch (Exception ex)
            {
                return -1;
            }
        }
    }
   
}
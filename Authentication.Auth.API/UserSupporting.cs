using Authentication.Auth.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Auth.API
{
    public static class UserSupporting
    {

        private static Random random = new Random();
        public static Account AuthenticateUser(string Email, string Password)
        {
            using (ApplicationContext db = new ApplicationContext())
            {
                try
                {
                    return db.Accounts.Where(acc => acc.Email == Email && acc.Password == Password).First();
                }
                catch (Exception e)
                {
                    throw e;
                }
            }
        }
        public static Account GetUser(int id)
        {
            using (ApplicationContext db = new ApplicationContext())
            {
                try
                {
                    return db.Accounts.Find(id);
                }
                catch (Exception e)
                {
                    throw e;
                }
            }
        }
        public static string RandomString(int length)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}

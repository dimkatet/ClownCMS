using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Authentication.Auth.API.Models;
using Microsoft.Extensions.Options;
using Authentication.Common;
using System.Web;
using Microsoft.AspNetCore.Http;

namespace Authentication.Auth.API.Pages
{
    public class RegistrationModel : PageModel
    {
        public string Message { get; set; }
        public void OnGet()
        {
            Message = "��������� ����";
        }
        public IActionResult OnPost(Registration reg)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    Account user = new Account() { Email = reg.Email, Password = reg.Password, Name = reg.Name, Secret = UserSupporting.RandomString(45) };
                    db.Accounts.Add(user);
                    db.SaveChanges();
                    HttpContext.Session.SetInt32("Id", user.AccountId); 
                    HttpContext.Session.SetString("Name", user.Name);
                    //Message = $"{jwt.GenerateJWT(user)}, name {user.Name}";
                    return Redirect("/");
                }
            }
            catch (Exception e)
            {
                Message = e.Message;
                return Page();
            }
        }
    }
}

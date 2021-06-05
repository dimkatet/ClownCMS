using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Auth.API.Models
{
    public class ApplicationContext : DbContext
    {
        public DbSet<Account> Accounts { get; set; }

        public ApplicationContext()
        {
            //Database.EnsureDeleted();
            Database.EnsureCreated();
            if(this.Accounts.Count() == 0)
            {
                Account account = new Account() { Email = "admin@gmail.com", Password = "admin", Name = "Admin", Secret = "MyKeyPasswordForClownContentManagementSystem"};
                Accounts.Add(account);
                this.SaveChanges();
            }
            
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=tcp:clowncms.database.windows.net,1433;Initial Catalog=authdb;Persist Security Info=False;User ID=cmsadmin;Password=clown2021-714;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");
        }


    }
}

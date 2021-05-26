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
                Account account = new Account() { Email = "admin@gmail.com", Password = "admin", Name = "Admin" };
                Accounts.Add(account);
                this.SaveChanges();
            }
            
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=authsdb;Trusted_Connection=True;");
        }


    }
}

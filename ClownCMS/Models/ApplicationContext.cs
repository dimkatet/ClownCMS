using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ClownCMS
{
    public class ApplicationContext : DbContext
    {
        public DbSet<Project> Projects { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }

        public ApplicationContext()
        {
            //Database.EnsureDeleted();
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=clowncmsdb;Trusted_Connection=True;");
        }
    }
}

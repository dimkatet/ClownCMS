﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.IO;
namespace ClownCMS
{
    public class ApplicationContext : DbContext
    {
        public DbSet<Project> Projects { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Section> Sections { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Preview> Previews { get; set; }
        public DbSet<Page> Pages { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<ProjectData> ProjectsData { get; set; }

        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        {
            //Database.EnsureDeleted();
            //Drop();
            Database.EnsureCreated();
            /*Fill("dbo.Projects.data.sql", Projects);
            Fill("dbo.MenuItems.data.sql", MenuItems);
            Fill("dbo.Sections.data.sql", Sections);
            Fill("dbo.Categories.data.sql", Categories);
            Fill("dbo.Previews.data.sql", Previews);
            Fill("dbo.Pages.data.sql", Pages);
            Fill("dbo.Images.data.sql", Images);*/
        }

        /*protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=clowncmsdb;Trusted_Connection=True;");
        }*/


        private void Fill<T>(string fileName, DbSet<T> field) where T : class
        {
            string path = Directory.GetCurrentDirectory() + @"\Src\DBScripts\" + fileName;
            string s;
            try
            {
                using (StreamReader sr = File.OpenText(path))
                {
                    s = sr.ReadToEnd();
                }
                if (field.Count() == 0)
                {
                    this.Database.ExecuteSqlRaw(s);
                }
            }
            catch (Exception e)
            {
                ;
            }
        }

        private void Drop()
        {
            string path = Directory.GetCurrentDirectory() + @"\Src\DBScripts\dbo.drop.sql";
            string s;
            try
            {
                using (StreamReader sr = File.OpenText(path))
                {
                    s = sr.ReadToEnd();
                }
                this.Database.ExecuteSqlRaw(s);
            }
            catch (Exception e)
            {
                ;
            }
        }

    }
}

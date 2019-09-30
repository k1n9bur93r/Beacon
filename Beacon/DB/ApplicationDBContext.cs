using Beacon.Models;
using Microsoft.EntityFrameworkCore;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DB
{
    public class ApplicationDBContext : DbContext
    {
        #region
        public DbSet<StoreDataModel> Stores { get; set; }
        public DbSet<GameDataModel> Games { get; set; }
        public DbSet<EventDataModel> Events { get; set; }
        #endregion

        public ApplicationDBContext()
        {
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlServer("Server=localhost;Database=BeaconLocationData;Trusted_Connection=True;MultipleActiveResultSets=true;");
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}

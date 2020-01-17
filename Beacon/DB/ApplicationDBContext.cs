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
            optionsBuilder.UseSqlServer("Server=tcp:beaconfinderdbserver.database.windows.net,1433;Initial Catalog=Beacon_db;Persist Security Info=False;User ID=SallySuAdmin;Password=21istheage2B!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Connection Timeout=30;");
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}

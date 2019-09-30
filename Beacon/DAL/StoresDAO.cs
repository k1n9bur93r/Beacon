using Beacon.DAL;
using DB;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Beacon
{ 
    public class StoresDAO : IStoresDAO
    {

        #region Read
        public List<StoreDataModel> Read()
        {
            List<StoreDataModel> locations = new List<StoreDataModel>();
            //this using statement creates our connection to the database
            using (var context = new ApplicationDBContext())
            {
                context.Database.EnsureCreated();

                if (context.Stores.Any())
                {
                    foreach (var location in context.Stores)
                    {
                        locations.Add(location);
                    }
                }
            }
            return locations;
        }


    #endregion

    #region Insert
        public void Insert (StoreDataModel data)
        {
            using (var context = new ApplicationDBContext())
            {
                context.Database.EnsureCreated();
                context.Stores.Add(data);
            }
        }
        #endregion

        #region Delete
        public void Delete(StoreDataModel data)
        {
            using (var context = new ApplicationDBContext())
            {
                context.Database.EnsureCreated();
                var row = context.Stores.FirstOrDefault(item => item.Id == data.Id);
                row.Deleted = true;
                context.Stores.Update(row);
                context.SaveChanges();
            }
        }

        #endregion

        #region Update

        public void Update(StoreDataModel data)
        {
            using (var context = new ApplicationDBContext())
            {
                context.Database.EnsureCreated();
                var row = context.Stores.FirstOrDefault(item => item.Id == data.Id);
                row.Address = data.Address;
                row.City = data.City;
                row.State = data.State;
                row.Zip = data.Zip;
                row.Name = data.Name;
                context.Stores.Update(row);
                context.SaveChanges();

            }
        }

        #endregion

    }
}

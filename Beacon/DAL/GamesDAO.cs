using Models;
using DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Beacon.DAL
{
    public class GamesDAO : IGamesDAO
    {

        #region Read
        public List<GameDataModel> Read()
        {
            List<GameDataModel> Activites = new List<GameDataModel>();
            //this using statement creates our connection to the database
            using (var context = new ApplicationDBContext())
            {
                context.Database.EnsureCreated();

                if (context.Games.Any())
                {
                    foreach (var Activtiy in context.Games)
                    {
                        Activites.Add(Activtiy);
                    }
                }
            }
            return Activites;
        }

        public GameDataModel ReadSingle(string ID) {
            GameDataModel Activity = new GameDataModel();
            using (var context=new ApplicationDBContext())
            {
                context.Database.EnsureCreated();
                if (ID != String.Empty)
                {
                    Activity = context.Games.Where(a => a.Id == ID).FirstOrDefault();

                }
            }
            return Activity;
        }

        #endregion

        #region Insert
        public void Insert(GameDataModel data)
        {
            using (var context = new ApplicationDBContext())
            {
                context.Database.EnsureCreated();
                context.Games.Add(data);
            }
        }
        #endregion

        #region Delete
        public void Delete(GameDataModel data)
        {
            using (var context = new ApplicationDBContext())
            {
                context.Database.EnsureCreated();
                var row = context.Games.FirstOrDefault(item => item.Id == data.Id);
                row.Deleted = true;
                context.Games.Update(row);
                context.SaveChanges();
            }
        }

        #endregion

        #region Update

        public void Update(GameDataModel data)
        {
            using (var context = new ApplicationDBContext())
            {
                context.Database.EnsureCreated();
                var row = context.Games.FirstOrDefault(item => item.Id == data.Id);
                row.GameName = data.GameName;
                row.GameType = data.GameType;
                context.Games.Update(row);
                context.SaveChanges();

            }
        }

        #endregion

    }
}

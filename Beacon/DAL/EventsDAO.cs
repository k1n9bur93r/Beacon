using DB;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Beacon.DAL
{
    public class EventsDAO : IEventsDAO
    {

        #region Read
        public EventDataModel ReadEvent(string id)
        {
            EventDataModel Meetups = new EventDataModel();
            //this using statement creates our connection to the database
            using (var context = new ApplicationDBContext())
            {
                context.Database.EnsureCreated();
                if (id != String.Empty)
                {
                  Meetups = context.Events.Where(a => a.Id == id).FirstOrDefault();

                }
            }
              
            return Meetups;
        }

        public List<EventDataModel> ReadAll()
        {
            List<EventDataModel> Meetups = new List<EventDataModel>();
            //this using statement creates our connection to the database
            using (var context = new ApplicationDBContext())
            {
                context.Database.EnsureCreated();
                if (context.Events.Any())
                {
                    foreach (var Meetup in context.Events)
                    {
                        Meetups.Add(Meetup);
                    }
                }
            }

            return Meetups;
        }

        public List<EventDataModel> ReadByStore(string id)
        {
            List<EventDataModel> Meetups = new List<EventDataModel>();
            //this using statement creates our connection to the database
            using (var context = new ApplicationDBContext())
            {
                context.Database.EnsureCreated();
                Meetups = context.Events.Where(a => a.StoreFK == id).Where(b => b.Deleted != true).ToList();
            }
            return Meetups;
        }

        #endregion

        #region Insert
        public void Insert(EventDataModel data)
        {
            using (var context = new ApplicationDBContext())
            {
                context.Database.EnsureCreated();
                context.Events.Add(data);
                context.SaveChanges();
            }
        }
        #endregion

        #region Delete
        public void Delete(EventDataModel data)
        {
            using (var context = new ApplicationDBContext())
            {
                context.Database.EnsureCreated();
                var row = context.Events.FirstOrDefault(item => item.Id == data.Id);
                row.Deleted = true;
                context.Events.Update(row);
                context.SaveChanges();
            }
        }

        #endregion

        #region Update

        public void Update(EventDataModel data)
        {
            using (var context = new ApplicationDBContext())
            {
                context.Database.EnsureCreated();
                var row = context.Events.FirstOrDefault(item => item.Id == data.Id);
                row.EventName = data.EventName;
                row.Participants = data.Participants;
                row.StartDate = data.StartDate;
                row.EndDate = data.EndDate;
                context.SaveChanges();

            }
        }

        #endregion
       
    }
}

using Beacon.Models;
using DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Beacon.DAL
{
    public class EventsDAO : IEventsDAO
    {

        #region Read
        public List<EventDataModel> Read()
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


        #endregion

        #region Insert
        public void Insert(EventDataModel data)
        {
            using (var context = new ApplicationDBContext())
            {
                context.Database.EnsureCreated();
                context.Events.Add(data);
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
                row.Deleted = 1;
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
                row.EventType = data.EventType;
                row.Participants = data.Participants;
                row.StartDate = data.StartDate;
                row.EndDate = data.EndDate;
                context.SaveChanges();

            }
        }

        #endregion

    }
}

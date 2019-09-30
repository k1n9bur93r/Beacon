using Beacon.DAL;
using Beacon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Beacon.BL
{
    public class EventsBO
    {
        private readonly IEventsDAO _EventsDAO;

        EventsBO()
        {
            _EventsDAO = new EventsDAO();
        }

        #region Read
        private List<EventDataModel> Read()
        {
            return _EventsDAO.Read();
        }
        #endregion

        #region Insert
        private void Insert(EventDataModel data)
        {
            _EventsDAO.Insert(data);
        }
        #endregion

        #region Delete
        private void Delete(EventDataModel data)
        {
            _EventsDAO.Delete(data);
        }
        #endregion

        #region Update
        private void Update(EventDataModel data)
        {
            _EventsDAO.Update(data);
        }
        #endregion
    }
}

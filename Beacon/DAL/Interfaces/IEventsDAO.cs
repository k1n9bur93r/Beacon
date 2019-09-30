
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Beacon.DAL
{
    interface IEventsDAO
    {

        void Delete(EventDataModel data);
        List<EventDataModel> ReadAll();
        List<EventDataModel> ReadByStore(string Id);
        void Insert(EventDataModel data);
        void Update(EventDataModel data);
    }
}

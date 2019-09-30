using Beacon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Beacon.DAL
{
    interface IEventsDAO
    {

        void Delete(EventDataModel data);
        List<EventDataModel> Read();
        void Insert(EventDataModel data);
        void Update(EventDataModel data);
    }
}

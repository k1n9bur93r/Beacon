using System;
using System.Collections.Generic;
using System.Linq;
using Models;
using System.Threading.Tasks;

namespace Beacon.DAL
{
   public interface IStoresDAO
    {
        List<StoreDataModel> Read();
        void Delete(StoreDataModel data);
        void Insert(StoreDataModel data);
        void Update(StoreDataModel data);

    }
}

using Beacon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Beacon.DAL
{
    public interface IGamesDAO
    {
        void Delete(GameDataModel data);
        List<GameDataModel> Read();
        void Insert(GameDataModel data);
        void Update(GameDataModel data);

    }
}

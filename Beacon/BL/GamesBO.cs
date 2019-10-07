using Beacon.DAL;
using Beacon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Beacon.BL
{
    public class GamesBO
    {
        private readonly IGamesDAO _GamesDAO;

        public GamesBO()
        {
            _GamesDAO = new GamesDAO();
        }

        #region Read
        public List<GameDataModel> Read()
        {
            return _GamesDAO.Read();
        }
        #endregion

        #region Insert
        private void Insert(GameDataModel data)
        {
            _GamesDAO.Insert(data);
        }
        #endregion

        #region Delete
        private void Delete(GameDataModel data)
        {
            _GamesDAO.Delete(data);
        }
        #endregion

        #region Update
        private void Update(GameDataModel data)
        {
            _GamesDAO.Update(data);
        }
        #endregion
    }
}

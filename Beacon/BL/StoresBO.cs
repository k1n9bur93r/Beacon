using System;
using System.Collections.Generic;
using System.Linq;
using Models;
using System.Threading.Tasks;
using Beacon.DAL;

namespace Beacon
{
    public class StoresBO
    {
        private readonly IStoresDAO _StoresDAO;

       public StoresBO() {
            _StoresDAO = new StoresDAO();
        }

        #region Read
        public List<StoreDataModel> Read()
        {
            return _StoresDAO.Read();
        }
        #endregion

        #region Insert
        private void  Insert(StoreDataModel data)
        {
            _StoresDAO.Insert(data);
        }
        #endregion

        #region Delete
        private void Delete(StoreDataModel data)
        {
            _StoresDAO.Delete(data);
        }
        #endregion

        #region Update
        private void Update(StoreDataModel data)
        {
            _StoresDAO.Update(data);
        }
        #endregion

        public void CreateNewStore(StoreDataModel newStore)
        {
            newStore.Id = Guid.NewGuid().ToString();
            this.Insert(newStore);
        }
    }
}

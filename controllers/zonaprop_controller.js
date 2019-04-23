const {DBClient,DBPromisseDriver} = require('../dao/mongo_client');
const READER_U = process.env.READER_U || "";
const READER_P = process.env.READER_P || "";

module.exports.ZonapropController = {
    ZonapropRapperShort: () => {
        return {_id:1,title:1,price:1}
    },
    GetShortElementsByOffset: (req,res) => {
        let offset = req.query.offset?req.query.offset:0;
        let newClient = new DBClient("properties","title",READER_U,READER_P,"ds141454.mlab.com","41454","comparadoronline");
        DBPromisseDriver.GetShortElementsByOffset(newClient,res,parseInt(offset));
    },
    GetElementById: (req,res) => {
        let id = req.params.id;
        let newClient = new DBClient("properties","_id",READER_U,READER_P,"ds141454.mlab.com","41454","comparadoronline");
        DBPromisseDriver.GetElementById(newClient,res,id)
    }
}
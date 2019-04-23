const {DBClient,DBPromisseDriver} = require('../dao/mongo_client');
const {ZonapropController} = require('../controllers/zonaprop_controller.js');
const {ProperatiController} = require('../controllers/properati_controller.js');
const util = require('util');
const mongodb = require('mongodb');
const READER_U = process.env.READER_U || "";
const READER_P = process.env.READER_P || "";
let rapperFields = {
    zonaprop:ZonapropController.ZonapropRapperShort(),
    properati:ProperatiController.ProperatiRapperShort(),
    defaultFields: {_id:1,title:1,inmobiliaria:1}
};
let GetParams = req => {
    return {
        id: req.params.id,
        inmobiliaria: req.params.inmobiliaria
    };
};

module.exports.RapperController = {
    GetShortCollectionInmo: (req,res)=>{
        let {inmobiliaria} = GetParams(req);
        let fields = rapperFields[inmobiliaria]; 
        fields = null       
        if (fields == null || fields == undefined) fields = {};
        let newClient = new DBClient("properties","title",READER_U,READER_P,"ds141454.mlab.com","41454","comparadoronline");
        DBPromisseDriver.GetShortElementsByQueryParamAndOffsetRapper(newClient,res,{inmobiliaria},req.query.offset?req.query.offset:0,fields);
        console.log(util.format('[function: GetShortCollectionInmo][status: ok] [inmo: %s]', inmobiliaria))
    },
    GetCollectionInmoById:(req,res) => {
        let {inmobiliaria,id} = GetParams(req);
        let newClient = new DBClient("properties","title",READER_U,READER_P,"ds141454.mlab.com","41454","comparadoronline");
        DBPromisseDriver.GetShortElementsByQueryParamAndOffsetRapper(newClient,res,{_id:id,inmobiliaria},req.query.offset?req.query.offset:0,{});
        console.log(util.format('[function: GetCollectionInmoById][status: ok] [id: %s] [inmo: %s]', id, inmobiliaria))
    },
    GetCollection:(req,res) => {  
        let newClient = new DBClient("properties","title",READER_U,READER_P,"ds141454.mlab.com","41454","comparadoronline");
        DBPromisseDriver.GetShortElementsByQueryParamAndOffsetRapper(newClient,res,{},req.query.offset?req.query.offset:0,null);
        console.log('[function: GetCollection][status: ok]')
    }
};


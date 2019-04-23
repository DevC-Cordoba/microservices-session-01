const {DBClient,DBPromisseDriver} = require('../dao/mongo_client');
const {ZonapropController} = require('../controllers/zonaprop_controller.js');
const {ProperatiController} = require('../controllers/properati_controller.js');
const util = require('util');
const mongodb = require('mongodb');
const request = require('request');
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
        checkSiteByID(inmobiliaria,function(response) {
            if (response.statusCode == 200){
                let fields = rapperFields[inmobiliaria]; 
                fields = null       
                if (fields == null || fields == undefined) fields = {};
                let newClient = new DBClient("properties","title",READER_U,READER_P,"ds141454.mlab.com","41454","comparadoronline");
                DBPromisseDriver.GetShortElementsByQueryParamAndOffsetRapper(newClient,res,{inmobiliaria},req.query.offset?req.query.offset:0,fields);
                console.log(util.format('[function: GetShortCollectionInmo][status: ok] [inmo: %s]', inmobiliaria))
            }else{
                console.log(util.format('[function: GetShortCollectionInmo][status: not_found] [inmo: %s]', inmobiliaria))
                res.json({status:"404"})
            }
         })
        // request
        // .get('http://exampleapi.juanemmanueldiaz.com:8080/sites/'+inmobiliaria)
        // .on('response', )
        
    },
    GetCollectionInmoById:(req,res) => {
        let {inmobiliaria,id} = GetParams(req);
        checkSiteByID(inmobiliaria,function(response) {
            if (response.statusCode == 200){
                let newClient = new DBClient("properties","title",READER_U,READER_P,"ds141454.mlab.com","41454","comparadoronline");
                DBPromisseDriver.GetShortElementsByQueryParamAndOffsetRapper(newClient,res,{_id:id,inmobiliaria},req.query.offset?req.query.offset:0,{});
                console.log(util.format('[function: GetCollectionInmoById][status: ok] [id: %s] [inmo: %s]', id, inmobiliaria))
            }else{
                console.log(util.format('[function: GetCollectionInmoById][status: not_found] [id: %s] [inmo: %s]', id, inmobiliaria))
                res.json({status:"404"})
            }
        })
        
    },
    GetCollection:(req,res) => {  
        let newClient = new DBClient("properties","title",READER_U,READER_P,"ds141454.mlab.com","41454","comparadoronline");
        DBPromisseDriver.GetShortElementsByQueryParamAndOffsetRapper(newClient,res,{},req.query.offset?req.query.offset:0,null);
        console.log('[function: GetCollection][status: ok]')
    }
};

function checkSiteByID(siteID,callback) {
    request
        .get('http://exampleapi.juanemmanueldiaz.com:8080/sites/'+siteID)
        .on('response', function(response) {
            callback(response)
        })
}

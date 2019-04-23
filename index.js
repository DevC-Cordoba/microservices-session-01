let express = require("express");
const {RapperController} = require('./controllers/rapper_controller.js');
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3080;

express()
    .use(bodyParser.urlencoded({extended: false}))
    .use(bodyParser.json({limit: '50mb', extended: true}))
    .use(bodyParser.urlencoded({limit: '50mb', extended: true}))
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/doc', (req,res) => {
            res.sendFile(path.join(__dirname+'/doc/api.html'))
    })
    .get('/ping', (req, res) => res.jsonp({status:"pong"}))
    .get('/inmuebles/:inmobiliaria/:id', (req, res) => {
            RapperController.GetCollectionInmoById(req,res);
    })
    .get('/inmuebles/:inmobiliaria', (req, res) => {
            RapperController.GetShortCollectionInmo(req,res);
    })
    .get('/inmuebles', (req, res) => {
            RapperController.GetCollection(req,res);
    })
    .delete('/inmuebles', (req, res) => {
            RapperController.DeleteAllInmuebles(req,res);
    })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
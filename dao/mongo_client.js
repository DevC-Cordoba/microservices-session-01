const mongodb = require('mongodb');
let thisRef,consultaJson;
class DBClient{
  constructor(elementSchema,keySchema="name",user,pass,host,port,dbName="tecnoscraping"){
    this.elementToNow = elementSchema;
    this.dbName = dbName;
    this.urlMongo = `mongodb://${user}:${pass}@${host}:${port}/${dbName}`;
    this._keySchema=keySchema;
    this._isConnected=false;
    // this._connect();
  }
  Connect(){
    let thisRef = this;
    return new Promise((resolve,reject) => {
        mongodb.MongoClient.connect(thisRef.urlMongo, function(err, client) {
            if(err) return reject(err);
            thisRef._isConnected = true
            thisRef._connection = client;
            console.log("Connection is created!!")
            return resolve()
        })
    });
  }
    Disconnect(){
        return new Promise((resolve,reject) => {
            if(this._isConnected){
                this._isConnected = false;
                this._connection.close(function (err) {
                  if(err) {return reject(err)}
                  return resolve("Connection is closed!!")
                });
              }
        })
   
  }
  deleteCollection(queryParam){
    thisRef = this;
    return new Promise((resolve,reject) => {
        let db = this._connection.db(thisRef.dbName)
    let properties = db.collection(thisRef.elementToNow);
        properties.deleteMany(queryParam, (err, data) => {
        if (err)  reject(err);
        console.log(data.result.n + " document(s) deleted!!");
        resolve(data.result.n);
      });
    });
  }
  dropCollection(){
    thisRef = this;
    return new Promise((resolve,reject) => {
        let db = this._connection.db(thisRef.dbName)
        let properties = db.collection(thisRef.elementToNow);
        properties.drop( (err) => {
            if(err) return reject(err);
            return resolve("properties droped!!")
        })
    })
  }
  getAllElements(){
    thisRef = this;
    return new Promise((resolve,reject) => {
        let db = this._connection.db(thisRef.dbName)
    let properties = db.collection(thisRef.elementToNow);
        properties.find().toArray(function (err, elements) {
            if (err) {
                reject('error',err);
            } else {
                resolve(elements);
            }
        });
    });
  }
  getShortElementsByQueryParamAndOffset(queryParam,offset,fields){
    thisRef = this;
    return new Promise((resolve,reject) => {
        let db = this._connection.db(thisRef.dbName)
    let properties = db.collection(thisRef.elementToNow);
        properties.find(queryParam,{fields}).skip(offset).limit(25).toArray(function (err, elements) {
            if (err) {
                reject('error',err);
            } else {
                resolve(elements);
            }
        });
    });
  }
  getShortElementsByOffset(offset,fields){
    thisRef = this;
    return new Promise((resolve,reject) => {
        let db = this._connection.db(thisRef.dbName)
    let properties = db.collection(thisRef.elementToNow);
        properties.find({},{fields:fields}).skip(offset).limit(25).toArray(function (err, elements) {
            if (err) {
                reject('error',err);
            } else {
                console.log(elements)
                resolve(elements);
            }
        });
    });
  }
  getShortElementsByOffsetQueryParam(offset,queryParam,fields){
    thisRef = this;
    return new Promise((resolve,reject) => {
        let db = this._connection.db(thisRef.dbName)
    let properties = db.collection(thisRef.elementToNow);
        properties.find(queryParam,{fields:fields}).skip(offset).limit(25).toArray(function (err, elements) {
            if (err) {
                reject('error',err);
            } else {
                console.log(elements)
                resolve(elements);
            }
        });
    });
  }
  getElementsByOffset(offset){
    thisRef = this;
    return new Promise((resolve,reject) => {
        let db = this._connection.db(thisRef.dbName)
    let properties = db.collection(thisRef.elementToNow);
        properties.find().skip(offset).limit(25).toArray(function (err, elements) {
            if (err) {
                reject('error',err);
            } else {
                resolve(elements);
            }
        });
    });
  }
  getElementById(id){
    thisRef = this;
    return new Promise((resolve,reject) => {
        let db = this._connection.db(thisRef.dbName)
        let properties = db.collection(thisRef.elementToNow);
        properties.find(mongodb.ObjectId(id)).sort({ decade: 1 }).toArray(function (err, elements) {
            if (err) {
                reject('error',err);
            } else {
                resolve(elements);
            }
        });
    });
  }
  getElementByKey(keyValue){
    thisRef = this;
    return new Promise((resolve,reject) => {
        consultaJson = {};
        consultaJson[this._keySchema] = keyValue;
        // console.log(consultaJson);
        
        let db = this._connection.db(thisRef.dbName)
    let properties = db.collection(thisRef.elementToNow);
        properties.find(consultaJson).sort({ decade: 1 }).toArray(function (err, elements) {
            if (err) {
                reject('error',err);
            } else {
                console.log(elements);
                
                resolve(elements);
            }
        });
    });
  }

  realSave(id,newValues){
      thisRef=this;
      return new Promise((resolve,reject) => {
        let db = this._connection.db(thisRef.dbName)
        let properties = db.collection(thisRef.elementToNow);
        properties.save({_id:id},newValues, function(err, res) {
            if (err) reject(err);
            resolve(`doc ${id} RealSave successful!!`);
        });
      });
  }
  updateById(id,newvalues){
    thisRef = this;
    return new Promise((resolve,reject) => {
        let db = this._connection.db(thisRef.dbName)
        let properties = db.collection(thisRef.elementToNow);
        properties.updateOne({_id:mongodb.ObjectId(id)},{ $set:  newvalues}, function(err, res) {
            if (err) reject(err);
            resolve(`doc ${id} Update successful!!`);
        });
    })
    
  }

  saveElement(elements){
    thisRef = this;
    return new Promise((resolve,reject) => {
        let db = this._connection.db(thisRef.dbName)
        let properties = db.collection(thisRef.elementToNow);
        properties.insert(elements, function(err, result) {
            if (err)return reject(err);
            return resolve("Insert successful!!")
        })
    })
 }
};

module.exports.DBClient = DBClient;
module.exports.DBPromisseDriver = {
    SaveElement: (newClient,elements) =>{
        newClient.Connect().then(()=>{
            newClient.saveElement(elements).then( msj => {
                console.log(msj);
                
            }).catch( err => {
                console.log(err)
            }).finally(()=> newClient.Disconnect()
            .then(msj => console.log(msj))
            .catch( err => console.log(err)));
        })
    },
    GetShortElementsByOffsetJSON:(newClient,offset,queryParam,fields={_id:1,title:1,price:1})=>{
        return new Promise((resolve,reject)=>{
            newClient.Connect().then(()=>{
                newClient.getShortElementsByOffsetQueryParam(offset,queryParam,fields).then(elements => {
                    resolve(elements);
                }).catch( (msj,err) => {
                    console.log(msj,err);
                    reject({status:"500"})
                }).finally(() => newClient.Disconnect()
                  .then(msj => console.log(msj))
                  .catch( err => {
                      console.log(err);
                      reject({status:"500"});
                    }));
            }).catch( err => {
                console.log("Llego al error",err);
                reject({status:"500"});
            })
        });
    },
    DeleteCollection : (newClient,queryParam) => {
        return new Promise((resolve,reject) => {
            newClient.Connect().then(()=>{
                newClient.deleteCollection(queryParam).then(msj => resolve(msj)).catch( err => {
                    console.log(err);
                    reject(err);
                }).finally(() => newClient.Disconnect()
                  .then(msj => console.log(msj))
                  .catch( err => console.log(err)));
            }).catch( err => console.log(err))  
        });
    },
    DropCollection:newClient => {
        newClient.Connect().then(()=>{
            newClient.dropCollection().then(msj => console.log(msj)).catch( err => {
                console.log(err);
            }).finally(() => newClient.Disconnect()
              .then(msj => console.log(msj))
              .catch( err => console.log(err)));
        }).catch( err => console.log("Llego al error",err))  
    },
    UpdateByKey:(newClient,key,jsonUpdate) => {
        newClient.Connect().then(()=>{
            newClient.realSave(key,jsonUpdate).then( msj => {
                console.log(msj);
                
            }).catch( err => {
                console.log(err)
            }).finally(()=> newClient.Disconnect()
            .then(msj => console.log(msj))
            .catch( err => console.log(err)));
        });
    },
    UpdateById: (newClient,res,inputJson,jsonUpdate) =>{
        newClient.Connect().then(()=>{
            newClient.updateById(inputJson._id,jsonUpdate).then(msj => {
                inputJson.msj = msj
                res.jsonp({inputJson});      
            }).catch( err => {
                console.log(err);
            }).finally(() => newClient.Disconnect()
              .then(msj => console.log(msj))
              .catch( err => console.log(err)));
        }).catch( err => console.log("Llego al error",err))   
    },
    GetElementByTitle: (newClient,title) => {
        newClient.Connect().then(()=>{
            newClient.getElementByKey(title).then(elements => {
                elements.forEach( element => {
                    console.log(element['title'])
                })
            }).catch( (msj,err) => {
                console.log(msj,err);
            }).finally(() => newClient.Disconnect()
              .then(msj => console.log(msj))
              .catch( err => console.log(err)));
        }).catch( err => console.log("Llego al error",err))      
    },
    GetElementById:(newClient,res,id) => {
        newClient.Connect().then(()=>{
            newClient.getElementById(id).then(elements => {
                console.log("llego hasta el get")
                res.jsonp(elements[0])
            }).catch( (msj,err) => {
                console.log(msj,err);
                res.json({status:"500"})
            }).finally(() => newClient.Disconnect()
              .then(msj => console.log(msj))
              .catch( err => {
                  console.log(err);
                  res.jsonp({status:"500"});
                }));
        }).catch( err => {
            console.log("Llego al error",err);
            res.jsonp({status:"500"});
        })     
    },
    GetElementsByOffset:(newClient,res,offset)=>{
        newClient.Connect().then(()=>{
            newClient.getElementsByOffset(offset).then(elements => {
                res.json(elements);
            }).catch( (msj,err) => {
                console.log(msj,err);
                res.json({status:"500"})
            }).finally(() => newClient.Disconnect()
              .then(msj => console.log(msj))
              .catch( err => {
                  console.log(err);
                  res.json({status:"500"});
                }));
        }).catch( err => {
            console.log("Llego al error",err);
            res.json({status:"500"});
        })   
    },
    GetShortByOffsetPromise:(newClient,queryParam,offset,fields) =>{
        return new Promise((resolve,reject) => {
            newClient.Connect().then(()=>{
                newClient.getShortElementsByQueryParamAndOffset(queryParam,offset,fields).then(elements => {
                    resolve(elements);
                }).catch( (msj,err) => {
                    console.log(msj,err);
                    reject({status:"500"})
                }).finally(() => newClient.Disconnect()
                  .then(msj => console.log(msj))
                  .catch( err => {
                      console.log(err);
                      reject({status:"500"});
                    }));
            }).catch( err => {
                console.log(err);
                reject({status:"500"});
            })
        });  
    },
    GetShortElementsByQueryParamAndOffsetRapper:(newClient,res,queryParam,offset,fields)=>{
        newClient.Connect().then(()=>{
            newClient.getShortElementsByQueryParamAndOffset(queryParam,offset,fields).then(documents => {
                res.jsonp(documents);
            }).catch( (msj,err) => {
                console.log(msj,err);
                res.jsonp({status:"500"})
            }).finally(() => newClient.Disconnect()
              .then(msj => console.log(msj))
              .catch( err => {
                  console.log(err);
                  res.jsonp({status:"500"});
                }));
        }).catch( err => {
            console.log("Llego al error",err);
            res.json({status:"500"});
        })   
    },
    GetShortElementsByOffset:(newClient,res,offset,fields={_id:1,title:1,price:1})=>{
        newClient.Connect().then(()=>{
            newClient.getShortElementsByOffset(offset,fields).then(elements => {
                res.jsonp(elements);
            }).catch( (msj,err) => {
                console.log(msj,err);
                res.jsonp({status:"500"})
            }).finally(() => newClient.Disconnect()
              .then(msj => console.log(msj))
              .catch( err => {
                  console.log(err);
                  res.jsonp({status:"500"});
                }));
        }).catch( err => {
            console.log("Llego al error",err);
            res.jsonp({status:"500"});
        })   
    },
    GetAllElements: (newClient) => {
        newClient.Connect().then(()=>{
            newClient.getAllElements().then(elements => {
                elements.forEach( element => {
                    console.log(element)
                })
            }).catch( (msj,err) => {
                console.log(msj,err);
            }).finally(() => newClient.Disconnect()
              .then(msj => console.log(msj))
              .catch( err => console.log(err)));
        }).catch( err => console.log("Llego al error",err))      
    }
};
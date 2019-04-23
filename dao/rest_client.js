const request = require('request');

class RestClient{
    constructor(baseUrl,url){
        this.baseUrl = baseUrl;
    }

    request(url){
        return new Promise((resolve,reject) => {
            request({
                method: 'GET',
                encoding: 'utf-8',
                preambleCRLF: true,
                postambleCRLF: true,
                uri:url
            },(err,res,body) => {
                if(err) reject(err);
                resolve(res,body)
            })
        })
        
    }
};

module.exports.RestClient = RestClient;
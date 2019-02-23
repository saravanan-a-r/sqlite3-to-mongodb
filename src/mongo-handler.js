const MongoClient = require('mongodb').MongoClient;

class MongoHandler {

    constructor(mongoUrl) {
        this.mongoUrl = mongoUrl;
        this.mongoDbName = undefined;
        this.mongodb = undefined;
        this.collectionName = undefined;
    }

    setCollectionName(collectionName) {
        this.collectionName = collectionName;
        return this;
    }

    resetCollectionName() {
        this.collectionName = undefined;
        return this;
    }

    openMongoDb() {
        return new Promise( (resolve, reject) => {
            MongoClient.connect(this.mongoUrl, (err, mongodb) => {
                if(err) {
                    reject(err);
                }
                else {
                    let dbName = this.getDbNameFromUrl();
                    this.mongodb = mongodb.db(dbName);
                    resolve();
                }
            });
        });
    }

    getDbNameFromUrl() {
        let mongoUrl = this.mongoUrl;
        let tokenArray = mongoUrl.split("/");
        let dbName = tokenArray[tokenArray.length - 1];
        this.mongoDbName = dbName;
        return this.mongoDbName;
    }

    createCollection(collectionName) {
        return new Promise( (resolve, reject) => {
            try {
                this.mongodb.createCollection(collectionName, (err, res) => {
                    if(err) {
                        reject(err);
                    }
                    else {
                        resolve(collectionName);
                    }
                });
            }
            catch(err) {
                reject(err);
            }
        });
    }

    /* ---
        insertIntoCollection() will insert the given array of dom into the collection
    --- */ 
    insertIntoCollection(domArray) {
        return new Promise( async (resolve, reject) => {
            try {
                let collectionName = this.collectionName;
                let result = await this.mongodb.collection(collectionName).insertMany(domArray);
                resolve({
                    code : 200,
                    message : "success"
                });
            }
            catch(err) {
                reject(err);
            }
        });
    }

}

module.exports = {
    MongoHandler : MongoHandler
};
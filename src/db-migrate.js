const {SqliteHandler} = require("./sqlite-handler.js");
const {MongoHandler} = require("./mongo-handler.js");
const logManager = require("./log-manager.js");
const fs = require("fs");

class DBMigration {

    constructor(sqlitePath, mongoUrl) {
        this.sqlitePath = sqlitePath;
        this.mongoUrl = mongoUrl;
    }

    setSqlitePath(sqlitePath) {
        this.sqlitePath = sqlitePath;
        return this;
    }

    setMongoUrl(mongoUrl) {
        this.mongoUrl = mongoUrl;
        return this;
    }

    setLogPath(logPath) {
        if(!logPath) {
            logPath = "./migration-log.log";
        }
        logManager.setLogPath(logPath);
        return this;
    }

    migrate() {
        return new Promise( async (resolve, reject) => {
            try {
                logManager.writeLog("Migration initiated");

                let sqlitePath = this.sqlitePath;
                logManager.writeLog("Sqlite path :: " + this.sqlitePath);
                if(!fs.existsSync(sqlitePath)) {
                    throw new Error("The given sqlite path is not valid. Please provide a valid path");
                }

                let mongoUrl = this.mongoUrl;
                logManager.writeLog("Mongo Url path :: " + mongoUrl);

                
                let sqliteHandler = new SqliteHandler(sqlitePath);
                let mongoHandler = new MongoHandler(mongoUrl);

                await sqliteHandler.openSqliteDb();
                logManager.writeLog("Connection initiated with sqlite database");

                await mongoHandler.openMongoDb();
                logManager.writeLog("Connection initiated with mongo database");

                let tableNames = await sqliteHandler.getSqliteTableNames();
                logManager.writeLog("Trying to migrate " + tableNames.length + " sqlite tables");

                for(let i = 0; i<tableNames.length; i++) {
                    let tableName = tableNames[i].name;
                    logManager.writeLog("Migration initiated for the table :: " + tableName);

                    await this.migrateTable(sqliteHandler, mongoHandler, tableName);

                    logManager.writeLog("Migration completed for the table :: " + tableName);
                }

                resolve();
            }
            catch(err) {
                logManager.writeLog("Error in migration", err);
                reject(err);
            }
        });
    }

    migrateTable(sqliteHandler, mongoHandler, tableName) {
        return new Promise( async (resolve, reject) => {
            try {
                let limit = 100, offset = 0;
                let rowCount = sqliteHandler.getRowCount(tableName);
                let queryCount = Math.ceil(rowCount/limit) || 1;
                let collectionName = await mongoHandler.createCollection(tableName);;

                for(let i = 0; i<queryCount; i++) {
                    let tableData = await sqliteHandler.getSqliteTableData(tableName, offset, limit);
                    if(tableData && tableData.length) {
                        await mongoHandler
                            .setCollectionName(collectionName)
                            .insertIntoCollection(tableData);
                        mongoHandler.resetCollectionName();
                    }
                }
                resolve({
                    code : "200",
                    message : "Migrating " + tableName + " completed"
                });
            }
            catch(err) {
                reject(err);
            }
        }); 
    }
}

module.exports = {
    DBMigration : DBMigration
};


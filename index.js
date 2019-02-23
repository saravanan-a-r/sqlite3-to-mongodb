const {DBMigration} = require("./src/db-migrate.js");

(async function() {
    let dbMigration = new DBMigration();
    let mongodb = "mongodb://localhost:27017/mydb"
    let sqlitePath = "./sqlitedb.db";
    await dbMigration
        .setSqlitePath(sqlitePath)
        .setMongoUrl(mongodb)
        .setLogPath("migration_log.log")
        .migrate()
})();
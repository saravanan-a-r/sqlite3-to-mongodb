const sqlite3 = require("sqlite3");

class SqliteHandler {

    constructor(sqlitePath) {
        this.sqlitePath = sqlitePath;
        this.sqlitedb = undefined;
    }

    /* ---
        openSqliteDb will open a handler in read-only mode for the given sqlitePath.
    --- */
    openSqliteDb() {
        return new Promise( (resolve, reject) => {
            let sqlitePath = this.sqlitePath;
            let sqlitedb = new sqlite3.Database(sqlitePath, sqlite3.OPEN_READONLY, (err) => {
                if(err) {
                    reject(err);
                }
                else {
                    this.sqlitedb = sqlitedb;
                    resolve();
                }
            });
        });
    }

    getSqliteTableNames() {
        return new Promise( (resolve, reject) => {
            let sql = "SELECT name FROM sqlite_master WHERE type = ?";
            let params = ["table"];
            this.sqlitedb.all(sql, params, (err, rows) => {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }

    getRowCount(tableName) {
        return new Promise( (resolve, reject) => {
            let sql = "SELECT COUNT(*) AS COUNT FROM ?";
            let params = [tableName];
            this.sqlitedb.run(sql, params, (err, result) => {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(result.COUNT);
                }
            });
        });
    }

    getSqliteTableData(tableName, offset, limit) {
        return new Promise( (resolve, reject) => {
            let sql = "SELECT * FROM " + tableName + " LIMIT ? OFFSET ?";
            let params = [limit, offset];
            this.sqlitedb.all(sql, params, (err, rows) => {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        }); 
    }
}

module.exports = {
    SqliteHandler : SqliteHandler
};
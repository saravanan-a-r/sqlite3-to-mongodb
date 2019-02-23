const fs = require("fs");

class LogManager {

    constructor(logPath) {
        this.logPath = logPath;
    }

    setLogPath(logPath) {
        this.logPath = logPath;
        return this;
    }

    writeLog(log, errorObj) {
        try {
            log = this.formLog(log, errorObj);
            fs.appendFileSync(this.logPath, log);   
        }
        catch(err) {
            console.log("Error while writing log" + this.parseObj(err));
        }
    }

    formLog(log, errorObj) {
        if(errorObj) {
            return log + " :: " + this.parseObj(errorObj) + "\n";
        }
        return log + "\n";
    }

    parseObj(obj) {
        if(!obj) {
            return "";
        }
        if(typeof obj === "object") {
            return JSON.stringify(obj);
        }
        return obj;
    }
}

module.exports = new LogManager();
# Sqlite3-to-mongodb

An utility Node js module which will migrate sqlite3 db to mongo db. For each sqlite table, a collection with the same name as the table name will be created.

# Installation
You can use `npm` to download and install:

> npm install sqlite3-to-mongodb


# API Documentation:


This module built using Builder design pattern. For more information about the Builder design pattern, [click here](https://medium.com/@sararavi14/builder-design-pattern-in-node-js-c942ac7354a9)


```
1) <DBMigrate instance>.setSqlitePath(<sqlite3 db file path>)
```
This method  **setSqlitePath()**  will set the sqlite3 db file path which we are gonna migrate to mongo db.


```
2) <DBMigrate instance>.setMongoUrl(<Mongo db url>)
```
This method will set mongo db url for migration.
eg: mongodb://localhost:27017/mydb


```
3) <DBMigrate instance>.setLogPath(<log path>)
```
This method will set the log path. 
If the given path is not valid, the default log path **./migration-log.log** will be taken. 
If you don't use this function, the logs will get consoled.


```
4) <DBMigrate instance>.migrate()

```
This method will start migration and return a promise.

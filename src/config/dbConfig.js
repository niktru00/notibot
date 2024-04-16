const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const mongoClient = new MongoClient("mongodb://root:password@localhost:27017");
const dbOpen = mongoClient.connect().catch(error => {
        console.log("Can't establish db connection", error);
        process.exit(0);
    }
);

process.on('SIGINT', () => {
    mongoClient.close().then(() => console.log("DB connection closed"));
    process.exit(0);
})

module.exports = {mongoClient, dbOpen};
const {mongoClient} = require("../config/dbConfig");


async function chanelRead(broadcasterId) {
    try {
        const db = mongoClient.db("twitchdb");
        const channelDB = db.collection("channel");
        return await channelDB.findOne({broadcasterId : broadcasterId});
    } catch (err){
        console.log(err);
    }
}
async function chanelSave(broadcasterId, data) {
    try {
        const db = mongoClient.db("twitchdb");
        const channelDB = db.collection("channel");
        await channelDB.replaceOne({broadcasterId: broadcasterId},{broadcasterId: broadcasterId,data : data},{upsert : true})
    } catch (err) {
        console.log(err);
    }
}

module.exports = {chanelSave,chanelRead};
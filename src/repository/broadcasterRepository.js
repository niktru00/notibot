const {mongoClient} = require("../config/dbConfig");
async function saveStatus(broadcasterId, status) {
    try {
        const db = mongoClient.db("twitchdb");
        const channelDB = db.collection("streamStatus");
        return channelDB.findOneAndUpdate({broadcasterId: broadcasterId},{$set: {broadcasterId: broadcasterId,status : status}},{upsert : true})
    } catch (err) {
        console.log(err);
    }
}

async function updateMessageId(broadcasterId, chatId, messageId) {
    try {
        const db = mongoClient.db("twitchdb");
        const channelDB = db.collection("streamStatus");//${variable} tgChat:{$elemMatch: {chatId: chatId}}
        return channelDB.findOneAndUpdate({broadcasterId: broadcasterId, 'tgChat.chatId': chatId}, {$set: {'tgChat.$.activeMessageId': messageId}})
    } catch (err) {
        console.log(err);
    }
}

async function setNullMessageId(broadcasterId) {
    try {
        const db = mongoClient.db("twitchdb");
        const channelDB = db.collection("streamStatus");//${variable} tgChat:{$elemMatch: {chatId: chatId}}
        return channelDB.findOneAndUpdate({broadcasterId: broadcasterId}, {$set: {'tgChat.$[].activeMessageId': '0'}})
    } catch (err) {
        console.log(err);
    }
}
async function read(broadcasterId) {
    try {
        const db = mongoClient.db("twitchdb");
        const channelDB = db.collection("streamStatus");
        return await channelDB.findOne({broadcasterId : broadcasterId});
    } catch (err){
        console.log(err);
    }
}

async function readAll() {
    try {
        const db = mongoClient.db("twitchdb");
        const channelDB = db.collection("streamStatus");
        return await channelDB.find({broadcasterId: {$exists: true}});
    } catch (err){
        console.log(err);
    }
}
module.exports = {read, saveStatus, updateMessageId, setNullMessageId, readAll}
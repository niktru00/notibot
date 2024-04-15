const twitchAPI = require('../api/twitchAPI');
const subscriptionType = require("../config/subscryptionType");

function getTwitchChannelInfo(broadcasterId) {
    return twitchAPI.getTwitchChannelInfo(broadcasterId);
}

function create3Subscriptions(id, broadcasterId) {
    return twitchAPI.createSubscription(id, subscriptionType.streamOnLine, broadcasterId)
        .then(() =>
            twitchAPI.createSubscription(id, subscriptionType.streamOffLine, broadcasterId)
        )
        .then(() =>
            twitchAPI.createSubscription(id, subscriptionType.chanelUpdate, broadcasterId)
        )
}

function createSubscriptions(id, broadcastersArray) {
    if (broadcastersArray.length > 0) {
        let subsPromise = create3Subscriptions(id, broadcastersArray[0].broadcasterId);
        for (let i = 1; i < broadcastersArray.length; i++) {
            subsPromise = subsPromise.then(() => create3Subscriptions(id, broadcastersArray[i].broadcasterId));
        }
    }
}

module.exports = {createSubscriptions, getTwitchChannelInfo};
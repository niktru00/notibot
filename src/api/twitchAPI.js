//const userToken = require('./userToken');
const twitchTokenRepository = require('../repository/twitchTokenRepository');
const broadcaster_user_ID = "1016914812";//707730225
function getTwitchChannelInfo(broadcasterId) {
    const params = new URLSearchParams();
    params.set('broadcaster_id',broadcasterId);//?broadcaster_id=' + broadcasterID
    const headers = new Headers();
    headers.append("Client-Id", process.env.twitch_client_id);
    headers.append("Content-Type", "application/json");
    const requestData = {
        method: 'GET',
        headers: headers
    }
    const getInfo = (token) => {
        headers.set("Authorization", "Bearer " + token);
        return fetch('https://api.twitch.tv/helix/channels?' + params, requestData);
    }
    return doFetch(getInfo).then(response => response.json()).then(body => body.data)
}

function createSubscription(id, subscriptionType, broadcasterId) {
    const headers = new Headers();
    headers.append("Client-Id", process.env.twitch_client_id);
    headers.append("Content-Type", "application/json");
    const body = JSON.stringify({
        type: subscriptionType.type,
        version: subscriptionType.version,
        condition: {
            broadcaster_user_id: broadcasterId
        },
        transport: {
            method: "websocket",
            session_id: id
        }
    })
    const requestData = {
        method: 'POST',
        headers: headers,
        body: body
    }
    const createEventSub = (token) => {
        requestData.headers.set("Authorization", "Bearer " + token);
        return fetch('https://api.twitch.tv/helix/eventsub/subscriptions', requestData);
    };
    return doFetch(createEventSub).then((response) => {
        console.log('Subscription ', subscriptionType.type, ' for broadcaster with id ', broadcasterId, ' ', response.statusText.toLowerCase());
    })
}

function doFetch(fetchFunction) {
    return twitchTokenRepository.read().then(twitchToken => {
        return fetchFunction(twitchToken.access_token)
            .then(response => {
                if (response.status === 401) {
                    console.log("Got 401 on twitch API request")
                    return getRefreshToken(twitchToken)
                        .then(body => saveTokenToDb(body))
                        .then(body => doRequestWithNewToken(fetchFunction, body));
                } else {
                    return response
                }
            })
    });
}

function getRefreshToken(twitchToken) {
    console.log("Getting refresh token")
    let body = new URLSearchParams({
        grant_type: "refresh_token",
        client_secret: process.env.twitch_client_secret,
        refresh_token: twitchToken.refresh_token,
        client_id: process.env.twitch_client_id
    });
    const headers = new Headers();
    headers.append("Client-Id", process.env.twitch_client_id);
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const requestData = {
        method: 'POST',
        headers: headers,
        body: body
    }

    return fetch('https://id.twitch.tv/oauth2/token', requestData) //refresh token
        .then(response => {
            return response.json()
        });
}

function saveTokenToDb(body) {
    console.log("Saving refresh token")
    twitchTokenRepository.save(body)
        .then(() => console.log("New refresh token saved successfully"))
        .catch(err => console.log('Write db error ', err));
    return body;
}

function doRequestWithNewToken(fetchFunction, body) {
    console.log("Requesting with new token")
    return fetchFunction(body.access_token).then(response => {
        console.log("Got response with refreshed token")
        return response;
    })
}

module.exports = {createSubscription, getTwitchChannelInfo};

const WebSocket = require('ws');
const twitchService = require('./service/twitchService');
const messageService = require('./service/messageController');
const {getBroadcasters} = require('./service/broadcasterService');
function startSocket() {
    let eventSocket;
    eventSocket = new WebSocket('wss://eventsub.wss.twitch.tv/ws');
    eventSocket.on('close', (close) => {
        console.log('Close ', close);
    });
    eventSocket.on('open', () => {
        console.log('Socket opened')
    });


    eventSocket.on('message', (message) => {
        const data = JSON.parse(message.toString());
        let {metadata, payload} = data;
        let {message_type, message_timestamp} = metadata; // TODO: implement message id verification
        switch (message_type) {
            case 'session_welcome':
                // create EventSub Subscription
                getBroadcasters().then(arrayOfBroadcasters => {twitchService.createSubscriptions(payload.session.id, arrayOfBroadcasters)})
                break;
            case 'session_keepalive' :
                console.log('Connection alive ', message_timestamp);
                break;
            case 'notification' :
                messageService.processMessage(data);
                console.log(data);
                break;
            default :
                console.log(data);
                break;
        }
    });
}

module.exports = {startSocket};
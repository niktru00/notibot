const broadcasterService = require('./service/broadcasterService');
const telegramService = require("./service/telegramService");
const twitchService = require("./service/twitchService");
const patternService = require("./service/patternService");

/**
 *
 * @param {Object} data
 * @param {Object} data.payload
 * @param {Object} data.payload.subscription
 *
 */
function processMessage(data) {
    if (data.payload !== null) {
        let {payload} = data;
        //retrieve broadcasterInfo from db
        const event = payload.event;
        let broadcasterInfoPromise = broadcasterService.readStatus(event.broadcaster_user_id)

        switch (payload.subscription.type) {

            case 'stream.online' :
                broadcasterInfoPromise
                    .then(broadcasterInfo =>
                        twitchService.getTwitchChannelInfo(event.broadcaster_user_id)
                            .then(data => {

                                const patternData = {
                                    gameName: data[0].game_name,
                                    title: data[0].title,
                                    broadcasterName: event.broadcaster_user_name,
                                    broadcasterId: event.broadcaster_user_id
                                }

                                return {
                                    tgChats: broadcasterInfo['tgChat'].map(chat => ({
                                        chatId: chat['chatId'],
                                        text: patternService.getText(patternData, chat['onlineMessagePattern']),
                                    }))
                                }
                            })
                            .then(data => ({
                                text: data.gameName + '\n' + data.title,
                                tgChats: data.tgChats
                            }))
                            .then(messageData => {
                                return telegramService.sendMessage(messageData)
                            })
                            .then(tgChats => {
                                return broadcasterService.updateMessagesId(event.broadcaster_user_id, tgChats)
                            })
                            .then(() => {
                                return broadcasterService.saveStatus(event.broadcaster_user_id, 'active')
                            })
                    )
                break

            case 'stream.offline' :
                broadcasterInfoPromise
                    .then((broadcasterInfo) => {
                        const patternData = {
                            gameName: '',
                            title: '',
                            broadcasterName: event.broadcaster_user_name,
                            broadcasterId: event.broadcaster_user_id
                        }

                        let messageData = {
                            text: 'broadcaster offline',
                            tgChats: broadcasterInfo['tgChat'].map(chat => ({
                                chatId: chat['chatId'],
                                text: patternService.getText(patternData, chat['offlineMessagePattern']),
                                activeMessageId: chat['activeMessageId']
                            }))
                        }
                        return broadcasterService.saveStatus(event.broadcaster_user_id, 'finished')
                            .then(() => {
                                return telegramService.editMessage(messageData);
                            });
                    })
                    .then(() => {
                    })
                    .then(() => {
                        return broadcasterService.setNullMessageId(event.broadcaster_user_id)
                    })
                break
            case 'channel.update' :
                broadcasterInfoPromise
                    .then(broadcasterInfo => {
                        if (broadcasterInfo.status === 'active') {
                            const patternData = {
                                gameName: event.category_name,
                                title: event.title,
                                broadcasterName: event.broadcaster_user_name,
                                broadcasterId: event.broadcaster_user_id
                            }

                            let messageData = {
                                tgChats: broadcasterInfo['tgChat'].map(chat => ({
                                    chatId: chat['chatId'],
                                    text: patternService.getText(patternData, chat['onlineMessagePattern']),
                                    activeMessageId: chat['activeMessageId']
                                }))
                            }
                            return telegramService.editMessage(messageData);
                        } else {
                            return "";
                        }
                    })
                break
        }
    } else {
        console.log("Payload undefined ", data);
    }
}

module.exports = {processMessage}
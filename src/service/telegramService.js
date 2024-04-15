const telegramAPI = require('../api/telegramAPI');
const telegramBody = {
    chat_id: "@twitch_noti_bot",
    text: ""
}
let getActiveMessageId = function (chat) {
    telegramBody.chat_id = chat.chatId;
    telegramBody.text = chat.text;
    return telegramAPI.sendMessage(telegramBody).then(response => {
        chat.activeMessageId = response["result"]["message_id"];
        return chat;
    })
}

function sendMessage(messageData) {
    let tgChats = messageData.tgChats;
    let actions = tgChats.map(getActiveMessageId);
    let results = Promise.all(actions);
    return results.then(data => {
        return data
    })
}

let forEveryChat = function (chat) {
    telegramBody.chat_id = chat.chatId;
    telegramBody.message_id = chat.activeMessageId;
    telegramBody.text = chat.text;
    return telegramAPI.editMessageText(telegramBody).then(response =>  chat);
}
function editMessage(messageData) {
    let tgChats = messageData.tgChats;
    let actions = tgChats.map(forEveryChat);
    let results = Promise.all(actions);
    return results.then(data => {
        return data
    })

    //telegramBody.message_id = messageId;
    //return telegramAPI.editMessageText(telegramBody);
}

module.exports = {sendMessage, editMessage};
const broadcasterRepository = require('../repository/broadcasterRepository');


async function saveStatus(broadcasterId, status) {
    return broadcasterRepository.saveStatus(broadcasterId, status);
}

async function readStatus(broadcasterId) {
    return broadcasterRepository.read(broadcasterId).then(data => {
        return data
    })
}

//let id = '';
let setActiveMessageId = function (chat) {
    return broadcasterRepository.updateMessageId(this.id, chat.chatId, chat.activeMessageId);
}
async function updateMessagesId(broadcasterId, tgChats){
    let broadcaster = {
        id: broadcasterId
    }
    let actions = tgChats.map(setActiveMessageId,broadcaster);
    let results = Promise.all(actions);
    return results.then(data => {
        return data
    })
}

async function setNullMessageId(broadcasterId) {
    return broadcasterRepository.setNullMessageId(broadcasterId)
}

async function getBroadcasters() {
    return broadcasterRepository.readAll().then(data => {
        return data.toArray()
    })
}
module.exports = {saveStatus, readStatus, updateMessagesId, setNullMessageId, getBroadcasters};
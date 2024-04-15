const telegramHTTP = "https://api.telegram.org/" + process.env.telegram_bot + "/";// chatId in streamStatus.tgChat
const requestData = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}

function editMessageText(messageBody){
    requestData.body =  JSON.stringify(messageBody);
    return fetch(telegramHTTP + "editMessageText", requestData)
        .then(response => {
            return response.json()
        }).then(response => {
        if (response.ok) {
            console.log("Message edit ")
        } else {
            console.log(response)
            console.log("Error on message text editing")
        }
    }).catch(err => {
        console.log(err.message)
    })
}
function sendMessage(messageBody) {
    requestData.body =  JSON.stringify(messageBody);
    return fetch(telegramHTTP + "sendMessage", requestData)
        .then(response => {
            return response.json()
        })
        .then(response => {
        if (response.ok) {
            console.log("Message sent")
            return response
        } else {
            console.log(response)
            console.log("Error on message sending")
            return response
        }
    }).catch(err => {
        console.log(err.message)
        return err
    })
}

module.exports = {sendMessage, editMessageText};
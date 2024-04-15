
function filPattern(value, key) {
  this.text = this.text.replaceAll(key, value)
}
function getText(data, pattern) {
    let patternMap = new Map()
    patternMap.set('$gameName', data.gameName)
    patternMap.set('$title', data.title)
    patternMap.set('$broadcasterName', data.broadcasterName)
    patternMap.set('$broadcasterId', data.broadcasterId)

    let textWrapper = {
        text: pattern
    }
    patternMap.forEach(filPattern, textWrapper)
    return textWrapper.text;
}

module.exports = {getText}
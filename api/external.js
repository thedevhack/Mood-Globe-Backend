
async function getIpCountryCoords(userIp){
    let serviceUrl = "http://ip-api.com/json/" + userIp.toString()
    const userIpInfoResponse = await fetch(serviceUrl)
    const userIpInfo = await userIpInfoResponse.json()
    return userIpInfo
}

module.exports = {
    getIpCountryCoords
}

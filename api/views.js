const handler = require("../api/handler")


async function addUserMood(req, res){
    const {data, status} = await handler.addUserMood(req)
    return res.status(status).json(data)
}


async function getGlobeData(req, res){
    const {data, status} = await handler.getGlobeData()
    return res.status(status).json(data)
}


async function getLatestUserMoods(req, res){
    const {data, status} = await handler.getLatestUserMoods()
    return res.status(status).json(data)
}


module.exports = {
    addUserMood,
    getGlobeData,
    getLatestUserMoods
}

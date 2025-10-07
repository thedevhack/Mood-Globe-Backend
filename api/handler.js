const fs = require("fs");
const path = require("path");
const dbManager = require("./db");
const utils = require("./utils");
const external = require("./external");


const globeDataPath = path.join(__dirname, "files", "globe-data.json");
const globe_data = JSON.parse(fs.readFileSync(globeDataPath, "utf-8"));
const countriesData = globe_data.features;


async function getLatestUserMoods(){
    try {
        const getLatest10UserMoods = await dbManager.getLatest10UserMoods()
        const latest10UserMoodData = utils.constructLatest10UserMoodData(getLatest10UserMoods)
        return { data: latest10UserMoodData, status: 200}
    } catch(err) {
        console.error(err)
        return { data: {errMessage : err.message}, status: 500}
    }
}


async function getGlobeData(){
    try {
        const getAverageMoods = await dbManager.getUserMoodAvg()
        const constructMoodAbgResponse = utils.addCountryAvgMoodColour(countriesData, getAverageMoods)
        return { data: constructMoodAbgResponse, status: 200}
    } catch(err) {
        console.error(err)
        return {data: {errMessage: err.message}, status: 500}
    }
}

async function addUserMood(req){
    try {
        let userMoodData = utils.getReqBody(req);
        let user_mood_value = userMoodData.user_mood_value
        const user_ip = utils.getUserIp(req)
        const userGeoData = external.getIpCountryCoords(user_ip);
        const {lat, lng, countryCode} = utils.getUserLatLonCountry(userGeoData, countriesData)
        await dbManager.insertUserMood(user_ip, user_mood_value, countryCode, lat, lng)
        return { data: {message: "success"}, status: 200}
    } catch(err) {
        console.error(err)
        return {data: {errMessage: err.message}, status: 500}
    }
}


module.exports = {
    getLatestUserMoods,
    getGlobeData,
    addUserMood
}


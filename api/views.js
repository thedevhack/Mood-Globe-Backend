const fs = require("fs");
const geoip = require('geoip-lite');
const dbManager = require("../api/db")

var globe_data = {}

async function loadGlobeData() {
    globe_data = JSON.parse(await fs.readFileSync(__dirname + "/files/globe-data.json", "utf-8"))
}

loadGlobeData();

function getCountryBoundary(country){
    return {
        countryCode: country.properties.ISO_A2,
        countryBounds: country.bbox
    }
}

function getValueColor(value){
    let intValue = parseInt(value)

    switch (intValue) {
        case 0:
            return "#ffffff"
        case -1:
            return "#fff000"
        case -2:
            return "#ff0000"
        case 1:
            return "#00fff0"
        case 2:
            return "#00ff00"
        default:
            return "#fff"
    }
}

function getMood(value){
    let intValue = parseInt(value)

    switch (intValue) {
        case 0:
            return "Neutral"
        case -1:
            return "Sad"
        case -2:
            return "Struggling"
        case 1:
            return "Happy"
        case 2:
            return "Excited"
        default:
            return ""
    }
}


async function addUserMood(req, res){



    const userMoodData = req.body;
    const userIp2 = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    console.log("user ip -> ", userIp2)
    const user_mood_value = userMoodData.user_mood_value
    // console.log(userIp2)
    const geo = geoip.lookup(userIp2);
    // console.log(geo)
    var lat = null
    var lng = null
    if (geo){
        lat = geo.ll[0]
        lng = geo.ll[1]
    }
    if (!lat || !lng){
        return res.status(400).json({"message":"Some error occurred!"})
    }
    var country=null;
    // (globe_data.features).forEach(feature => {
    //     if (lat >= feature.bbox[0] && lat <= feature.bbox[2] && lng >= feature.bbox[1] && lng <= feature.bbox[3]){
    //         country = feature
    //         break;
    //     }
    // })

    for (const feature of globe_data.features) {
        if (lng >= feature.bbox[0] && lng <= feature.bbox[2] && lat >= feature.bbox[1] && lat <= feature.bbox[3])
        {
            country = feature;
            break;
        }
    }

    // console.log(user_mood_value, country)

    const countryCode = country.properties.ISO_A2

    try{
        await dbManager.insertUserMood("27.7.13.52", user_mood_value, countryCode)
    } catch (err){
        console.error(err)
    }

    res.status(200).json({"message":"success"})
}

async function getGlobeData(req, res){
    //1.get globe data

    globe_data = JSON.parse(await fs.readFileSync(__dirname + "/files/globe-data.json", "utf-8"))

    const countries = globe_data['features'];

    // console.log("countries------------------>>>>>>>>>>>>", countries)
    const getAllCountryBounds = countries.map(country => getCountryBoundary(country))

    let getAverageMoodValues = null;
    //2.get latest all country mood values
    try {
        getAverageMoodValues = await dbManager.getUserMoodAvg()
    }catch(err){
        console.error(err)
    }

    //3.update this values mood values in globe data

    getAverageMoodValues.forEach(countryMoodAvg => {
        globe_data.features.forEach(feature => {
            if (feature.properties.ISO_A2 === countryMoodAvg.user_country){
                feature.colour = getValueColor(parseFloat(countryMoodAvg.avg))
            }
        })
    })


    //4.return this data to frontend
    res.status(200).json({globe_data})
}

async function getLatestUserMoods(req, res){
    const latest10UserMoods = {"arcsData":[], "labelsData":[]}
    try {
        const getLatest10UserMoods = await dbManager.getLatest10UserMoods()
        console.log(getLatest10UserMoods)
        var count = 1
        getLatest10UserMoods.forEach(userMood => {
            var geo = geoip.lookup(userMood.user_ip);
            console.log(geo)
            var lat = null
            var lng = null
            if (geo){
                lat = geo.ll[0]
                lng = geo.ll[1]
            }

            latest10UserMoods.arcsData.push({
                "type": "flight",
                "order": count,
                // "from" : "TAS",
                // "to": "ICN",
                // "flightCode": "HY 551",
                // "date": "Feb 15, 2019",
                "status": true,
                "startLat": lat,
                "startLng": lng,
                "endLat": lat,
                "endLng": lng,
                "arcAlt": 0.15,
                "color": getValueColor(userMood.user_mood_value)
            })
            latest10UserMoods.labelsData.push({
                // "text": "FRU",
                "size": 1.0,
                // "country": "Kyrgyzstan",
                "text": getMood(userMood.user_mood_value),
                "lat": lat,
                "lng": lng,
                "color": getValueColor(userMood.user_mood_value)
            })
            // console.log(latest10UserMoods)
            count += 1
        })

    }catch(err){
        console.error(err)
    }
    res.json(latest10UserMoods)

}

module.exports = {
    addUserMood,
    getGlobeData,
    getLatestUserMoods
}

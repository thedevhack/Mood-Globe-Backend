function getReqBody(req){
    return req.body
}


function getValueColor(value) {
    if (value >= -0.5 && value <= 0.5) {
        return "#ffffff";
    } else if (value > -1.5 && value < 0.5) {
        return "#fff000";
    } else if (value <= -1.5) {
        return "#ff0000";
    } else if (value > 0.5 && value <= 1.5) {
        return "#00fff0";
    } else if (value > 1.5) {
        return "#00ff00";
    } else {
        return "#fff";
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


function getCountryBoundary(country){
    return {
        countryCode: country.properties.ISO_A2,
        countryBounds: country.bbox
    }
}


function constructLatest10UserMoodData(getLatest10UserMoods){
    const latest10UserMoods = {
        arcsData: [],
        labelsData: []
    }
    let count = 1
    getLatest10UserMoods.forEach(userMood => {
        let lat = null
        let lng = null
        lat = userMood.user_lat
        lng = userMood.user_lon

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
        count += 1
    })
    return latest10UserMoods
}


function addCountryAvgMoodColour(countriesData, getAverageMoodValues){
    let updatedCountriesData = structuredClone(countriesData)
    getAverageMoodValues.forEach(countryMoodAvg => {
        countriesData.forEach(country => {
            if (country.properties.ISO_A2 === countryMoodAvg.user_country){
                country.colour = getValueColor(parseFloat(countryMoodAvg.avg))
            }
        })
    })
    return updatedCountriesData
}

function getUserIp(user_req){
    let rawIpData = user_req.headers['x-forwarded-for'];
    let userIp = rawIpData ? rawIpData.split(',')[0].trim() : user_req.socket.remoteAddress
    console.log("user ip -> ", user_req.socket.remoteAddress, user_req.headers['x-forwarded-for'])
    return userIp
}


function getUserLatLonCountry(userGeoData, countryData){
    let lat = null;
    let lng = null;
    let countryCode = null;
    let userCountry = null;
    console.log(userGeoData)
    if (userGeoData){
        lat = userGeoData.lat
        lng = userGeoData.lon
    }

    if (!lat || !lng){
        return {
            lat,
            lng,
            countryCode
        }
    }

    for (const country of countryData) {
        if (lng >= country.bbox[0] && lng <= country.bbox[2] && lat >= country.bbox[1] && lat <= country.bbox[3])
        {
            userCountry = country;
            break;
        }
    }

    countryCode = userCountry.properties.ISO_A2
    console.log(lat, lng, countryCode)
    return {
        lat,
        lng,
        countryCode

    }
}


module.exports = {
    constructLatest10UserMoodData,
    addCountryAvgMoodColour,
    getUserIp,
    getCountryBoundary,
    getMood,
    getValueColor,
    getReqBody,
    getUserLatLonCountry
}

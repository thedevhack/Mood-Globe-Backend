const dbManager = require("../api/db")

function removeAllUserMoodsCron(){
    setInterval(async() => {
        const now = new Date();

        // Extract UTC hours and minutes
        const utcHour = now.getUTCHours();
        const utcMinute = now.getUTCMinutes();

        console.log(`Current UTC time: ${utcHour}:${utcMinute}`);
        // Check if it's between 00:00 and 00:59 UTC (i.e., start of a new day)
        if (utcHour === 0 && utcMinute < 60) {
            console.log("Hello World — it's a new UTC day!");
            await dbManager.removeAllGlobeDataCron()
        }
    }, 3300000)
}

module.exports = {
    removeAllUserMoodsCron
}
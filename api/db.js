const { Pool } = require("pg");


//db-config
const myDbPool = new Pool({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT,
    max:20,
    min:5,
    idle:10000,
    acquire:60000,
    ssl: {
        rejectUnauthorized: false // Accept Aiven's certificate
    }
})


async function insertUserMood(user_ip_addr, user_mood_value, user_country, user_lat, user_lon){
    try {
        const query = `insert into userglobe2 (user_ip, user_mood_value, user_country, user_lat, user_lon) values ($1, $2, $3, $4, $5) RETURNING *;`;
        const result= await myDbPool.query(query, [user_ip_addr, user_mood_value, user_country, user_lat, user_lon]);
        // console.log("inserted data id ->", result)
    }catch(error){
        console.error(error)
    }
}


async function getUserMoodAvg(){
    const query = `select user_country, avg(user_mood_value) from userglobe2 group by user_country;`;

    // const moodValue = getMoodValue(mood);
    const result = await myDbPool.query(query);
    const rowsData = result.rows
    return rowsData
}


async function getLatest10UserMoods(){
    const query = `select user_ip, user_mood_value, user_lat, user_lon from userglobe2 order by id desc limit 10;`;

    // const moodValue = getMoodValue(mood);
    const result = await myDbPool.query(query);
    const rowsData = result.rows
    return rowsData
}


async function removeAllGlobeDataCron(){
    const query = `TRUNCATE TABLE userglobe2;;`;
    const result =  await myDbPool.query(query);
}

module.exports = {
    getUserMoodAvg,
    insertUserMood,
    getLatest10UserMoods,
    removeAllGlobeDataCron
}


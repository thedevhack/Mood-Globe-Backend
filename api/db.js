
const { Pool } = require("pg");


//db-config
const myDbPool = new Pool({
    user:"avnadmin",
    host:"pg-2ccde416-papkap59-6f04.c.aivencloud.com",
    database:"testing",
    password:"AVNS_q7-V2yP3oeE6GDOl0Jw",
    port:13818,
    max:20,
    min:5,
    idle:10000,
    acquire:60000,
    ssl: {
        rejectUnauthorized: false // Accept Aiven's certificate
    }
})

async function insertUserMood(user_ip_addr, user_mood_value, user_country){
    try {
        const query = `insert into userglobe2 (user_ip, user_mood_value, user_country) values ($1, $2, $3) RETURNING *;`;


        const result= await myDbPool.query(query, [user_ip_addr, user_mood_value, user_country]);
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
    const query = `select user_ip, user_mood_value from userglobe2 order by id desc limit 10;`;

    // const moodValue = getMoodValue(mood);
    const result = await myDbPool.query(query);
    const rowsData = result.rows
    return rowsData
}

module.exports = {
    getUserMoodAvg,
    insertUserMood,
    getLatest10UserMoods
}


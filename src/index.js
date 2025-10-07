const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const api_router = require("../api/routes")
const cron = require("../api/cron")
const PORT = 3158
const app = express()

require('dotenv').config();

// app.use(cors())

// const allowedOrigins = [process.env.MY_DOMAIN];

app.use(bodyParser.json())

app.get("/health-check", (req, res) => {
    res.status(200).json({"message":"Ok"})
})

// app.use((req, res, next) => {
//     const origin = req.get("origin") || req.get("referer");
//
//     if (origin && allowedOrigins.some(url => origin.startsWith(url))) {
//         return next();
//     }
//
//     console.log("❌ Blocked request from:", origin || "unknown");
//     return res.status(403).json({ message: "Access forbidden" });
// });

// app.use((req, res, next) => {
//     console.log("origin of request", req.get("origin"), req.get("referer"))
//     next()
// })



app.use("/api", api_router)

app.use((req, res, next) => {
    res.status(404).json({"message":"Url not found"})
})

app.listen(PORT, () => {
    console.log("Backend Up and Running \n -------><-------")
    cron.removeAllUserMoodsCron()
})


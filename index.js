const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const api_router = require("../backend/api/routes")
const PORT = 3158
const app = express()

app.use(cors())
app.use(bodyParser.json())


app.get("/health-check", (req, res) => {
    res.status(200).json({"message":"Ok"})
})

app.use("/api", api_router)

app.use((req, res, next) => {
    res.status(404).json({"message":"Url not found"})
})

app.listen(PORT, () => {
    console.log("Backend Up and Running \n -------><-------")
})


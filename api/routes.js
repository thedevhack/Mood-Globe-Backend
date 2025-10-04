const router = require("express").Router();
const views = require("../api/views");

router.post("/addUserMood", views.addUserMood);
router.get("/getGlobeData", views.getGlobeData);
router.get("/getLatestUserMoods", views.getLatestUserMoods);

module.exports = router;

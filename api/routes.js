const router = require("express").Router();
const views = require("../api/views");
const validations = require("../api/validations")

router.post("/addUserMood", validations.validateAddMoodBody, views.addUserMood);
router.get("/getGlobeData", views.getGlobeData);
router.get("/getLatestUserMoods", views.getLatestUserMoods);

module.exports = router;

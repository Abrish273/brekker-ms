const express = require('express')

const { getIdeaProfile, updateIdeaProfile, registerIdeaProfile, reportProfile, hideIdeaProfile,notifTest} = require('../controllers/ideaProfileController');
const { getRecommendations,likeProfile,disLikeProfile,likedProfiles,matchedProfiles, AroundMe} = require('../controllers/recommendationController');
const checkForPlan = require("../middleware/paymentsMiddleware")

const router = express.Router();

//User Idea Profile Routes
router.get("/profile", getIdeaProfile)
router.post("/profile", registerIdeaProfile)
router.put("/profile", updateIdeaProfile)
router.get("/hideIdeaprofile", hideIdeaProfile)

router.get("/recommendations",checkForPlan, getRecommendations)
router.post("/profile/like", likeProfile)
router.post("/profile/dislike", disLikeProfile)
router.get("/liked-profiles", likedProfiles)
router.get("/matches", matchedProfiles)
router.post("/report", reportProfile)
router.get("/aroundme", AroundMe)
router.post("/notifTest", notifTest)


module.exports = router;
const express = require('express')

const { getIdeaProfile, updateIdeaProfile, registerIdeaProfile, reportProfile, hideIdeaProfile} = require('../controllers/ideaProfileController');
const { getRecommendations,likeProfile,disLikeProfile,likedProfiles,matchedProfiles} = require('../controllers/recommendationController');
const checkForPlan = require("../middleware/paymentsMiddleware")

const router = express.Router();

//User Ice Profile Routes
router.get("/profile", getIdeaProfile)
router.post("/profile", registerIdeaProfile)
router.put("/profile", updateIdeaProfile)
router.get("/hideIdeaprofile", hideIdeaProfile)

router.get("/recommendations",checkForPlan, getRecommendations)
router.post("/profile/like", likeProfile)
router.post("/profile/dislike", disLikeProfile)
router.post("/liked-profiles", likedProfiles)
router.post("/matches", matchedProfiles)
router.post("/report", reportProfile)


module.exports = router;
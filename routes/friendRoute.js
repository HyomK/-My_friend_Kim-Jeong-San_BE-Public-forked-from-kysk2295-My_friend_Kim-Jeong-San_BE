const express = require("express");
const accountController = require("../controllers/accountController");
const friendController = require("../controllers/friendController");
const upload = require("../utils/upload");
const router = express.Router();
router.post(
    "/non-membership",
    upload.single("image"),
    friendController.createFriend
);
router.post("/add/non-membership", accountController.addAccount);
router.patch(
    "/profile",
    upload.single("image"),
    friendController.updateProfile
);
router.patch("/account", friendController.updateAccount);
router.delete("/account", friendController.deleteAccount);
module.exports = router;

const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");

// User Registration
router.post("/registerUser", async (req, res) => {
    const { firstName, lastName, email, password, user = "u" } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already taken" });
        }

        const newUser = await UserModel.create({ firstName, lastName, email, password, user });
        res.json(newUser);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;

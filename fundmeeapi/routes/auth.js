const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");

// Register
router.post("/register", async (req, res) => {
    const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password, process.env.PASS_SEC
        ).toString()
    })
    try{
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    }catch (err) {
        res.status(500).json(err)
    }
})


// Login
    router.post("/login", async (req, res) => {
        try {
            const user = await User.findOne({
                email: req.body.email
            })
            !user && res.status(401).json("User not found!")

            const hashedPassword = await CryptoJS.AES.decrypt(
                user.password, 
                process.env.PASS_SEC
            )
            const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
            originalPassword !== req.body.password && res.status(401).json("Incorrect password!")

            const { password, ...others } = user._doc;
            res.status(200).json(others)
        } catch (err) {
            res.status(400).json("Incorect username and/ or password")
        }
    })


module.exports = router;
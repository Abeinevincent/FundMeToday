const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");

// Update a user
router.put("/:_id", async (req, res) => {
    if (req.body.userId === req.params._id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                req.body.password = await CryptoJS.AES.encrypt(req.body.password, process.enc.PASS_SEC);
            } catch (err) {
                res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(
                req.params._id,
                { $set: req.body, }
            )
            res.status(201).json("User has been updated")
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You can only update your account")
    }
})

// delete a user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(201).json("User has been deleted")
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You can only delete your account")
    }
})


// get a user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { createdAt, password, ...others } = user._doc
        res.status(201).json(others)
    } catch (err) {
        res.status(500).json(err)
    }
})

// follow a user
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } })
                await currentUser.updateOne({ $push: { followings: req.params.id } })

                res.status(201).json("User has been followed")
            } else {
                res.status(403).json("You already follow this user")
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }
})


// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } })
                await currentUser.updateOne({ $pull: { followings: req.params.id } })
                
                res.status(201).json("User has beeen unfollowed")
            } else {
                res.status(403).json("You dont follow this user")
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }
})


module.exports = router;
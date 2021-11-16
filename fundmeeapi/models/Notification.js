const mongoose = require("mongoose")

const NotificationSchema = new mongoose.Schema(
    {
        notificationId: {
            type: String
        }
    }
)

module.exports = mongoose.module("Notification", NotificationSchema);
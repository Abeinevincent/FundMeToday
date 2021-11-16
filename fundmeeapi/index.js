const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const morgan = require("multer")

// Routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");
const notificationRoute = require("./routes/notification");
const messageRoute = require("./routes/message");
const conversationRoute = require("./routes/conversation");

dotenv.config()

mongoose
.connect(
    process.env.MONGO_URL,
    { useUnifiedTopology: true, useNewUrlParser: true }
)
.then(() => {
    console.log("MongoDb connection successful!")
})
.catch((err) => {
    console.log(err)
})

// Middleware
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/messages", messageRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/notifications", notificationRoute);


app.listen(5500, () => {
    console.log("Backend server is listening");
})

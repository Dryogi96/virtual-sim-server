const express = require("express")
const http = require("http")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
const { Server } = require("socket.io")

//const connectDB = require("./config/database")
const chatSocket = require("./sockets/chatSocket")

const authRoutes = require("./routes/auth")
const groupRoutes = require("./routes/groups")
const mediaRoutes = require("./routes/media")

const app = express()

/* -----------------------------
   Middleware
------------------------------*/

app.use(cors())
app.use(express.json())

/* -----------------------------
   Database
------------------------------*/

connectDB()

/* -----------------------------
   Static media folder
------------------------------*/

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

/* -----------------------------
   Routes
------------------------------*/

app.use("/auth", authRoutes)
app.use("/groups", groupRoutes)
app.use("/media", mediaRoutes)

/* -----------------------------
   Root Test Route
------------------------------*/

app.get("/", (req, res) => {
    res.send("Virtual SIM Server Running 🚀")
})

/* -----------------------------
   HTTP Server
------------------------------*/

const server = http.createServer(app)

/* -----------------------------
   Socket.IO Server
------------------------------*/

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

/* -----------------------------
   Chat Socket Logic
------------------------------*/

chatSocket(io)

/* -----------------------------
   Start Server
------------------------------*/

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log("🚀 Server running on port " + PORT)
})
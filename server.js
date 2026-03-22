const express = require("express")
const http = require("http")
const cors = require("cors")
const path = require("path")
const { Server } = require("socket.io")

const app = express()

/* -----------------------------
   Middleware
------------------------------*/
app.use(cors())
app.use(express.json())

/* -----------------------------
   Database (FIXED PATH)
------------------------------*/
const connectDB = require("../server/config/database")
connectDB()

/* -----------------------------
   Static uploads
------------------------------*/
app.use("/uploads", express.static(path.join(__dirname, "../server/uploads")))

/* -----------------------------
   Routes (FIXED PATH)
------------------------------*/
const authRoutes = require("../server/routes/auth")
const groupRoutes = require("../server/routes/groups")
const mediaRoutes = require("../server/routes/media")

app.use("/auth", authRoutes)
app.use("/groups", groupRoutes)
app.use("/media", mediaRoutes)

/* -----------------------------
   Root
------------------------------*/
app.get("/", (req, res) => {
    res.send("Virtual SIM Server Running 🚀")
})

/* -----------------------------
   Server
------------------------------*/
const server = http.createServer(app)

/* -----------------------------
   Socket.IO
------------------------------*/
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

/* -----------------------------
   Chat Socket (FIXED PATH)
------------------------------*/
const chatSocket = require("../server/sockets/chatSocket")
chatSocket(io)

/* -----------------------------
   Start
------------------------------*/
const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log("🚀 Server running on port " + PORT)
})
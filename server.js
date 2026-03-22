const express = require("express")
const http = require("http")
const cors = require("cors")
const path = require("path")
const { Server } = require("socket.io")

const app = express()

/* ----------------------------- */
app.use(cors())
app.use(express.json())

/* ----------------------------- */
/* DATABASE */
const connectDB = require("./server/config/database")
connectDB()

/* ----------------------------- */
/* STATIC */
app.use("/uploads", express.static(path.join(__dirname, "server/uploads")))

/* ----------------------------- */
/* ROUTES */
const authRoutes = require("./server/routes/auth")
const groupRoutes = require("./server/routes/groups")
const mediaRoutes = require("./server/routes/media")

app.use("/auth", authRoutes)
app.use("/groups", groupRoutes)
app.use("/media", mediaRoutes)

/* ----------------------------- */
app.get("/", (req, res) => {
    res.send("Virtual SIM Server Running 🚀")
})

/* ----------------------------- */
const server = http.createServer(app)

/* ----------------------------- */
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

/* ----------------------------- */
const chatSocket = require("./server/sockets/chatSocket")
chatSocket(io)

/* ----------------------------- */
const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log("🚀 Server running on port " + PORT)
})
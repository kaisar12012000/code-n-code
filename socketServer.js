require("dotenv").config()
const express = require("express")
const { createServer } = require("http")
const { Server } = require("socket.io")
const redis = require("redis")
const cors = require("cors")

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
});
const redisClient = redis.createClient({
    host: process.env.NEXT_PUBLIC_DOMAIN,
    port: 3002,
})

redisClient.connect();

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello from socket server.")
})

io.on("connection", (socket) => {
    console.log("A user has connected.")

    socket.on("code-change", async (data) => {
        console.log("new code: ", data)
        await redisClient.set(data.roomId, data.code, (error, reply) => {
            if (err) console.log(error);
            else console.log(reply);
        })
        io.emit("code-change", data)
    })

    socket.on("disconnect", () => {
        console.log("User diconnected.")
    })
})

app.post("/code", async (req, res) => {
    // console.log(req.body)
    const codeData = await redisClient.get(req.body?.roomId)
    res.status(200).json({codeData})
})

httpServer.listen(3002, () => {
    console.log("Sockect server running at PORT:3002")
})
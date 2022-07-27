require('express-async-errors')
require('dotenv').config()
const path = require("path")

//http service import
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const port = process.env.PORT || 3000
const websocketServer = require("websocket").server
const wsServer = new websocketServer({
    "httpServer": server
})
require('./backend/ws/userSocket').setSocket(wsServer)

//REST api routes
const authRoutes = require('./backend/routes/auth')
const userRoutes = require('./backend/routes/user')

//additional middelware import
const authMiddleware = require('./backend/middleware/authentication')
const errorHandlerMiddleware = require('./backend/middleware/errorHandler')

//db comunication for server startup
const { restoreData } = require('./backend/db/usersManager')

//request trip
app.use("/public", express.static("./public"))
app.use("/res", express.static("./frontend"))
app.use(express.json())

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", authMiddleware, userRoutes)

//page routing is handled on client side (one page app)
app.get("/*", (req, res) => {
    res.sendFile(path.resolve("public", "index.html"))
})
app.use(errorHandlerMiddleware)

//server startup
const start = async () => {
    try {
        restoreData()
        server.listen(port, ["localhost", "192.168.1.69"], console.log('\u001b[' + 34 + 'm' + `Server is listening on port ${port}... ` + '\u001b[0m'))
    } catch (error) {
        console.log('\u001b[' + 31 + 'm' + "ERROR, failed to start the server", error + '\u001b[0m')
    }
}


start()

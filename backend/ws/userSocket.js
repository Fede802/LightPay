let userSocket;
const {socketEventEmitter} = require('../db/usersManager')
const {decodeToken} = require('../utils/auth')

const clients = {};
const connections = {};

const setSocket = (socket)=>{
    userSocket = socket
    eventSetup()
}

const eventSetup = ()=>{
    userSocket.on("request", request => {
        const connection = request.accept(null, request.origin);
        connection.on('close', ()=>{
            let userId = connections[connection]
            delete clients[userId]
            delete connections[connection]
            socketEventEmitter.emit("disconnect", userId)
        })
        connection.on("message", async (message) => {
            const result = JSON.parse(message.utf8Data)
            if(result.method === "connect"){
                let userId = (decodeToken(result.token)).userId
                let prevConnection = clients[userId]
                if(prevConnection)
                    prevConnection.send(JSON.stringify({method: 'disconnect'}))
                    
                clients[userId] = connection
                connections[connection] = userId
                //answer to set params connection on client side
                connection.send(JSON.stringify({method: "connect"}))
            }
            if(result.method === "pay"){
                let userId = (decodeToken(result.token)).userId
                socketEventEmitter.emit("pay", userId, result.dest, result.amt)
            }
        })
        socketEventEmitter.on('message', (message) => {
            let connection = clients[message.id]
            if(connection){
                connection.send(JSON.stringify({method: message.method,response: message.response}))
            }
        })
        
    })
}


module.exports = {setSocket}
const { CustomAPIError } = require('../errors')
const {addUser: saveUser, restoreData: getData, getUserById} = require('./dbManager')
const User = require('../model/User')
const users = new Map()
const usersDict = new Map()
const EventEmitter = require('events')
const socketEventEmitter = new EventEmitter()

socketEventEmitter.on('pay',async (senderId, destName, satAmount)=>{
    let sender = users.get(senderId)
    let destId = usersDict.get(destName.charAt(0)).find(element => element.name === destName).id
    //watch if user is connected, if not connect it
    let dest = users.get(destId)
    if(!dest)
        dest = await connect(getUserById(destId))

    //add and pay invoice, if fails cancel it
    let response = await dest.addInvoice(satAmount)
    try {
        await sender.payInvoice(response.payment_request)
    } catch (error) {
        dest.cancelInvoice(response.r_hash)
    }
})

socketEventEmitter.on('disconnect',(userId)=>{
    users.set(userId, null)
})


//register path
const addUser = async(userData)=>{
    await createUser(userData)
    saveUser(userData)
}

//register path
const createUser = async(userData)=>{
    checkIntegrity(userData)
    //override id field adding the instance of User
    users.set(userData.id,await connect(userData))
    //update dictionary {name,id}
    usersDict.get(userData.name.charAt(0)).push({name: userData.name, id: userData.id})
}

//login path
const connectUser = async (userId)=>{
    let userData = getUserById(userId)
    users.set(userData.id,await connect(userData))
}

//register path
const checkIntegrity = (userData)=>{
    tempArr = usersDict.get(userData.name.charAt(0))
    if(tempArr.find(element => element.name === userData.name))
        throw new CustomAPIError("username already exist")
}

const connect = async (userData)=>{
    let tempUser = new User(userData.ip,userData.port,userData.tls,userData.macaroon)
    await tempUser.createServices()
    tempUser.on('message', (message)=>{
        message.id = userData.id
        socketEventEmitter.emit('message', message)
    })
    return tempUser
}

//login path, check if user exists in the dictionary and retrive psw from db
const checkUser = (username)=>{
    let userId = usersDict.get(username.charAt(0)).find(element => element.name === username).id
    if(!userId)
        throw new BadRequestError("Invalid username")
    return {id : userId,psw : getUserById(userId).password}
}

//init dictionary {name, id} and userMap {id, User=null}
const restoreData = ()=>{
    data = getData()
    for ( i = 0; i < 26; i++ ) {
        usersDict.set(String.fromCharCode(97 + i),[]) 
    }
    for(let i = 0; i < data.length; i++){
        users.set(data[i].id)
        usersDict.get(data[i].name.charAt(0)).push({name: data[i].name, id: data[i].id})
    }
}

//userRoutes
const findUsersByName = (query)=>{
    return usersDict.get(query.charAt(0)).filter(element => element.name.startsWith(query))
}

//userRoutes
const getUser = async (userId) => {
    return users.get(userId)
}

module.exports = {
    addUser, 
    restoreData, 
    checkUser, 
    connectUser,
    findUsersByName,
    getUser, 
    socketEventEmitter, 
}
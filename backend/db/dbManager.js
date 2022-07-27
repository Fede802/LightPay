const fs = require('fs')
const DB_FILE = './backend/db/db.json'
let data = `{"users":[]}`
let users

const addUser = (userData) => {
    data.push(userData)
    users.set(userData.id, userData)
    fs.writeFileSync(DB_FILE, `{"users" : ${JSON.stringify(data)}}`)
}

const restoreData = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, data)
    }
    data = JSON.parse(fs.readFileSync(DB_FILE)).users
    users = new Map(data.map(element => {
        return [element.id, element];
    }))
    return data
}

const getUserById = (userId) => {
    return users.get(userId)
}

module.exports = {addUser, restoreData, getUserById}
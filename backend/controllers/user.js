const { StatusCodes} = require('http-status-codes')
const {findUsersByName, getUser} = require('../db/usersManager')

const getUserBalance = async (req, res) => {
    let temp = await getUser(req.user.userId)
    let balance = await temp.getBalances()
    res.status(StatusCodes.OK).json({balance: balance.local_balance})
}

const getUserTransactionHistory = async (req, res) => {
    let temp = await getUser(req.user.userId)
    let transactionHistory = await temp.getTransactionsHistory(req.query.list,req.query.page)
    res.status(StatusCodes.OK).json({history: transactionHistory.history, end: transactionHistory.end})
}
    
const getUserNames = async (req, res) => {
    let queryResult = findUsersByName(req.query.users)
    let temp = []
    let exclude = req.user.name
    queryResult.forEach(element => {
        if(element.name !== exclude)
            temp.push(element.name)
    });
    res.status(StatusCodes.OK).json(temp)
}

module.exports = {
    getUserBalance,
    getUserTransactionHistory, 
    getUserNames
}
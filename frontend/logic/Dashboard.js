import navigateTo from "../handler/viewHandler.js"
import AbstractLogic from "./AbstractLogic.js"
import Loading from "../view/Loading.js";
import {getSocket} from "../handler/socketHandler.js"
const loading = new Loading()

export default class extends AbstractLogic {

    constructor() {
        super()
        this.currentValue = 'btc'
    }

    async fetch() {
        document.querySelector("#view-container").innerHTML = loading.getHtml()
        this.socket = getSocket()
        this.socket.onmessage = async (message)=>{
            const response = JSON.parse(message.data);
            if(response.method == 'invoiceFulfilled'){
                await this.getBalance()
                this.updateBalanceLabel()
                await this.getTransactionsHistory()
                this.updateHistoryTable()
            }
        }
        await this.getBalance()
        await this.getTransactionsHistory()
    }
    async getTransactionsHistory(){
        this.history = (await axios.get(`/api/v1/user/history?list=4`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        })).data.history
    }
    async getBalance(){
        this.balance = (await axios.get("/api/v1/user/balance", {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        })).data.balance.sat
    }
    updateBalanceLabel(){
        if (this.currentValue === 'btc')
            this.moneyLabel.innerHTML = (this.balance * 10 ** -8).toFixed(8)
        else
            this.moneyLabel.innerHTML = this.balance
    }
    updateHistoryTable(){
        let tableBody= '';
        if(this.history.length == 0){
            this.table.hidden = true
            return
        }else
            this.table.hidden = false
        this.history.forEach(element => {
            let creationDate =  new Date(element.creation_date*1000)
            creationDate = creationDate.toLocaleString().split(',')
            let isPayment = element.isPayment
            let satAmount = element.value //sat
            let date = creationDate[0]
            let time = creationDate[1]
            tableBody+=`<tr><td>${date}</td><td>${time}</td>`
            if(isPayment)
                tableBody+=`<td> -${satAmount}</td></tr>`
            else
                tableBody+=`<td style="color:GREEN"> +${satAmount}</td></tr>`
        });
        this.tBody.innerHTML = tableBody
    }

    loadDOMElements() {
        this.tBody = document.querySelector('#tbody')
        this.table = document.querySelector('.recent')
        this.homeBtn = document.querySelector('#home')
        this.satBtn = document.querySelector('#sat')
        this.btcBtn = document.querySelector('#btc')
        this.nameLabel = document.querySelector('#name')
        this.moneyLabel = document.querySelector('#money')
        if (this.currentValue != 'btc') {
            this.satBtn.classList.add("active")
            this.btcBtn.classList.remove("active")
        }
    }
    addDOMlisteners() {
        this.homeBtn.addEventListener('click', () => {
            sessionStorage.clear()
            this.socket.close(1000, "Work complete");
            navigateTo("/")
        })

        this.satBtn.addEventListener('click', () => {
            this.switchSelectedValue('sat', this.satBtn, this.btcBtn)
        })

        this.btcBtn.addEventListener('click', () => {
            this.switchSelectedValue('btc', this.btcBtn, this.satBtn)
        })
    }
    init() {
        super.init()
        this.nameLabel.append(sessionStorage.getItem('user'))
        this.updateBalanceLabel()
        this.updateHistoryTable()

    }
    switchSelectedValue(valuetype, caller, reciever) {

        if (this.currentValue !== valuetype) {
            if (valuetype === 'sat') {
                let temp = Math.trunc(this.moneyLabel.innerHTML*= 10 ** 8)
                this.moneyLabel.innerHTML = temp
            } else {
                let temp = (this.moneyLabel.innerHTML*= 10 ** -8).toFixed(8)
                this.moneyLabel.innerHTML = temp
            }
            this.currentValue = valuetype
            caller.classList.add("active")
            reciever.classList.remove("active")
        }
    }
}



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
        this.page = 1;
        document.querySelector("#view-container").innerHTML = loading.getHtml()
        this.socket = getSocket()
        this.socket.onmessage = async (message)=>{
            const response = JSON.parse(message.data);
            if(response.method == 'invoiceFulfilled'){
                await this.getTransactionsHistory()
                this.updateHistoryTable()
            }
        }
        await this.getTransactionsHistory()
    }
    async getTransactionsHistory(){
        let data  = (await axios.get(`/api/v1/user/history?list=5&page=${this.page}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        })).data
        this.history = data.history
        this.end = data.end
    }
    updateHistoryTable(){
        if(this.history.length > 0){
        if(this.end == true)
            this.nextBtn.disabled = true
        else
            this.nextBtn.disabled = false
        let tableBody= '';
        this.history.forEach(element => {
            let creationDate =  new Date(element.creation_date*1000)
            creationDate = creationDate.toLocaleString().split(',')
            let isPayment = element.isPayment
            let satAmount = element.value //sat
            let date = creationDate[0]
            let time = creationDate[1]
            tableBody+=`<tr><td class="thr">${date}</td><td class="thr">${time}</td>`
            if(isPayment)
                tableBody+=`<td class="thr"> -${satAmount}</td></tr>`
            else
                tableBody+=`<td style="color:GREEN"> +${satAmount}</td></tr>`
        });
        this.tBody.innerHTML = tableBody
    }
}

    loadDOMElements() {
        this.tBody = document.querySelector('#tbody')
        this.homeBtn = document.querySelector('#home')
        this.prevBtn = document.querySelector('#prev')
        this.nextBtn = document.querySelector('#next')
        this.pageLabel = document.querySelector('#page')
        this.nameLabel = document.querySelector('#name')
    }
    addDOMlisteners() {
        this.homeBtn.addEventListener('click', () => {
            sessionStorage.clear()
            this.socket.close(1000, "Work complete");
            navigateTo("/")
        })
        this.prevBtn.addEventListener('click', async () => {
            
            this.page--
            
            if(this.page === 1)
            this.prevBtn.disabled = true
            await this.getTransactionsHistory()
            
            this.updateHistoryTable()
            this.pageLabel.innerHTML = `Page ${this.page}`
        })
        this.nextBtn.addEventListener('click', async () => {
            this.page++
            if(this.page === 2)
                this.prevBtn.disabled = false
            await this.getTransactionsHistory()
            this.updateHistoryTable()
            this.pageLabel.innerHTML = `Page ${this.page}`
        })
    }
    init() {
        super.init()
        this.nameLabel.append(sessionStorage.getItem('user'))
        this.updateHistoryTable()
    }
    
}

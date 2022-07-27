import navigateTo from "../handler/viewHandler.js"
import AbstractLogic from "./AbstractLogic.js"
import CheckPay from "../view/CheckPay.js";
import { getSocket } from "../handler/socketHandler.js"
const loading = new CheckPay()


export default class extends AbstractLogic {

    constructor() {
        super()
    }
    loadDOMElements() {
        this.searchWrapper = document.querySelector(".search-input"); //input wapper except button
        this.inputBox = this.searchWrapper.querySelector("#inputsearch");
        this.suggBox = this.searchWrapper.querySelector(".autocom-box");
        this.homeBtn = document.querySelector('#logout')
        this.value = document.querySelector('#value')
        this.formDOM = document.querySelector('.task-form')
        this.nameLabel = document.querySelector('#name')
        this.selectable
        this.send = true
        this.change = false
        this.socket = getSocket()
        this.socket.onmessage = message => {
            const response = JSON.parse(message.data);
            if (response.method === "paymentDone") {
                this.formDOM.innerHTML = `<div class="result"><img src="../public/img/success.png" alt="Success"><a style = 'color:GREEN'href="/dashboard" data-link>Back to Dashboard</a></div>`
            }
            if (response.method === "paymentFailed") {
                this.formDOM.innerHTML = `<div class="result"><img src="../public/img/error.png" alt="Error"><p>Error:${response.response}</p><a style = 'color:GREEN'href="/dashboard" data-link>Back to Dashboard</a></div>`
            }
        }
    }
    addDOMlisteners() {
        this.homeBtn.addEventListener('click', () => {
            sessionStorage.clear()
            this.socket.close(1000, "Work complete");
            navigateTo("/")
        })
        this.inputBox.onkeyup = async (e) => {
            let userData = e.target.value;
            if (this.send) {
                this.send = false
                if (userData) {
                    this.show()
                    setTimeout(() => {
                        this.send = true
                        if (this.change) {
                            this.change = false
                            let text = e.target.value
                            if (text)
                                this.show(text)
                            else
                                this.searchWrapper.classList.remove("active");
                        }
                    }, 1000)
                } else {
                    this.searchWrapper.classList.remove("active"); //hide autocomplete box
                }
            } else {
                this.change = true
            }
        }
        this.select = (element) => {
            let selectData = element.textContent;
            this.inputBox.value = selectData;

            this.searchWrapper.classList.remove("active");
        }
        this.showSuggestions = (list) => {
            let listData;

            if (!list.length) {
                listData = `<li>No result found</li>`;
                this.selectable = false;
            } else {
                listData = list.join('');
                this.selectable = true;
            }
            this.suggBox.innerHTML = listData;
        }

        this.show = async () => {
            let emptyArray = [];
            let { data: result } = await axios.get(`/api/v1/user?users=${this.inputBox.value}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            })
            emptyArray = result
            emptyArray = emptyArray.map((data) => {
                // passing return data inside li tag
                return data = `<li>${data}</li>`;
            });
            this.searchWrapper.classList.add("active");
            //show autocomplete box
            this.showSuggestions(emptyArray)
            if (this.selectable) {
                let allList = this.suggBox.querySelectorAll("li");
                for (let i = 0; i < allList.length; i++) {
                    allList[i].addEventListener('click', (e) => this.select(e.target))
                }
            }
        }

        this.formDOM.addEventListener('submit', async (e) => {
            e.preventDefault()
            if (this.selectable) {
                this.socket.send(JSON.stringify({
                    method: "pay",
                    token: sessionStorage.getItem('token'), dest: this.inputBox.value,
                    amt: this.value.value
                }))
            }
            this.formDOM.innerHTML = loading.getHtml()
        })

    }
    init() {
        super.init()
        this.nameLabel.append(sessionStorage.getItem('user'))


    }
}






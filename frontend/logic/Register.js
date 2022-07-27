import navigateTo from "../handler/viewHandler.js"
import AbstractLogic from "./AbstractLogic.js"

export default class extends AbstractLogic {
    
    constructor() {
        super()        
    }
    loadDOMElements() {
        this.homeBtn = document.querySelector('#home')
        this.formDOM = document.querySelector('.task-form')
        this.errUser = document.querySelector('#errUser')
        this.errCodes = document.querySelector('#errCodes')
        this.USER = document.querySelector('#user')
        this.PASSWORD = document.querySelector('#password')
        this.ADDRESS = document.querySelector('#address')
        this.TLS = document.querySelector('#tls')
        this.MACAROON = document.querySelector('#macaroon')
    }
    addDOMlisteners(){
        this.homeBtn.addEventListener('click', () => {
            navigateTo("/")
        })
        this.formDOM.addEventListener('submit', async (e) => {
            e.preventDefault()
            let name = this.USER.value
            let password = this.PASSWORD.value
            let address = (this.ADDRESS.value).split(':')
            let ip = address[0]
            let port = address[1]
            let tls = this.TLS.value
            let macaroon = this.MACAROON.value
            try {
                let {data: result} = await axios.post('/api/v1/auth/register', { name, password, ip, port, tls, macaroon})
                sessionStorage.setItem('token', result.token)
                name = name.toLowerCase()
                sessionStorage.setItem('user', name.charAt(0).toUpperCase() + name.slice(1))
                sessionStorage.setItem('logged', true)
                sessionStorage.setItem('connected', false)
                navigateTo("/dashboard")
            } catch (error) {
                if(error.response.status == 400){
                    this.ADDRESS.value = ""
                    this.TLS.value = ""
                    this.MACAROON.value = ""
                    this.errCodes.hidden = false
                    setTimeout(()=>{this.errCodes.hidden = true},4000)
                }else if (error.response.data.msg.includes('"port"')){
                    this.ADDRESS.value = ""
                    this.errCodes.hidden = false
                    setTimeout(()=>{this.errCodes.hidden = true},4000)
                }else{
                    this.USER.value = ""
                    this.errUser.hidden = false
                    setTimeout(()=>{this.errUser.hidden = true},4000)
                }
            }
            
        })
    }
}

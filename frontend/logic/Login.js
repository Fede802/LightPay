import navigateTo from "../handler/viewHandler.js"
import AbstractLogic from "./AbstractLogic.js"

export default class extends AbstractLogic{
    
    constructor() {
        super()        
    }
    loadDOMElements() {
        this.homeBtn = document.querySelector('#home')
        this.formDOM = document.querySelector('.task-form')
        this.errUser = document.querySelector('#errUser')
        this.errLogin = document.querySelector('#errLogin')
        this.USER = document.querySelector('#user')   
        this.PASSWORD = document.querySelector('#password') 
    }
    addDOMlisteners(){
        this.homeBtn.addEventListener('click', () => {
            navigateTo("/")
        })
        this.formDOM.addEventListener('submit', async (e) => {
            e.preventDefault()
            let name = this.USER.value
            let password = this.PASSWORD.value
            try {
                let {data: result} = await axios.post('/api/v1/auth/login', {name, password})
                sessionStorage.setItem('token', result.token)
                name = name.toLowerCase()
                sessionStorage.setItem('user', name.charAt(0).toUpperCase() + name.slice(1))
                sessionStorage.setItem('logged', true)
                sessionStorage.setItem('connected', false)
                navigateTo("/dashboard")
            } catch (error) {
                if(error.response.status == 400){
                    this.USER.value = ""
                    this.PASSWORD.value = ""
                    this.errLogin.hidden = false
                    setTimeout(()=>{this.errLogin.hidden = true},4000)
                }else {
                    this.USER.value = ""
                    this.errUser.hidden = false
                    setTimeout(()=>{this.errUser.hidden = true},4000)
                }
            }
            
        })
    }
}







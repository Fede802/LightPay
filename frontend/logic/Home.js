import navigateTo from "../handler/viewHandler.js"
import AbstractLogic from "./AbstractLogic.js"


export default class extends AbstractLogic {
    
    constructor() {
        super()        
    }
    loadDOMElements() {
        this.loginBtn = document.querySelector('#login')
        this.registerBtn = document.querySelector('#register')        
    }
    addDOMlisteners(){
        this.loginBtn.addEventListener('click', () => {
            navigateTo("/login")
        })
        this.registerBtn.addEventListener('click', () => {
            navigateTo("/register");
        })
    }
}


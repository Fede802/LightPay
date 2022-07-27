import AbstractView from "./AbstractView.js";
import Home from "../logic/Home.js"
const home = new Home()
export default class extends AbstractView {
    constructor() {
        super()
        this.title = "Home";
    }

    getHtml() {
        super.getHtml()
        return `
        <header>
            <h1 class="logoh">LightPay</h1>
            <button id="login">Login</button>
            <button id="register">Register</button>
        </header>
        `;
    }

    addLogic(){
        home.init()
    }
}
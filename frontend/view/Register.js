import AbstractView from "./AbstractView.js";
import Register from "../logic/Register.js";

const register = new Register()
export default class extends AbstractView {
    constructor() {
        super()
        this.title = "Register"
    }

    getHtml() {
        super.getHtml()
        return `
        <header>
        <h1 class="logoh">LightPay</h1>
        <button id="home">Home</button>
        </header>
        <div class="form-container">
        <form class="task-form">
            <h3>Register</h3>
            <input id="user" type="text" name="text" required placeholder="enter your name">
            <p id = "errUser" hidden style="color:RED">Username already exist</p>
            <input id="password" type="password" name="text" required placeholder="enter your password">
            <input id="address" type="text" name="text" required placeholder="enter your gRPC ip:port">
            <input id="tls" type="text" name="text" required placeholder="enter your tls in hex">
            <input id="macaroon" type="text" name="text" required placeholder="enter your (admin) macaroon in hex">
            <p id = "errCodes" hidden style="color:RED">Wrong node codes</p>
            <input type="submit" name="submit" value="Submit" class="form-btn">
            <p>already have an account? <a href="login" data-link>login now</a></p>
        </form>
        </div>
        `;
    }

    addLogic(){
        register.init()
    }
}
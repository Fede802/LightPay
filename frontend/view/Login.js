import AbstractView from "./AbstractView.js";

import Login from "../logic/Login.js";
const login = new Login()
export default class extends AbstractView {
    constructor() {
        super()
        this.title = "Login";
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
            <h3>Login</h3>
            <input id="user" type="text" name="text" required placeholder="enter your name">
            <p id = "errUser" hidden style="color:RED">Username doesn't exist</p>
            <input id="password" type="password" name="text" required placeholder="enter your password">
            <p id = "errLogin" hidden style="color:RED">Wrong username or password</p>
            <input type="submit" name="submit" value="Submit" class="form-btn">
            <p>don't have an account? <a href="/register" data-link>register now</a></p>
        </form>
    </div>
        `;
    }

    addLogic() {
        login.init()
    }
}
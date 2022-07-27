import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super()
        this.title = "Loading";
    }

    getHtml() {
        super.getHtml()
        return `
        <header>
        <h1 class="logoh">LightPay</h1>
        <button id="home">Logout</button>

    </header>
        <div class="loader">
        <span></span>
        <span></span>
        <span></span>
        </div>
        `;
    }
}
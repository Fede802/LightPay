import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super()
        this.title = "500";
    }

    async getHtml() {
        super.getHtml()
        return `<div class="home" style="border-bottom: 20px">
        <h1>500 server error</h1>
        <a style="color:blue"  href = "/" data-link>home</a></div>
        `;
    }
}
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super()
        this.title = "404";
    }

    async getHtml() {
        super.getHtml()
        return `<div class="home" style="border-bottom: 20px">
        <h1>404 route doesn't exist</h1>
        <a style="color:blue"  href = "/" data-link>home</a></div>
        `;
    }
}
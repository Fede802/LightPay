import AbstractView from "./AbstractView.js";
export default class extends AbstractView {
    constructor() {
        super()
        this.title = "Pay";
    }

    getHtml() {
        super.getHtml()
        return `
                <div class="loader">
                <span></span>
                <span></span>
                <span></span>
                </div>
        `;
    }
}
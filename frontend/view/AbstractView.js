export default class {
    constructor() {
        this.title = "LightPay"
    }
    
    setTitle(title) {
        document.title = title||this.title;
    }
    async fetch(){}

    getHtml() {
        this.setTitle()
        return "";
    }

    addLogic(){}
}
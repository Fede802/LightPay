import AbstractView from "./AbstractView.js";

import Pay from "../logic/Pay.js";
const  pay = new Pay()
export default class extends AbstractView {
    constructor() {
        super()
        this.title = "Pay";
    }

    getHtml() {
        super.getHtml()
        return `
        <header >
        <h1 class="logo">LightPay</h1>
        <nav>
            <ul class="menu">
                <li><a id="homelink" href="./dashboard" data-link>Home</a></li>
                <li><a id="paylink" class="selected" href="./pay" data-link>Pay</a></li>
                <li><a id="recentlink" href="./recent" data-link>Recent</a></li>
            </ul>
        </nav>
        <h4 id = 'name'>Hi, </h4>
        <button id="logout">Logout</button>
    </header>
    <div class="container">
        <section class="main">
            <div class="form-container">
                <form id = 'pay' class="task-form">
                    <!-- <div class="wrapper"> -->
                    <div>
                        <div class="search-input">
                            <input id="inputsearch" type="text" placeholder="Type to search..">
                            <div class="autocom-box">
                                <!-- here list are inserted from javascript -->
                            </div>
                            <!-- <div class="icon"><i class="fas fa-search"></i></div> -->
                            <input id="value" type="text" spellcheck="false" required placeholder="Set Amount">
                        </div>
                    </div>
                    <!-- <input type="submit" name="submit" value="Add" class="form-btn"> -->
                    <input type="submit" name="submit" value="Send" class="form-btn">
                </form>
            </div>
    </div>
        `;
    }

    addLogic(){
        pay.init()
    }
}
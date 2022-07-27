import AbstractView from "./AbstractView.js";

import Dashboard from "../logic/Dashboard.js";
const dashboard = new Dashboard()

export default class extends AbstractView {
    constructor() {
        super()
        this.title = "Dashboard";
    }
    async fetch() {
        await dashboard.fetch()
    }
    getHtml() {
        super.getHtml()
        return `
    <header>
        <h1 class="logoh">LightPay</h1>
        <nav>
            <ul class="menu">
                <li><a id="homelink"class="selected" href="./dashboard" data-link>Home</a></li>
                <li><a id="paylink"href="./pay" data-link>Pay</a></li>
                <li><a id="recentlink"href="./recent" data-link>Recent</a></li>
            </ul>
        </nav>
        <h4 id = 'name'>Hi, </h4>
        <button id="home">Logout</button>

    </header>
    <div class="container">
        <section class="main">
            <div class="card">
                    <h4>Saldo:</h4>
                    <p id = "money">2.0</p>
                    <button id = "btc"class="active">btc</button>
                    <button id = "sat">sat</button>
            </div>
            <section class="recent">
            <div class="recent-list">
                <h1>Recent</h1>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody id = "tbody">
                        
                    </tbody>
                </table>
            </div>
        </section>
    
        </section>
    </div>
        
        `;
    }

    addLogic() {
        dashboard.init()
    }
}
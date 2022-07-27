import AbstractView from "./AbstractView.js";

import Recent from "../logic/Recent.js";
const recent  = new Recent()
export default class extends AbstractView {
    constructor() {
        super()
        this.title = "Pay";
    }
    async fetch() {
        await recent.fetch()
    }
    getHtml() {
        super.getHtml()
        return `
        <header>
        <h1 class="logoh">LightPay</h1>
        <nav>
            <ul class="menu">
                <li><a id="homelink" href="./dashboard" data-link>Home</a></li>
                <li><a id="paylink"href="./pay" data-link>Pay</a></li>
                <li><a id="recentlink"class="selected"href="./recent" data-link>Recent</a></li>
            </ul>
        </nav>
        <h4 id = 'name'>Hi, </h4>
        <button id="home">Logout</button>
        </header>



    <div class="container">
        <section class="main">
            <div class="flexVert">
                <div class="recent-list">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th class="thr">Date</th>
                                    <th class="thr">Time</th>
                                    <th class="thr">Value</th>
                                </tr>
                            </thead>
                            <tbody id = "tbody">
                            <tr><td class="thr">NO DATA</td><td class="thr">NO DATA</td>
                            <td class="thr">NO DATA</td></tr>
                            </tbody>
                        </table>
                        <div class="flexOriz">
                        <button id="prev" disabled >Prev</button>
                        <p id="page">Page 1</p>
                        <button id="next" disabled >Next</button>
                        </div> 
                </div>
            
            
        </div>
        </section>
    </div>
        `;
    }

    addLogic(){
        recent.init()
    }
}
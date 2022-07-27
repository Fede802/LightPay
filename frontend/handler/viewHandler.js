import Home from "../view/Home.js";
import Login from "../view/Login.js";
import Register from "../view/Register.js";
import Dashboard from "../view/Dashboard.js";
import Pay from "../view/Pay.js";
import Recent from "../view/Recent.js";
import ServerError from "../view/Error.js";
import NotFound from "../view/NotFound.js";
import {connect} from "./socketHandler.js"
sessionStorage.setItem('reload', true)
const routes = [
    { path: "/", view: new Home },
    { path: "/login", view: new Login },
    { path: "/register", view: new Register },
    { path: "/dashboard", view: new Dashboard },
    { path: "/pay", view: new Pay },
    { path: "/recent", view: new Recent },
    { path: "/error", view: new ServerError },
    { path: "/notfound", view: new NotFound }
]

const navigateTo = async url => {
    history.pushState(null, null, url)
    await router()
}

export default navigateTo

const router = async () => {
    if(sessionStorage.getItem('reload') === 'true'){
        sessionStorage.setItem('reload', false)
        navigateTo('/')
        return
    }
    let potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        }
    })
    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch)
    if (!match) {
        match = {
            route: routes[routes.length - 1],
            isMatch: true
        }
    }
    let logged = sessionStorage.getItem('logged')
    let connected = sessionStorage.getItem('connected')
    

    if (logged ===  'true' && connected === 'false'){
        await connect()
    }
    let view = match.route.view
    await view.fetch()
    document.querySelector("#view-container").innerHTML = view.getHtml()
    view.addLogic()
}

window.addEventListener("popstate", router)

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault()
            navigateTo(e.target.href)
        }
    })
    router()
})

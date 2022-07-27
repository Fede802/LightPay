let socket
import navigateTo from "../handler/viewHandler.js"

const connect = async ()=>{
    return new Promise((resolve, reject) => {
    socket = new WebSocket("ws://192.168.1.69");
    socket.onopen = function(e) {
        socket.send(JSON.stringify({method: "connect",token: sessionStorage.getItem('token')}));
    };
    socket.onclose = function(e) {
        sessionStorage.clear()
        navigateTo('/')
    };
    socket.addEventListener('message', (message) => {
        const response = JSON.parse(message.data);
        if (response.method === "connect") {
            sessionStorage.setItem('connected',true)
            resolve()
        }
        if (response.method === "disconnect") {
            sessionStorage.clear()
            navigateTo('/')
        }
    });
})
}

const getSocket = () => {
    return socket
}

export {connect, getSocket}
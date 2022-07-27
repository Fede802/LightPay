const EventEmitter = require('events')
class Routerrpc extends EventEmitter{
    constructor(routerrpc){
        super()
        this.routerrpc = routerrpc
    }
    async payInvoice(payment, timeout){
        return new Promise((resolve, reject) => {
        let request = {
            timeout_seconds: timeout || 1000,
            payment_request: payment,
            fee_limit_sat: 10000,
            allow_self_payment: true
        }
        let call = this.routerrpc.sendPaymentV2(request);
        call.on('data', (response) => {
            if(response.status == 'SUCCEEDED'){
                this.emit('paymentDone')
                resolve()
            }
                
            if(response.status == 'FAILED'){
                this.emit('paymentFailed', response.failure_reason)
                reject(response)
            }
                
        })
    })
    }
}

module.exports = Routerrpc
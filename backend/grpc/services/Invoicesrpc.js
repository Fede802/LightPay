const EventEmitter = require('events')
class Invoicesrpc extends EventEmitter{
    constructor(invoicesrpc){
        super()
        this.invoicesrpc = invoicesrpc
    }
    subscribeInvoice(rhash){
        let request = {
            r_hash: rhash,
        };
        let call = this.invoicesrpc.subscribeSingleInvoice(request);
        call.on('data', (response) => {
            if(response.state == 'SETTLED') // or response.settled == true
            this.emit('invoiceFulfilled')
        });
    }
    async cancelInvoice(paymentHash){
        return new Promise((resolve, reject) => {
        let request = {
            payment_hash: paymentHash,
        };
        this.invoicesrpc.cancelInvoice(request, function(err, response) {
            if (response)
                resolve(response)
            else
                reject(err)
        });
    })
    }
}

module.exports = Invoicesrpc
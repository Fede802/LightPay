const EventEmitter = require('events')

class Lnrpc extends EventEmitter {
    constructor(lnrpc) {
        super()
        this.lnrpc = lnrpc
    }

    async getBalances() {
        return new Promise((resolve, reject) => {
            this.lnrpc.channelBalance({}, (err, response) => {
                if (response)
                    resolve(response)
                else
                    reject(err)
            })
        })
    }

    async addInvoice(amount) {
        return new Promise((resolve, reject) => {
            let request = {
                value: amount,
            }
            this.lnrpc.addInvoice(request, (err, response) => {
                if (response)
                    resolve(response)
                else
                    reject(err)
            })
        })
    }

    async listInvoices(list,offset) {
        return new Promise((resolve, reject) => {
            let request = {
                pending_only: false,
                index_offset: offset,
                num_max_invoices: list,
                reversed: true
            };
            this.lnrpc.listInvoices(request, function (err, response) {
                if (response){
                    resolve(response)
                }
                
                else
                    reject(err)
            });
        })

    }

    async listPayments(list, offset) {
        return new Promise((resolve, reject) => {
            let request = {
                include_incomplete: false,
                index_offset: offset,
                max_payments: list,
                reversed: true,
            };
            this.lnrpc.listPayments(request, function (err, response) {
                if (response){

                    resolve(response)
                }
                else
                    reject(err)
            });
        })
    }
}

module.exports = Lnrpc

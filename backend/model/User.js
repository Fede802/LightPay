const EventEmitter = require('events')
const serviceMaker = require('../grpc/services/serviceMaker')

class User extends EventEmitter {
    constructor(ip, port, tls, macaroon) {
        super()
        this.ip = ip
        this.port = port
        this.tls = tls
        this.macaroon = macaroon
        
    }
    async createServices() {
        this.services = await serviceMaker.createServices(this.ip, this.port, this.tls, this.macaroon)
        this.addEventsListener()
    }

    addEventsListener() {
        this.addRouterrpcListener(this.services.routerrpc)
        this.addInvoicesrpcListener(this.services.invoicesrpc)
    }
    addRouterrpcListener(routerrpc) {
        routerrpc.on('paymentDone', () => {
            this.emit('message', { method: 'paymentDone' })
        })
        routerrpc.on('paymentFailed', (failure_reason) => {
            this.emit('message', { method: 'paymentFailed', response: failure_reason })
        })
    }
    addInvoicesrpcListener(invoicesrpc) {
        invoicesrpc.on('invoiceFulfilled', () => {
            setTimeout(async () => {
                this.emit('message', { method: 'invoiceFulfilled' })
                    , 2000
            })
        })
    }

    async getBalances() {
        return await this.services.lnrpc.getBalances()
    }

    async addInvoice(amount){
        let response = await this.services.lnrpc.addInvoice(amount)
        this.subscribeInvoice(response.r_hash)
        return response
    }
    async cancelInvoice(payment_hash){
        await this.services.invoicesrpc.cancelInvoice(payment_hash)
    }
    async listInvoices(list,offset){
        return await this.services.lnrpc.listInvoices(list,offset)
    }
    async listPayments(list,offset){
        return await this.services.lnrpc.listPayments(list,offset)
    }
    async payInvoice(payment, timeout){
        await this.services.routerrpc.payInvoice(payment, timeout)
    }
    subscribeInvoice(rhash){
        this.services.invoicesrpc.subscribeInvoice(rhash)
    }

    async getTransactionsHistory(list, page){
        let offsetPay = 0
        let offsetInv = 0
        let history = []
        if(page > 1){
            offsetInv = this.maxInvoice[page-1]
            offsetPay = this.maxPayment[page-1]
        }
        let paymentData = await this.listPayments(list,offsetPay)
        let invoiceData
        do{
            invoiceData = await this.listInvoices(list,offsetInv)
            invoiceData.invoices = invoiceData.invoices.filter((elements)=>elements.state == 'SETTLED')
            offsetInv = invoiceData.first_index_offset
        }while(invoiceData.invoices.length != list && offsetInv > 1)
        let invoiceList = invoiceData.invoices
        let paymentList = paymentData.payments
        let invoiceIndex = invoiceList.length - 1
        let paymentIndex = paymentList.length - 1
        let listdone
        if(page == 1){
            this.maxInvoice = [Number(invoiceData.last_index_offset)+1]
            this.maxPayment = [Number(paymentData.last_index_offset)+1]
        }
        if(paymentIndex == -1){
            invoiceList.forEach(element => {
                element.isPayment = false
            });
            for (let i = invoiceList.length - 1; i >= 0; i--)
                history.push(invoiceList[i])
            if(page && page == this.maxInvoice.length){
                this.maxInvoice.push(Number(invoiceData.first_index_offset))
                this.maxPayment.push(1)
            }
            listdone = true
        }
        if(invoiceIndex == -1){
            paymentList.forEach(element => {
                element.isPayment = true
            });
            for (let i = paymentList.length - 1; i >= 0; i--)
                history.push(paymentList[i])
            if(page && page == this.maxInvoice.length){
                this.maxPayment.push(Number(paymentData.first_index_offset))
                this.maxInvoice.push(1)
            }
            listdone = true
        }
        if(!listdone){
        let step = list
        let invcount = 0;
        let paycount = 0;
            if(invoiceIndex+paymentIndex+2 < list)
                step = invoiceIndex+paymentIndex+2
        for (let i = 0; i < step; i++) {
            //empty list after population case
            if (invoiceIndex != -1 && paymentIndex != -1){
                if (Number(invoiceList[invoiceIndex].creation_date) > Number(paymentList[paymentIndex].creation_date)) {
                    let tempInvoice = invoiceList[invoiceIndex]
                    tempInvoice.isPayment = false
                    history.push(tempInvoice)
                    invoiceIndex--
                    invcount++
                } else {
                    let tempPayment = paymentList[paymentIndex]
                    tempPayment.isPayment = true
                    history.push(tempPayment)
                    paymentIndex--
                    paycount++
                }
                if(i == step-1 && page && page == this.maxInvoice.length){
                    this.maxPayment.push(paymentData.last_index_offset-paycount+1)
                    this.maxInvoice.push(invoiceData.last_index_offset-invcount+1)
                }
            }else
                if (invoiceIndex == -1) {
                    let tempPayment = paymentList[paymentIndex]
                    tempPayment.isPayment = true
                    history.push(tempPayment)
                    paymentIndex--
                    paycount++
                    if(i == step-1 && page && page == this.maxInvoice.length){
                        this.maxPayment.push(paymentData.last_index_offset-paycount+1)
                        this.maxInvoice.push(1)
                    }
                    
                } else {
                    let tempInvoice = invoiceList[invoiceIndex]
                    tempInvoice.isPayment = false
                    history.push(tempInvoice)
                    invoiceIndex--
                    invcount++
                    if(i == step-1 && page && page == this.maxInvoice.length){
                        this.maxPayment.push(1)
                        this.maxInvoice.push(invoiceData.last_index_offset-invcount+1)
                    }
                }
                
        }
        }

        let end = false
        if(this.maxInvoice && this.maxPayment)
            end = this.maxInvoice[this.maxInvoice.length-1] == 1 && this.maxPayment[this.maxPayment.length-1] == 1
        return {history, end}
    }
}

module.exports = User
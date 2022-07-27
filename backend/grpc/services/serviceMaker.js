const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const {BadRequestError} = require('../../errors');
const Invoicesrpc = require('./Invoicesrpc');
const Lnrpc = require('./Lnrpc');
const Routerrpc = require('./Routerrpc');

const loaderOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
};

const packageDefinition = protoLoader.loadSync(['backend/grpc/proto/lightning.proto', 'backend/grpc/proto/router.proto', 'backend/grpc/proto/invoice.proto'], loaderOptions);
const lnrpc = grpc.loadPackageDefinition(packageDefinition).lnrpc;
const routerrpc = grpc.loadPackageDefinition(packageDefinition).routerrpc;
const invoicesrpc = grpc.loadPackageDefinition(packageDefinition).invoicesrpc;

const createCredential = (tls, macaroon) => {
    let sslCreds = grpc.credentials.createSsl(Buffer.from(tls, 'hex'));
    let macaroonCreds = grpc.credentials.createFromMetadataGenerator(function (args, callback) {
        let metadata = new grpc.Metadata();
        metadata.add('macaroon', macaroon);
        callback(null, metadata);
    });
    return grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);
}

const testCredential = async(lnrpc) => {
    return new Promise((resolve, reject) => {
        lnrpc.getInfo({}, (err, response) => {
            if (response)
                resolve()   
            else
                reject(new BadRequestError("Invalid node info (ip,port,tls or macaroon)"))
            
        });
    })
}

const createServices = async (ip, port, tls, macaroon) => {
    creds = createCredential(tls, macaroon)
    let serviceLnrpc = new lnrpc.Lightning(`${ip}:${port}`, creds);
    await testCredential(serviceLnrpc)
    let serviceInvoicesrpc = new invoicesrpc.Invoices(`${ip}:${port}`, creds);
    let serviceRouterrpc = new routerrpc.Router(`${ip}:${port}`, creds);
    return {
        lnrpc: new Lnrpc(serviceLnrpc),
        invoicesrpc: new Invoicesrpc(serviceInvoicesrpc),
        routerrpc: new Routerrpc(serviceRouterrpc)
    }
    
}

module.exports = { createServices }
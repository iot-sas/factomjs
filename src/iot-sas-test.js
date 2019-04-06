const { FactomCli } = require('./factom');
const { getECAddress } = require('./iot-sas');


// You can override factomd connection parameters and retry strategy
const cli = new FactomCli({
    host: 'https://api.factomd.net',
    port: 443,
    path: '/v2', // Path to V2 API. Default to /v2
    debugPath: '/debug', // Path to debug API. Default to /debug
    protocol: 'https', // http or https. Default to http
    rejectUnauthorized: true, // Set to false to allow connection to a node with a self-signed certificate
    retry: {
        retries: 4,
        factor: 2,
        minTimeout: 500,
        maxTimeout: 2000
    }
});


//console.log(await getECAddress());


//Add a chain
const { Entry, Chain } = require('./factom');
const firstEntry = Entry.builder()
    .extId('6d79206578742069642031') // If no encoding parameter is passed as 2nd argument, 'hex' is used
    .extId('my ext id 1', 'utf8') // Explicit the encoding. Or you can pass directly a Buffer
    .content('Initial content', 'utf8')
    .build();

const chain = new Chain(firstEntry);
cli.add(chain, '');

//Add an Entry
//const { Entry } = require('factom');
//const myEntry = Entry.builder()
//    .chainId('9107a308f91fd7962fecb321fdadeb37e2ca7d456f1d99d24280136c0afd55f2')
//    .extId('6d79206578742069642031') // If no encoding parameter is passed as 2nd argument, 'hex' is used
//    .extId('some external ID', 'utf8')
//    .content('My new content',  'utf8')
//    .build();
//cli.add(myEntry, '');



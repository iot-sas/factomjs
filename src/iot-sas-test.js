const { FactomCli } = require('./factom');
const { getECAddress } = require('./iot-sas');
const iotsas = require('./iot-sas');

let iot = new iotsas();


// You can override factomd connection parameters and retry strategy
const cli = new FactomCli({
  //  host: 'api.factomd.net',
    host: '87.117.232.37',
    port: 8088,
   // port: 443,
    path: '/v2', // Path to V2 API. Default to /v2
    debugPath: '/debug', // Path to debug API. Default to /debug
    protocol: 'http', // http or https. Default to http
    rejectUnauthorized: true, // Set to false to allow connection to a node with a self-signed certificate
    retry: {
        retries: 4,
        factor: 2,
        minTimeout: 500,
        maxTimeout: 2000
    }
});



//Add a chain

async function AddChain(pubKey)
{
  const { Entry, Chain ,composeChainLedger, composeChainCommit} = require('./factom');
  const chainEntry = Entry.builder()
    .extId('6d79206578742069642031') // If no encoding parameter is passed as 2nd argument, 'hex' is used
    .extId('my ext id 1', 'utf8') // Explicit the encoding. Or you can pass directly a Buffer
    .content('Initial content', 'utf8')
    .timestamp(Date.now())
    .build();

  const chain = new Chain(chainEntry);
  
  const dataToSign = composeChainLedger(chain);
  console.log(dataToSign);
  const signature = await iot.sign(dataToSign);
  console.log(signature.length+" byte signature");
  const commit = composeChainCommit(chain, pubKey, signature);
  await cli.factomdApi('commit-chain', {message: commit.toString('hex')});
  await cli.reveal(chainEntry); 
}


//Add an Entry

async function AddEntry(pubKey)
{
  const { Entry, composeEntryLedger, composeEntryCommit } = require('./factom');
  const myEntry = Entry.builder()
    .chainId('9107a308f91fd7962fecb321fdadeb37e2ca7d456f1d99d24280136c0afd55f2')
    .extId('6d79206578742069642031') // If no encoding parameter is passed as 2nd argument, 'hex' is used
    .extId('some external ID', 'utf8')
    .content('My new content',  'utf8')
    .timestamp(Date.now())
    .build();
    
    
  const dataToSign = composeEntryLedger(myEntry);
  const signature = await iot.sign(dataToSign);  
  const commit = composeEntryCommit(myEntry, pubKey, signature);
  await cli.factomdApi('commit-entry', {message: commit.toString('hex')});
  await cli.reveal(myEntry)  
}

async function Test()
{
  ECPublicKey =  await iot.getECAddress();
  console.log(ECPublicKey);
  //AddChain(ECPublicKey);
  AddEntry(ECPublicKey);
}

Test()
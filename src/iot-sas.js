
//Get the EC address from the IOT-SAS board
function getECAddress()
{

var buffer = new Buffer(7);
   buffer[0] = 0xfa;
   buffer[1] = 0x01;
   buffer[2] = 0x01;
   buffer[3] = 0x00;
   buffer[4] = 0x00;
   buffer[5] = 0x00;
   buffer[6] = 0x00;


var result = '';

var SerialPort = require('serialport');

var com = new SerialPort('/dev/serial0', {
    baudRate: 57600,
    databits: 8,
    parity: 'none',
    autoOpen: false
});



return new Promise((resolve, reject) => {
        com.on('error', err => reject('Error while sending message : ' + err));

        com.on('data', chunk => {
            result += chunk;
            if (result.length >= 52) {
                if (result.length > 52) result = result.slice(0, 52);
                com.close();
                resolve(result);
            }
        });

        com.open(error => {
            if (error) {
                reject('Error while opening the port ' + error);
            } else {
                com.write(buffer);
            }
        });
    });
}


//Sign data
function sign(data)
{

var buffer = new Buffer(5);
   buffer[0] = 0xfa;
   buffer[1] = 0x02;
   buffer[2] = 0x02;
   buffer[3] = 0x00;
   buffer[4] = data.length;

buffer = Buffer.concat([buffer,data]);

var result = '';

var SerialPort = require('serialport');

var com = new SerialPort('/dev/serial0', {
    baudRate: 57600,
    databits: 8,
    parity: 'none',
    autoOpen: false
});

return new Promise((resolve, reject) => {
        com.on('error', err => reject('Error while sending message : ' + err));

        com.on('data', chunk => {
            result += chunk;
            if (result.length >= 64) {
                if (result.length > 64) result = result.slice(0, 64);
                com.close();
                resolve(result);
            }
        });

        com.open(error => {
            if (error) {
                reject('Error while opening the port ' + error);
            } else {
                com.write(buffer);
            }
        });
    });
}


//getECAddress().then(console.log);
//sign(Buffer.from("some test data blah blah qwerqwerqwre", 'utf8')).then(console.log).catch(console.log);

module.exports = { sign, getECAddress}

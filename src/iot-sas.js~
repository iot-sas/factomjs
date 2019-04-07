
class iotsas
{



constructor(device = '/dev/serial0') {
    var SerialPort = require('serialport');
    this.com = new SerialPort(device, {
      baudRate: 57600,
      databits: 8,
      parity: 'none',
      autoOpen: false
    });
    
    
    this.com.open(error => {
        if (error) {
            console.log("Error opening port");
        }
     });

  }

//Get the EC address from the IOT-SAS board
getECAddress()
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
//this.com.flush();
this.com.write(buffer);
return new Promise((resolve, reject) => {
        this.com.on('error', err => reject('Error while sending message : ' + err));

        this.com.on('data', chunk => {
            result += chunk;
            if (result.length >= 52) {
                if (result.length > 52) result = result.slice(0, 52);
                resolve(result);
            }
        });
    });
}


//Sign data
sign(data)
{


var buffer = new Buffer(5);
   buffer[0] = 0xfa;
   buffer[1] = 0x02;
   buffer[2] = 0x02;
   buffer[3] = 0x00;
   buffer[4] = data.length;

buffer = Buffer.concat([buffer,data]);

var result = new Buffer(0);

this.com.flush();
this.com.write(buffer);
return new Promise((resolve, reject) => {
        this.com.on('error', err => reject('Error while sending message : ' + err));

        this.com.on('data', chunk => {
            result = Buffer.concat([result,chunk]);
            if (result.length >= 64) {
                if (result.length > 64) result = result.slice(0, 64);
                resolve(result);
                console.log(result);
                this.com.flush();
            }
        }); 
    });
}

}

//let iot = new iotsas();
//iot.getECAddress().then(console.log);

//iot.sign(Buffer.from("some test data blah blah qwerqwerqwre", 'utf8')).then(console.log).catch(console.log);

module.exports = iotsas;

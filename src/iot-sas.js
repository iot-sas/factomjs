

//Get the EC address from the IOT-SAS board
function getECAddress(ec)
{

var buffer = new Buffer(7);
   buffer[0] = 0xFA;
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


 com.open(function (error) {
    if (error) {
       console.log('Error while opening the port ' + error);
    } else {
        com.write(buffer, function (err) {
            if (err) {
                console.log('Error while sending message : ' + err);
            }
        });
        com.on('data', function(chunk) {
          result += chunk;
          if (result.length == 52)
          { 
            com.close();
            ec(result);
          }
         });
    }

  });
}


//Sign data
function sign(ecAddress,data,signature)
{

var buffer = new Buffer(5);
   buffer[0] = 0xFA;
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


 com.open(function (error) {
    if (error) {
       console.log('Error while opening the port ' + error);
    } else {
        com.write(buffer, function (err) {
            if (err) {
                console.log('Error while sending message : ' + err);
            }
        });
        com.on('data', function(chunk) {
          result += chunk;
          if (result.length >= 64)
          {
            if (result.length > 64) result = result.slice(0,64);
            com.close();
            signature(result);
          }
         });
    }

  });
}

//Test
getECAddress(function(ec)
{
  console.log(ec);
  sign (ec,Buffer.from("some data theduihwedd iuhwediuhwed", 'utf8'),function(signature)
  {
    console.log(signature);
  });    
});



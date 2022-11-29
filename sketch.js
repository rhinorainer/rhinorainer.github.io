// variable to hold an instance of the p5.webserial library:
const serial = new p5.WebSerial();
  
// HTML button object:
let portButton;
 
function setup() {
    createCanvas(500, 600, WEBGL);     // make the canvas
  // check to see if serial is available:
  if (!navigator.serial) {
    alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  }
  // if serial is available, add connect/disconnect listeners:
  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);
  // check for any ports that are available:
  serial.getPorts();
  // if there's no port chosen, choose one:
  serial.on("noport", makePortButton);
  // open whatever port is available:
  serial.on("portavailable", openPort);
  // handle serial errors:
  serial.on("requesterror", portError);
  // handle any incoming serial data:
  serial.on("data", serialEvent);
  serial.on("close", makePortButton);
}
function draw() {
  
}
  
// if there's no port selected, 
// make a port select button appear:
function makePortButton() {
  // create and position a port chooser button:
  portButton = createButton('choose port');
  portButton.position(10, 10);
  // give the port button a mousepressed handler:
  portButton.mousePressed(choosePort);
}
  
// make the port selector window appear:
function choosePort() {
  serial.requestPort();
}
  
// open the selected port, and make the port 
// button invisible:
function openPort() {
  // wait for the serial.open promise to return,
  // then call the initiateSerial function
  serial.open().then(initiateSerial);
  
  // once the port opens, let the user know:
  function initiateSerial() {
    console.log("port open");
    serial.write("x");
  }
  // hide the port button once a port is chosen:
  if (portButton) portButton.hide();
}
  
// read any incoming data:
function serialEvent() {
  // read a string from the serial port
  // until you get carriage return and newline:
  var inString = serial.readStringUntil("\r\n");
  console.log(inString);
}
  
// pop up an alert if there's a port error:
function portError(err) {
  alert("Serial port error: " + err);
}
  
// try to connect if a new serial port 
// gets added (i.e. plugged in via USB):
function portConnect() {
  console.log("port connected");
  serial.getPorts();
}
  
// if a port is disconnected:
function portDisconnect() {
  serial.close();
  console.log("port disconnected");
}

// orientation variables:
let yaw = 0.0;
let pitch = 0.0;
let roll = 0.0;

// callback function for incoming serial data:
function serialEvent() {
  // read from port until new line:
  let inString = serial.readStringUntil("\r\n");
  if (inString != null) {
    let list = split(trim(inString), "\t");
    if (list.length > 2) {
      // conver list items to floats:
      yaw = float(list[0]);
      pitch = float(list[2]);
      roll = float(list[1]);
      //console.log(yaw + "," + pitch + "," + roll);
      // send a byte to the microcontroller to get new data:
      serial.write("x");
    }
  }
}

function draw() {
  /*
  let roll_d = map(roll, -90, 90, 0, 255);
  let pitch_d = map(pitch, 0, 360, 255, 255);
  let yaw_d = map(yaw, -180, 180, 0, 255);
  */
  let roll_d = cos(radians(roll)) * 255;
  let pitch_d = cos(radians(pitch)) * 255;
  let yaw_d = cos(radians(yaw)) * 255;
  //console.log(yaw_d + "," + pitch_d + "," + roll_d);
  background(roll_d, pitch_d, yaw_d);
}

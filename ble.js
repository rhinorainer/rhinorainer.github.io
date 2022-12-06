const serviceUuid = "465A640E-7553-5DDC-86C9-B3E59919C36D";
let myCharacteristic;
let myValue = 0;
let myBLE;

function setup() {
  // Create a p5ble class
  myBLE = new p5ble();

  // Create a 'Connect' button
  const connectButton = createButton('Connect')
  connectButton.mousePressed(connectToBle);
}

function connectToBle() {
  // Connect to a device by passing the service UUID
  //myBLE.connect(serviceUuid, gotCharacteristics);
  
  navigator.bluetooth.requestDevice({
    filters: [{
      services: [0x1234, 0x12345678, serviceUuid]
    }]
  })
  .then(device => { /* ... */ })
  .catch(error => { console.log(error); });
  
  
}

// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics) {
  console.log(error);  
}

function draw() {
  
}

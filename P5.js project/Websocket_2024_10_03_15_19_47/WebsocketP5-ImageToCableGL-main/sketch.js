let capture;
let img;
let ws;

function setup() {
  createCanvas(400, 400);
  
  capture = createCapture(VIDEO);
  capture.size(320, 240);
  capture.hide();

  ws = new WebSocket('ws://localhost:3000');
  
  let captureBtn = createButton('Capturar imagen');
  captureBtn.position(10, 300); // Ajustar la posición si lo deseas
  captureBtn.mousePressed(captureImage);
  
  let fileInputBtn = createButton('Seleccionar imagen desde el dispositivo');
  fileInputBtn.position(10, 340); // Ajustar la posición si lo deseas
  fileInputBtn.mousePressed(() => {
    let fileInput = createFileInput(handleFile);
    fileInput.position(10, 360);  // Mostrar input file temporalmente
  });  
}

function handleFile(file) {
  // Verifica si el archivo es una imagen
  if (file.type === 'image') {
    img = loadImage(file.data, () => sendImage(img));
  } else {
    console.log('Por favor, selecciona un archivo de imagen.');
  }
}

function captureImage() {
  img = capture.get();
  sendImage(img);
}

function sendSensorData(sensorData) {
  let data = {
    type: 'sensor',
    values: sensorData
  };
  ws.send(JSON.stringify(data));
}

function sendImage(img) {
  let base64Image = img.canvas.toDataURL();
  
  let imageData = {
    type: 'image',
    data: base64Image
  };
  
  ws.send(JSON.stringify(imageData));
}

function draw() {
  image(capture, 0, 0);
}

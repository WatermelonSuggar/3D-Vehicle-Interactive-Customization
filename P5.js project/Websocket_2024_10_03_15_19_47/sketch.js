let socket;  // Variable para el websocket
let img;  // Variable para almacenar la imagen seleccionada por el usuario (opcional)
let selectedColor;  // Variable para almacenar el color seleccionado
let glitchEffect = false;  // Bandera para activar el efecto glitch
let glitchButton, stopButton, captureButton, resetButton;  // Botones

function setup() {
  // Crear el canvas
  createCanvas(710, 400);
  background(0);

  // Establecer grosor de las líneas
  strokeWeight(10);

  // Modo de color HSB (Hue, Saturation, Brightness)
  colorMode(HSB);

  // Crear conexión websocket
  socket = new WebSocket('ws://localhost:3000'); // Cambia la URL al servidor websocket correcto

  // Crear input para que el usuario cargue una imagen
  let imageInput = createFileInput(handleFile);
  imageInput.position(10, 10);  // Posicionar el input de imagen

  // Crear el selector de color
  let colorInput = createColorPicker('white');
  colorInput.position(10, 50);
  colorInput.input(() => {
    selectedColor = colorInput.color();
  });

  // Crear el botón "Diversión" para activar el glitch
  glitchButton = createButton('Diversión');
  glitchButton.position(10, 100);
  glitchButton.mousePressed(activateGlitch);

  // Crear el botón "Stop" para desactivar el glitch
  stopButton = createButton('Stop');
  stopButton.position(90, 100);
  stopButton.mousePressed(deactivateGlitch);

  // Crear el botón "Captura" para tomar una captura de pantalla
  captureButton = createButton('Enviar Imagen');
  captureButton.position(10, 130);
  captureButton.mousePressed(captureCanvas);  // Cambiar a enviar la imagen por websocket

  // Crear el botón "Restaurar" para restablecer los valores por defecto
  resetButton = createButton('Restaurar');
  resetButton.position(10, 160);
  resetButton.mousePressed(resetDefaults);
}

function handleFile(file) {
  if (file.type === 'image') {
    img = loadImage(file.data, () => {
      image(img, 0, 0, width, height);

      //sendImage(img);
      
      let base64Image = img.canvas.toDataURL();
  
      let imageData = {
      type: 'image',
      data: base64Image
      };
  
      socket.send(JSON.stringify(imageData));


    });
  } else {
    img = null;
  }
}

function mouseDragged() {
  if (selectedColor) {
    stroke(selectedColor);
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

function draw() {
  if (glitchEffect) {
    glitch();
  }
}

function glitch() {
  for (let i = 0; i < 20; i++) {
    let x = int(random(width));
    let y = int(random(height));
    let w = int(random(10, 50));
    let h = int(random(10, 50));
    let offsetX = int(random(-10, 10));
    let offsetY = int(random(-10, 10));
    
    copy(x, y, w, h, x + offsetX, y + offsetY, w, h);
  }
}

function activateGlitch() {
  glitchEffect = true;
}

function deactivateGlitch() {
  glitchEffect = false;
}

function captureCanvas() {
  // Obtener el canvas de p5.js como elemento HTML
  let canvasElement = document.querySelector('canvas');

  // Convertir el canvas a base64 (formato PNG)
  let dataURL = canvasElement.toDataURL('image/png');

  // Crear el paquete de imagen con el canvas modificado
  let imageData = {
    type: 'image',
    data: dataURL
  };

  // Enviar los datos a través del websocket
  socket.send(JSON.stringify(imageData));

  console.log("Imagen enviada por websocket.");
}

// Función para restablecer valores por defecto
function resetDefaults() {
  background(0);  // Restablecer fondo
  selectedColor = color('white');  // Color por defecto
  glitchEffect = false;  // Desactivar glitch
  img = null;  // Eliminar imagen cargada
  colorInput.value('#ffffff');  // Restablecer selector de color

  console.log("Valores restaurados a los valores por defecto.");
}

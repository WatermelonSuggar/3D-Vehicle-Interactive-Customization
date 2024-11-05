# 3D-Vehicle-Interactive-Customization

[Project Patch on Cables.gl](https://cables.gl/p/buYL8q)

## Project Description

This project addresses the need to create an environment where users can actively engage in design and entertainment activities, allowing them to connect more deeply with the brands they consume. Through a real-time 3D vehicle customization platform, users can dynamically interact, adjusting the appearance of a car according to their personal preferences.

* **Objective:** To create an intuitive design environment where users can customize a 3D car model in real time. The platform offers interactive tools that allow for fluid and fun modifications to the vehicle's exterior, generating an emotional connection with the brand and fostering creativity.

## Creative Concept

* **Vision:** This project aims to offer an immersive and surprising experience, where users feel that their decisions have a direct impact on the digital environment. The platform concept connects the physical world with the digital one, allowing every change made to the car's exterior design to be visible with a single click, creating an appealing and customizable visual experience.

* **Narrative:** Imagine a world where cars reflect their drivers' personalities. Here, each car is a unique extension of its owner, with fun and dynamic customization options.

## Basic Project Structure

![image](https://github.com/user-attachments/assets/54c422a1-5525-4fca-89eb-8eea83ff71c2)

> The design method used was proposed by Patrik Huebner

1. **Input:** The user selects an image from their personal gallery.

2. **Processing:** The application interface allows the user to draw on the image and apply visual effects with a glitch effect, which will be sent via websocket to the application containing the 3D vehicle interface, applying the texture (image) sent by the user to the exterior of the vehicle.

3. **Output:** The final design is interactive, fully customized, and downloadable, allowing the user to share their creation on social media.

## P5.js

* The p5.js development environment was used for designing the first interface for image processing:

### The code
```js
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

```

## Important Considerations

1. The websocket works with a Node.js server, so it's important that your computer has it installed. If not, please download it [here](https://nodejs.org/en).

2. Once you download this repository:

* npm install
* npm start
* Open the Cables.gl client
* Check in the Websocket operator that it is connected (the operator has an output that indicates this).
* Serve the p5.js client with Visual Studio Code's live server.

## Credits and References
[Case study for sending images via websocket](https://github.com/juanferfranco/WebsocketP5-ImageToCableG)

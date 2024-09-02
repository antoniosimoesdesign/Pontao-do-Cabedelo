let obj;
let customFont;
let rotationX, rotationY, rotationZ;
let scaleFactor = 0.35;
let numInstances;

let positions;
let minDistance;

let rectX, rectY, rectWidth, rectHeight;
let rectMargin = 20;

let bottomRightImage;
let imageScale = 0.13;
let imageMargin = 20;

let canvas; // Store the canvas element for download
let sketchRunning = false; // Flag to control when to draw

function preload() {
    customFont = loadFont('Archivo-Regular.otf');
    obj = loadModel('pontao10.obj', true);
    bottomRightImage = loadImage('logo5.png');
}

function setup() {
    // Create the canvas and hide it initially
    canvas = createCanvas(595, 842, WEBGL);
    canvas.parent('canvasContainer');
    canvas.hide();

    rectWidth = width - 2 * rectMargin;
    
    // Adjust the height to limit the spawn area (reduce the height)
    rectHeight = height * 0.7;  // Make the height smaller to limit the spawn area
    rectX = rectMargin;
    
    // Position the bounding box higher on the canvas
    rectY = -height * 0.1;  // Adjust the position to move the spawning area up

    textFont(customFont);

    document.getElementById('generateBtn').addEventListener('click', startSketch);
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
}

function initializeSketch() {
    numInstances = int(random(15, 27));

    rotationX = radians(45);
    rotationY = radians(45);
    rotationZ = random(TWO_PI);

    positions = new Array(numInstances).fill().map(() => new Array(3));
    minDistance = scaleFactor * 2;

    for (let i = 0; i < numInstances; i++) {
        let validPosition;
        do {
            validPosition = true;
            positions[i][0] = random(-rectWidth / 2 + scaleFactor, rectWidth / 2 - scaleFactor);
            positions[i][1] = random(-rectHeight / 2 + scaleFactor, rectHeight / 2 - scaleFactor);
            positions[i][2] = random(-500, -100);

            for (let j = 0; j < i; j++) {
                let dx = positions[i][0] - positions[j][0];
                let dy = positions[i][1] - positions[j][1];
                let distance = sqrt(dx * dx + dy * dy);
                if (distance < minDistance) {
                    validPosition = false;
                    break;
                }
            }
        } while (!validPosition);
    }
}

function draw() {
    if (!sketchRunning) {
        return; // Only draw if the sketch is running
    }

    background(0);

    lights();
    noStroke();

    for (let i = 0; i < numInstances; i++) {
        push();
        translate(positions[i][0], positions[i][1], positions[i][2]);
        scale(scaleFactor);
        rotateX(rotationX);
        rotateY(rotationY);
        rotateZ(rotationZ);
        model(obj);
        pop();
    }

    noLights();
    textSize(12);
    fill(255);

    let textMargin = 20;
    let currentDate = nf(day(), 2) + "." + nf(month(), 2) + "." + year();
    let locationText = "Pontão do Cabedelo";
    let coordinatesText1 = "40º08’35.1”N";
    let coordinatesText2 = "08º52’23.5”W";

    text(currentDate, -width / 2 + textMargin, height / 2 - textMargin - 45);
    text(coordinatesText1, -width / 2 + textMargin, height / 2 - textMargin - 30);
    text(coordinatesText2, -width / 2 + textMargin, height / 2 - textMargin - 15);
    text(locationText, -width / 2 + textMargin, height / 2 - textMargin);

    let imgWidth = bottomRightImage.width * imageScale;
    let imgHeight = bottomRightImage.height * imageScale;
    image(bottomRightImage, width / 2 - imgWidth - imageMargin, height / 2 - imgHeight - imageMargin, imgWidth, imgHeight);
}

function startSketch() {
    sketchRunning = true; // Start the sketch
    initializeSketch(); // Reinitialize positions and other settings
    canvas.show(); // Show the canvas
    
    canvas.style.width = "100%"; // Ensure the canvas is correctly scaled when displayed
    canvas.style.height = "auto"; // Maintain aspect ratio
    
    loop(); // Ensure draw() is called continuously
    
    // Enable the Save button after generating the image
    document.getElementById('downloadBtn').removeAttribute('disabled');
}

function downloadImage() {
    noLoop(); // Stop the drawing loop
    setTimeout(() => {
        saveCanvas(canvas, "generated_image", "png");
        loop(); // Restart the drawing loop if needed
    }, 100); // Delay to ensure the canvas is fully rendered
}

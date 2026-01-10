let obj;
let customFont;
let rotationX, rotationY, rotationZ;
let scaleFactor = 0.33;
let numInstances;

let positions;
let minDistance;

let rectX, rectY, rectWidth, rectHeight;
let rectMargin = 20;

let bottomRightImage;
let imageScale = 0.025;
let imageMargin = 16;

let canvas; 
let sketchRunning = false; 

function preload() {
    customFont = loadFont('Archivo-Regular.otf');
    obj = loadModel('pontao10.obj', true);
    bottomRightImage = loadImage('logo.png');
}

function setup() {

    canvas = createCanvas(595, 842, WEBGL);
    canvas.parent('canvasContainer');
    canvas.hide();

    rectWidth = width - 2 * rectMargin;
    

    rectHeight = height * 0.87;  
    rectX = rectMargin;
    

    rectY = -height * 0.043;

    textFont(customFont);

    document.getElementById('generateBtn').addEventListener('click', startSketch);
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
}

function initializeSketch() {
    numInstances = int(random(20, 50));

    rotationX = random(TWO_PI); 
    rotationY = random(TWO_PI);  
    rotationZ = random(TWO_PI);

    positions = new Array(numInstances).fill().map(() => new Array(3));
    minDistance = scaleFactor * 2;

    let spawnMarginX = rectMargin + scaleFactor;
    let spawnMarginY = rectMargin + scaleFactor;

    for (let i = 0; i < numInstances; i++) {
        let validPosition;
        do {
            validPosition = true;
            positions[i][0] = random(-rectWidth / 2 + spawnMarginX, rectWidth / 2 - spawnMarginX);

            positions[i][1] = random(rectY - rectHeight / 2 + spawnMarginY, rectY + rectHeight / 2 - spawnMarginY);
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
        return; 
    }

    background(0);


    push();
    stroke(255); 
    noFill(); 
    translate(0, 0, 1); 
    beginShape();
    vertex(-rectWidth / 2, rectY - rectHeight / 2);
    vertex(rectWidth / 2, rectY - rectHeight / 2);
    vertex(rectWidth / 2, rectY + rectHeight / 2);
    vertex(-rectWidth / 2, rectY + rectHeight / 2);
    endShape(CLOSE);
    pop();

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
    sketchRunning = true; 
    initializeSketch();
    canvas.show(); 
    
    canvas.style.width = "100%";
    canvas.style.height = "auto"; 
    
    loop(); 
    

    document.getElementById('downloadBtn').removeAttribute('disabled');
}

function downloadImage() {
        saveCanvas(canvas, "generated_image", "png");
}

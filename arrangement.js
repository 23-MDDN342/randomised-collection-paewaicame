/*
 * This program draws your arrangement of faces on the canvas.
 */
const canvasWidth = 960;
const canvasHeight = 500;
let curRandomSeed = 0;

let lastSwapTime = 0;
const millisPerSwap = 20000;

// global variables for colors
const paletteBackground = [0, 0, 0];
const paletteStroke = [22, 20, 31, 255];
const paletteStrokeShadow = [42, 34, 37, 64];
const paletteStrokeShadowOffset = 0.5;

// preloading palette images
let skintonesImage;
let hairtonesImage;
function preload() {
    skintonesImage = loadImage('resources/skintones.png');
    hairtonesImage = loadImage('resources/hairtones.png');
}

// array for storing face configurations
let faceArray = [];
let maxFaces = 35;

function setup() {
    // create the drawing canvas, save the canvas element
    let main_canvas = createCanvas(canvasWidth, canvasHeight);
    main_canvas.parent('canvasContainer');

    curRandomSeed = int(random(0, 1000));

    angleMode(DEGREES);
    rectMode(CENTER);
    strokeJoin(ROUND);

    // creates 100 faces
    for (let i = 0; i < maxFaces; i++) {
        faceArray.push(createFace());
    }
}

function changeRandomSeed() {
    // generate new faces
    faceArray = [];
    for (let i = 0; i < maxFaces; i++) {
        faceArray.push(createFace());
    }
    curRandomSeed = curRandomSeed + 1;
    lastSwapTime = millis();
}

function mouseClicked() {
    changeRandomSeed();
}

// grid parameters
const totalColumns = 7;
const totalRows = 5;
const faceScale = 10;
// minimum and maximum face sizes for squishing 
const faceWidthMinimum = 13.75;
const faceWidthMaximum = 27.5;
const faceHeightMinimum = 15;
const faceHeightMaximum = 30;
let faceWidth = (faceWidthMinimum + faceWidthMaximum) / 2;
let faceHeight = (faceHeightMinimum + faceHeightMaximum) / 2;
let squishFactor;
let defaultStrokeWeight;
const defaultStrokeWeightMin = 0.8;
const defaultStrokeWeightMax = 1;
// parameters for squish animation duration and smoothing
const oscillationTime = 5;
const oscillationParameter = 3;

function draw() {
    // removed the auto-generating faces, a bit jarring with the animation
    if (millis() > lastSwapTime + millisPerSwap) {
        changeRandomSeed();
    }

    // creates a "squish factor" between 0 and 1, basically like a sine wave with flatter peaks
    let oscillationFactor = (millis() / 100) / Math.PI / oscillationTime;
    squishFactor = (Math.sqrt((1 + oscillationParameter ** 2) / (1 + oscillationParameter ** 2 * Math.sin(oscillationFactor) ** 2)) * Math.sin(oscillationFactor));
    defaultStrokeWeight = map(squishFactor,-1,1,defaultStrokeWeightMin,defaultStrokeWeightMax);

    // squishFactor = map(Math.sqrt(Math.pow(canvasWidth/2 - mouseX, 2) + Math.pow(canvasHeight/2 - mouseY, 2)),0,540,-1,1);

    // map the squish factor to the face width and height
    faceWidth = map(squishFactor, -1, 1, faceWidthMinimum, faceWidthMaximum);
    faceHeight = map(squishFactor, -1, 1, faceHeightMinimum, faceHeightMaximum);

    // reset the random number generator each time draw is called
    randomSeed(curRandomSeed);

    // clear screen
    background(paletteBackground);

    drawFacesGrid("noFeatures"); // draw background only
    drawFacesGrid("features"); // draw facial features
    drawFacesGrid("jigsaw"); // draw jigsaw lines

    function drawFacesGrid(mode) {
        for (let i = 0; i < faceArray.length; i++) {
            // calculate appropriate position of faces based on total columns
            let columnWidth = faceWidth * faceScale;
            let rowHeight = faceHeight * faceScale;
            let gridXIndex = i % totalColumns;
            let gridYIndex = Math.floor(i / totalColumns);
            let gridXIndexOffset = gridXIndex - (totalColumns / 2);
            let gridYIndexOffset = gridYIndex - (totalRows / 2);
            let gridX = (gridXIndexOffset * columnWidth) + (columnWidth / 2);
            let gridY = (gridYIndexOffset * rowHeight) + (rowHeight / 2);

            push();
            translate(canvasWidth / 2 + gridX, canvasHeight / 2 + gridY); // translate to appropriate position, and center the grid
            scale(faceScale);
            if (mode == "noFeatures") { // draw only backgrounds first
                drawFace(faceArray[i], true);
            } else if (mode == "features") { // draw facial features
                push();
                translate(0, paletteStrokeShadowOffset);
                drawFace(faceArray[i], false, true); // draw shadows first
                pop();
                drawFace(faceArray[i], false, false); // draw solid lines second
            } else if (mode == "jigsaw" && gridXIndex != 0) { // dont draw jigsaw lines on the first column
                stroke(paletteStroke);
                if (faceArray[i].jigsawDirection) { // change jigsaw line based on specific orientation
                    push(); // draw arc fill
                    noStroke();
                    fill(faceArray[i].skintone);
                    arc(-faceWidth / 2, 0, 5, 5, 90, 270);
                    pop();

                    fill(0, 0, 0, 0);
                    stroke(paletteStrokeShadow);
                    strokeWeight(defaultStrokeWeight);

                    push(); // draw shadow jigsaw line
                    translate(0, paletteStrokeShadowOffset);
                    line(-faceWidth / 2, -faceHeight / 2, -faceWidth / 2, -2.5);
                    line(-faceWidth / 2, faceHeight / 2, -faceWidth / 2, 2.5);
                    arc(-faceWidth / 2, 0, 5, 5, 90, 270);
                    pop();

                    stroke(paletteStroke);

                    push(); // draw solid jigsaw line
                    line(-faceWidth / 2, -faceHeight / 2, -faceWidth / 2, -2.5);
                    line(-faceWidth / 2, faceHeight / 2, -faceWidth / 2, 2.5);
                    arc(-faceWidth / 2, 0, 5, 5, 90, 270);
                    pop();
                } else {
                    push(); // draw arc fill
                    noStroke();
                    fill(faceArray[i - 1].skintone);
                    arc(-faceWidth / 2, 0, 5, 5, 270, 90);
                    pop();

                    fill(0, 0, 0, 0);
                    stroke(paletteStrokeShadow);
                    strokeWeight(defaultStrokeWeight);

                    push(); // draw shadow jigsaw line
                    translate(0, paletteStrokeShadowOffset);
                    line(-faceWidth / 2, -faceHeight / 2, -faceWidth / 2, -2.5);
                    line(-faceWidth / 2, faceHeight / 2, -faceWidth / 2, 2.5);
                    arc(-faceWidth / 2, 0, 5, 5, 270, 90);
                    pop();

                    stroke(paletteStroke);

                    push(); // draw solid jigsaw line
                    line(-faceWidth / 2, -faceHeight / 2, -faceWidth / 2, -2.5);
                    line(-faceWidth / 2, faceHeight / 2, -faceWidth / 2, 2.5);
                    arc(-faceWidth / 2, 0, 5, 5, 270, 90);
                    pop();
                }
            }
            pop();
        }
    }
}

function keyTyped() {
    if (key == '!') {
        saveBlocksImages();
    }
    else if (key == '@') {
        saveBlocksImages(true);
    }
}

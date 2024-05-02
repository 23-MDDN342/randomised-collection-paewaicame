/*
 * This editor shows the possible faces that can be created
 */

const canvasWidth = 960;
const canvasHeight = 500;
const paletteBackground = [0,0,0];
const paletteStroke = [22,20,31,255];
const paletteStrokeShadow = [42,34,37,64];
const paletteStrokeShadowOffset = 0.35;
let slider1, slider2, slider3, slider4, slider5;
let slider6, slider7, slider8, slider9, slider10;
let faceSelector;
let faceGuideCheckbox;

let faceArray = [];
let totalColumns = 7;
let totalRows = 5;
let faceScale = 10;
let faceWidthMinimum = 13.75;
let faceWidthMaximum = 25;
let faceHeightMinimum = 16.25;
let faceHeightMaximum = 30;
let faceWidth = (faceWidthMinimum + faceWidthMaximum) / 2;
let faceHeight = (faceHeightMinimum + faceHeightMaximum) / 2;
let squishFactor;
let oscillationTime = 5;
let squishParameter = 3;

let skintonesImage;
let hairtonesImage;
function preload() {
    skintonesImage = loadImage('resources/skintones.png');
    hairtonesImage = loadImage('resources/hairtones.png');
}

function setup() {
    // create the drawing canvas, save the canvas element
    let main_canvas = createCanvas(canvasWidth, canvasHeight);
    main_canvas.parent('canvasContainer');

    // create sliders
    slider1 = createSlider(0, 100, 50);
    slider2 = createSlider(0, 100, 50);
    slider3 = createSlider(0, 100, 50);
    slider4 = createSlider(0, 100, 50);
    slider5 = createSlider(0, 100, 50);
    slider6 = createSlider(0, 100, 50);
    slider7 = createSlider(0, 100, 50);
    slider8 = createSlider(0, 100, 50);
    slider9 = createSlider(0, 100, 50);
    slider10 = createSlider(0, 100, 50);

    slider1.parent('slider1Container');
    slider2.parent('slider2Container');
    slider3.parent('slider3Container');
    slider4.parent('slider4Container');
    slider5.parent('slider5Container');
    slider6.parent('slider6Container');
    slider7.parent('slider7Container');
    slider8.parent('slider8Container');
    slider9.parent('slider9Container');
    slider10.parent('slider10Container');

    faceGuideCheckbox = createCheckbox('', false);
    faceGuideCheckbox.parent('checkbox1Container');

    faceSelector = createSelect();
    faceSelector.option('1');
    faceSelector.option('2');
    faceSelector.option('3');
    faceSelector.value('1');
    faceSelector.parent('selector1Container');



    angleMode(DEGREES);
    rectMode(CENTER);
    strokeJoin(ROUND);

    // Creates a new face
    faceArray.push(createFace());
}

function draw() {
    strokeWeight(0.2);

    let mode = faceSelector.value();

    background(paletteBackground);

    let s1 = slider1.value();
    let s2 = slider2.value();
    let s3 = slider3.value();
    let s4 = slider4.value();
    let s5 = slider5.value();
    let s6 = slider6.value();
    let s7 = slider7.value();
    let s8 = slider8.value();
    let s9 = slider9.value();
    let s10 = slider10.value();

    let show_face_guide = faceGuideCheckbox.checked();

    // use same size / y_pos for all faces
    let face_size = canvasWidth / 5;
    let face_scale = face_size / 10;
    let face_y = height / 2;
    let face_x = width / 2;


    // creates a "squish factor" between 0 and 1, basically like a sine wave with flatter peaks
    let oscillationFactor = (millis() / 100) / Math.PI / oscillationTime;
    squishFactor = (Math.sqrt((1 + squishParameter ** 2) / (1 + squishParameter ** 2 * Math.sin(oscillationFactor) ** 2)) * Math.sin(oscillationFactor));

    // map the squish factor to the face width and height
    faceWidth = map(squishFactor,-1,1,faceWidthMinimum,faceWidthMaximum);
    faceHeight = map(squishFactor,-1,1,faceHeightMinimum,faceHeightMaximum);
    

    push();
    translate(face_x, face_y);
    scale(face_scale);

    faceArray.forEach(element => {
        drawFace(element,true);
    });
    faceArray.forEach(element => {
        drawFace(element,false);
    });

    if (show_face_guide) {
        strokeWeight(0.1);
        rectMode(CORNER);
        noFill();
        stroke(0, 0, 255);
        rect(-10, -10, 20, 20);
        line(0, -11, 0, -10);
        line(0, 10, 0, 11);
        line(-11, 0, -10, 0);
        line(11, 0, 10, 0);
    }

    pop();
}

function keyTyped() {
    if (key == '!') {
        saveBlocksImages();
    }
    else if (key == '@') {
        saveBlocksImages(true);
    }
}

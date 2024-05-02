/*
* This file should contain code that draws your faces.
*
* Each function takes parameters and draws a face that is within
* the bounding box (-10, -10) to (10, 10).
*
* These functions are used by your final arrangement of faces as well as the face editor.
*/

function createFace() {
    return { // return dictionary of values
            skintone: skintonesImage.get(random(0, skintonesImage.width), random(0, skintonesImage.height)), // select a random colour from skin tone palette image
            hairtone: hairtonesImage.get(random(0, hairtonesImage.width), random(0, hairtonesImage.height)), // select a random colour from hair colour palette image
            eyes: Math.floor(random() * Object.keys(eyesIndex).length), // randomly select eyes
            eyesInterpupillaryDistance: getAveragedRandom(4,16,8), // Averaged random for eye distance
            eyesScale: getAveragedRandom(0.6,1.2,3), // Averaged random for eye size
            eyesRandomSquishedChoice: random(), // Simple random for eye variant (if applicable)
            nose: Math.floor(random() * Object.keys(noseIndex).length), // randomly select nose
            noseScale: getAveragedRandom(0,1.6,5), // Averaged random for nose size
            mouth: Math.floor(random() * Object.keys(mouthIndex).length), // randomly select mouth
            mouthScale: getAveragedRandom(0.6,1,3), // Averaged random for mouth size
            baldChance: random() > 0.6 ? true : false, // Fixed 60% chance of having hair
            hair: Math.floor(random() * Object.keys(hairIndex).length), // randomly select hair
            hairScale: faceWidth/15, // calculate hair size, as wide as the face width
            jigsawDirection: random() > 0.5 ? true : false, // draw jigsaw piece facing left or right
            squishTolerance: map(random(),0,1,-0.9,0.3), // Random squish tolerance -0.9 and 0.3
    }
}
function drawFace(face,noFeatures,shadow) {
    if (noFeatures) { // no features, just draw colour background and return
        noStroke();
        fill(face.skintone);
        rect(0, 0, faceWidth, faceHeight);
        return;
    }
    
    let faceState = squishFactor < face.squishTolerance ? false : true; // changes state when squish factor surpasses the face's own squish toleranec

    let eyesSelected = face.eyes; // selected eyes index
    let eyesNeutral = eyesIndex[eyesSelected].neutral; // selected eyes, neutral variant
    let eyesSquishedSelected = Math.floor(map(face.eyesRandomSquishedChoice,0,1,0,eyesIndex[eyesSelected].squished.length)); // pick from possible squished variants
    let eyesSquished = eyesIndex[eyesSelected].squished[eyesSquishedSelected]; // select eyes, squished variant
    let eyesInterpupillaryDistance = map(squishFactor,-1,1,face.eyesInterpupillaryDistance*0.65,face.eyesInterpupillaryDistance); // calculate interpupillary distance based on squish factor
    let eyesHeightOffset = map(squishFactor,-1,1,-3,-4); // calculate height offset based on squish factor
    
    let noseSelected = face.nose; // selected nose index
    let nose = noseIndex[noseSelected]; // selected nose
    let noseHeightOffset = 0; // define height offset
    
    let mouthSelected = face.mouth; // selected mouth index
    let mouthNeutral = mouthIndex[mouthSelected].neutral; // selected neutral mouth
    let mouthSquished = mouthIndex[mouthSelected].squished; // selected squished mouth
    let mouthHeightOffset = map(squishFactor,-1,1,4,5); // calculate height offset based on squish factor
    
    let hairSelected = face.hair; // selected hair index
    let hair = hairIndex[hairSelected]; // selected hair
    let hairHeightOffset = -faceHeight/2; // calculate top of head to draw hair in correct position

    rectMode(CENTER); // center drawing coordinates
    
    fill(0,0,0,0);
    strokeWeight(defaultStrokeWeight);
    if (shadow) { // draw translucent strokes for shadows
        stroke(paletteStrokeShadow);
    } else { // draw opaque strokes normally
        stroke(paletteStroke);
    }
    
    push(); // draw eyes
    translate(0, eyesHeightOffset);
    
    push(); // draw left eye
    translate(eyesInterpupillaryDistance / 2, 0);
    scale(face.eyesScale);
    strokeWeight(defaultStrokeWeight/face.eyesScale);
    faceState ? eyesNeutral() : eyesSquished();
    pop();
    
    push(); // draw right eye
    translate(eyesInterpupillaryDistance / -2, 0);
    scale(face.eyesScale);
    strokeWeight(defaultStrokeWeight/face.eyesScale);
    faceState ? eyesNeutral() : eyesSquished();
    pop();
    
    pop();
    
    push(); // draw nose
    translate(0, noseHeightOffset);
    scale(face.noseScale);
    strokeWeight(defaultStrokeWeight/face.noseScale);
    nose();
    pop();
    
    push(); // draw mouth
    translate(0, mouthHeightOffset);
    scale(face.mouthScale);
    strokeWeight(defaultStrokeWeight/face.mouthScale);
    faceState ? mouthNeutral() : mouthSquished();
    pop();
    
    push(); // draw hair
    fill(face.hairtone);
    translate(0, hairHeightOffset);
    scale(faceWidth/15);
    strokeWeight(defaultStrokeWeight/(faceWidth/15));

    if (face.baldChance) { // don't draw hair if bald
        line(-7.5,0,7.5,0);
    } else { // draw hair if not bald
        hairIndex[hairSelected]();
    }
    pop();
}

function getAveragedRandom(min, max, n) { // from nuku
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum = sum + random(min, max);
    }
    return sum / n;
}

let eyesIndex = {
    0: {
        neutral: function () { // single dots
            fill(paletteStroke);
            circle(0, 0, 1);
        },
        squished: [
            function () { // circle with dot
                circle(0, 0, 4);
                fill(paletteStroke);
                circle(0, 0, 0.25);
            },
            function () { // horizontal oval with dot
                angleMode(DEGREES);
                rotate(-90);
                arc(-3.25, 0, 7, 7, -25, 25);
            },
        ]
    },
    1: {
        neutral: function () { // vertical line
            line(0, -1, 0, 1);
        },
        squished: [
            function () { // vertical oval with dot
                rect(0, 0, 3, 5, 2);
                fill(paletteStroke);
                circle(0, 0, 0.25);
            }
        ]
    },
    2: {
        neutral: function () { // horizontal line
            line(-1, 0, 1, 0);
        },
        squished: [
            function () { // horizontal oval with dot
                rect(0, 0, 5, 3, 2);
                fill(paletteStroke);
                circle(0, 0, 0.25);
            }
        ]
    }
}
let noseIndex = {
    0: function () { // downward-pointing
        beginShape();
        vertex(1,-1.5)
        vertex(-2,1.5)
        vertex(1,1.5)
        endShape();
    },
    1: function () { // forward-pointing
        beginShape();
        vertex(1,-1.5)
        vertex(-2,0)
        vertex(1,1.5)
        endShape();
    },
    2: function () { // upward-pointing
        beginShape();
        vertex(1,-1)
        vertex(-2,-1)
        vertex(1,2)
        endShape();
    },
    3: function () { // forward-facing button
        arc(0,0,3,3,45,315);
    },
    4: function () { // downard-facing button
        rotate(-90);
        arc(0,0,3,3,45,315);
    },
    5: function () { // trapezoid
        beginShape();
        vertex(-1,-1.5)
        vertex(-2,1.5)
        vertex(2,1.5)
        vertex(1,-1.5)
        endShape();
    },
    6: function () { // funky
        line(0,-2,0,0);
        line(0,0,-1,0);
        arc(-1,1,2,2,90,270);
        line(-1,2,2,2);
    },
    7: function () { // U-shaped
        line(-1,-1,-1,0);
        line(1,-1,1,0);
        arc(0,0,2,2,0,180);
    },
    8: function () { // N-shaped
        line(-1,0,-1,1);
        line(1,0,1,1);
        arc(0,0,2,2,180,360);
    },
    9: function () { // butt-shaped
        arc(-1,0,2,2,0,225);
        arc(1,0,2,2,315,180);
    },
    10: function () { // stubby
        line(-2,-0.5,-2,0);
        line(2,-0.5,2,0);
        line(-1,1,1,1);
        arc(-1,0,2,2,90,180)
        arc(1,0,2,2,0,90)
    },
}
let mouthIndex = {
    0: {
        neutral: function () { // line
            line(-3, 0, 3, 0);
        },
        squished: function () { // circle
            circle(0, 0, 3);
        }
    },
    1: {
        neutral: function () { // smile
            angleMode(DEGREES);
            rotate(90);
            arc(-10, 0, 20, 20, -20, 20);
        },
        squished: function () { // grin
            angleMode(DEGREES);
            rotate(90);
            arc(-1.5, 0, 6, 6, -90, 90);
            line(-1.5, -3, -1.5, 3);
        }
    },
    2: {
        neutral: function () { // sad
            angleMode(DEGREES);
            rotate(-90);
            arc(-10, 0, 20, 20, -20, 20);
        },
        squished: function () { // unhappy
            angleMode(DEGREES);
            rotate(-90);
            arc(-1.5, 0, 6, 6, -90, 90);
            line(-1.5, -3, -1.5, 3);
        }
    },
    3: {
        neutral: function () { // meek
            line(-3, 0, 3, 0);
            line(-3, -1, -3, 1);
            line(3, -1, 3, 1);
        },
        squished: function () { // horizontal mouth open
            rect(0, 0, 6, 2, 1);
        }
    },
    4: {
        neutral: function () { // tongue out
            line(-3, 0, 3, 0);
            rect(1, 1.5, 2, 3, 0, 0, 1, 1);
        },
        squished: function () { // vertical mouth open
            rect(0, 0, 2, 4, 1);
        }
    },
    5: {
        neutral: function () { // uneasy
            beginShape();
            vertex(-3, 0.5);
            vertex(-1.5, -0.5);
            vertex(-0, 0.5);
            vertex(1.5, -0.5);
            vertex(3, 0.5);
            endShape();
        },
        squished: function () { // grimacing
            rect(0, 0, 6, 2, 1);
            line(-1, -1, -1, 1);
            line(1, -1, 1, 1);
        }
    },
}
let hairIndex = {
    0: function () { // block
        rect(0,0,15,5);
    },
    1: function () { // diagonal rounded
        rect(0,0,15,5,0,5,0,5);
    },
    2: function () { // top rounded
        rect(0,0,15,5,5,5,0,0);
    },
    3: function () { // spiky
        beginShape();
        vertex(-7.5,2.5);
        vertex(-7.5,0);
        vertex(-6,-2.5);
        vertex(-4.5,0);
        vertex(-3,-2.5);
        vertex(-1.5,0);
        vertex(0,-2.5);
        vertex(1.5,0);
        vertex(3,-2.5);
        vertex(4.5,0);
        vertex(6,-2.5);
        vertex(7.5,0);
        vertex(7.5,2.5);
        endShape(CLOSE);
    },
    4: function () { // left rounded
        beginShape();
        vertex(-5,2.5);
        vertex(7.5,2.5);
        vertex(7.5,-2.5);
        vertex(-5,-2.5);
        endShape();
        arc(-5,0,5,5,90,270)
    },
    5: function () { // bumpy
        beginShape();
        vertex(-7.5,0);
        vertex(-7.5,2.5);
        vertex(7.5,2.5);
        vertex(7.5,0);
        endShape();
        arc(-5.625,0,3.75,5,180,360);
        arc(-1.875,0,3.75,5,180,360);
        arc(1.875,0,3.75,5,180,360);
        arc(5.625,0,3.75,5,180,360);
    },
    6: function () { // side part
        push();
        noStroke();
        rect(1.25,0,12.5,2.5)
        rect(5,2.5,5,2.5)
        pop();

        arc(-5,-1.25,5,5,90,180);
        arc(2.5,1.25,5,5,90,180);
        line(-5,1.25,0,1.25);
        line(2.5,3.75,7.5,3.75);
        line(7.5,-2.5,7.5,3.75);

        beginShape();
        vertex(-7.5,-1.25);
        vertex(-7.5,-2.5);
        vertex(7.5,-2.5);
        vertex(7.5,-1.25);
        endShape();
    },
    7: function () { // buzzcut
        let totalLines = 11;
        for (let i = 0; i < totalLines; i++) {
            let lineX = map(i,0,totalLines-1,-7.5,7.5);
            line(lineX,-1.25,lineX,1.25);
        }
        line(-7.5,0,7.5,0);
    },
    8: function () { // middle part
        beginShape();
        vertex(-7.5,-2.5);
        vertex(7.5,-2.5);
        vertex(7.5,3.75);
        vertex(5,1.25);
        vertex(-5,1.25);
        vertex(-7.5,3.75);
        endShape();
    }
}
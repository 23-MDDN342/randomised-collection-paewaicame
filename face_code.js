/*
* This file should contain code that draws your faces.
*
* Each function takes parameters and draws a face that is within
* the bounding box (-10, -10) to (10, 10).
*
* These functions are used by your final arrangement of faces as well as the face editor.
*/
function createFace() {
    let skintonesImageWidth = skintonesImage.width;
    let skintonesImageHeight = skintonesImage.height;
    let skintonesImageX = random(0,skintonesImageWidth);
    let skintonesImageY = random(0,skintonesImageHeight);
    let skintonesSelected = skintonesImage.get(skintonesImageX,skintonesImageY);
    faceArray.push(
        {
            skintone: skintonesSelected
        }
    )
}
function drawFace(face) {
    noStroke();
    fill(face.skintone);
    rect(-10,-10,20,20);
}
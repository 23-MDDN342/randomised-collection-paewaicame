# MDDN 342 Assignment 2: Randomised Collections
### Cameron Paewai

## Introduction
My project for Randomised Collections is a grid of characters that expands and compresses, squishing the 

I was inspired by the works of Geoff McFetridge who designed a digital watch face for the Apple Watch. The watch face changes throughout the day, displaying a minimalist figure with changing facial features and colours throughout the day. I also took further inspiration from postmodernist graphic design and minimalist line art.

## Development
I began with sketching out a variety of facial expressions and taking them into Affinity Designer to work on them further. I designed sets of eyes, noses, mouths, and hair styles to decorate the faces, as well as colour gradients that would dictate the skin tones and hair colour. This process made it quicker to iterate through designs, create lots of variation, and finalise my work before taking it to my code.

## Face Generation
The skin tone and hair colour is chosen based on image palettes. The skin tone has a combination of vibrant warm and cool colours, as well as more standard skin tones. A random position is chosen from each image, and the resulting colours are sampled and stored within `skintonesSelected` and `hairtonesSelected`. These colours are later used as fill colours for the skin and hair. This allowed me to use gradients to create a range of possible colours and therefore more variation, rather than a single array of palettes.

### Random Weighted Selection
There is a fixed sixty-percent chance that any given face will have hair, with nine different hair styles that are chosen from when generated. The result is a weighted selection where there are two discrete choices with a bias, resulting in a unique proportion of faces with hair to bald faces.

### Random Gaussian Selection
There are three kinds of eyes, eleven kinds of noses, and six kinds of mouths that are chosen for each individual face and drawn in specific locations. Each is stored in an index of functions that are called each time the facial feature needs to be drawn.

Each of these features also have their own scale factor that uses an averaged random to produce mostly small variations in size, with the occasional chance of extreme sizes. The eyes use an additional averaged random to control interpupillary distance, resulting in mostly normal eye distances, with the occasional change of very wide or very narrow eye distances.

### Stroke Width
When using `scale()` to make facial features larger or smaller, the stroke width changes too, resulting in inconsistent stroke widths for each facial feature. By setting the stroke width inversely proportional to the size of the facial feature, keeping the stroke proportions consistent and adding to the claustrophobic feeling of the squish animation.

## Squishing
Near the end of the project, I had the idea to animate my collection of faces through adjusting each face's width and height, creating more expressive and dynamic faces.

The randomised collection of faces grows and shrinks over time, squishing the faces closer together. The facial features become more intense, expressing more joy or anguish as they become squished and unsquished. The squish is stored in the `squishFactor` variable and is modulated overtime using the `millis()` function. The number oscillates between -1 and 1, similar to a sine wave, only with flatter peaks and stronger transitions to make the animation linger on the squished or unsquished state.

Over the course of the squish, the grid of faces is compressed, exposing more faces outside the bounds of the canvas. Each face's eyes become closer together, and both the eyes and mouth move closer to the nose, shrinking the facial features. The stroke width is also marginally decreased when the faces are squished to preserve legibility.

### Conditional Randomness
Eyes are stored in pairs containing a "neutral" and "squished" state. Most kinds of eyes will become wider when squished. On the condition that the single-dot eyes are randomly selected, there are two further states that are randomly selected when the face is squished, one with a wide-eyed expression, and one with a closed-eye expression. This results in a finer control over the variety within particular random states. The mouths also have two states, the squished state portraying a more surprised expression over the neutral one.

Each face has an additional "squish tolerance" and a random number between -0.9 and 0. If `squishFactor` is below this number, the face will change it's expression. This causes the faces to change asynchronously throughout the squishing animation rather than all at once.

## ChatGPT
I did not end up using ChatGPT or other LLMs in my project as the code framework was mostly already supplied to me, and all I needed to do was modify it. Most of my work was done designing the characters and faces, which I did not need ChatGPT to help with.
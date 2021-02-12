/*     ~~~ Your Flower ~~~
 * author: Jan Rychlý
 * controlls: s ... save frame
 * 
 * project notes on notion:
 * https://www.notion.so/GDP-Final-Project-b452b25e336e4f348264c84f61137a7d
 */
const size = 800;

let flower;
let kind = 0;
const kindStrings = ["Rose", "Daisy", "Maurer"];
let moodSlider;
let flowerKindButton;

/* SETUP */
function setup() {
    createCanvas(size, size).parent('flower_canvas');

    colorMode(HSB, 360, 100, 100, 100);
    noStroke();

    flowerKindButton = createButton('kind: ' + kindStrings[kind]).mousePressed(() => {
        kind = (kind + 1) % 3;
        genNewFlower();
        flowerKindButton.elt.firstChild.nodeValue = 'kind: ' + kindStrings[kind];
    }).parent('controls');

    let cb = createButton('Anotha!').mousePressed(() => {
        genNewFlower();
    }).parent('controls');

    moodSlider = createSlider(0, 1, 0.3, 0.05);
    moodSlider.parent('controls');

    genNewFlower();

    frameRate(10);
}


/* DRAW */
function draw() {
    background(0);

    if (flower) {
        translate(width / 2, height / 2);
        flower.draw();
    }
}


function genNewFlower() {
    randomSeed(frameCount * 42 + Date.now());
    flower = new Flower(kind, random(10000), random(10000), random(10000), moodSlider);
}

function keyPressed() {
    if (key == 's' || key == 'S') {
        saveCanvas('just_a_flower_.png');
    }
}


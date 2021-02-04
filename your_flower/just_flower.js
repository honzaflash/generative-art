/*     ~~~ Your Flower ~~~
 * author: Jan Rychlý
 * controlls: s ... save frame
 * 
 * project notes on notion:
 * https://www.notion.so/GDP-Final-Project-b452b25e336e4f348264c84f61137a7d
 */
const size = 800;

let flower;
let kind = 1;
let moodSlider;
let flowerKindButton;

/* SETUP */
function setup() {
    createCanvas(size, size).parent('flower_canvas');

    colorMode(HSB, 360, 100, 100, 100);
    noStroke();

    flowerKindButton = createButton('kind: ' + kind).mousePressed(() => {
        kind = (kind + 1) % 3;
        genNewFlower();
        flowerKindButton.elt.firstChild.nodeValue = 'kind: ' + kind;
    });

    createButton('Anotha one').mousePressed(() => {
        genNewFlower();
    })

    moodSlider = createSlider(0, 1, 0.5, 0.05);

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


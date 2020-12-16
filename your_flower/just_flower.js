/*     ~~~ Your Flower ~~~
 * author: Jan Rychlý
 * controlls: s ... save frame
 *            f ... freeze tracking
 *            t ... toggle webcam tracker 
 * 
 * project notes on notion:
 * https://www.notion.so/GDP-Final-Project-b452b25e336e4f348264c84f61137a7d
 */
const size = 800;

let showingTracking = true;
let capture;
let tracker;
let positions;
let userImage;
let generateFlower = false;

let flower;


/* SETUP */
function setup() {
  createCanvas(size, size).parent('flower_canvas');

  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  flower = new Flower();

  frameRate(30);
}


/* DRAW */
function draw() {
  background(220, 40, 10);

  if (flower) {
    translate(width / 2, height / 2);
    flower.draw();
  }
}



function keyPressed() {
  if (key == 's' || key == 'S') {
    saveCanvas('patern_clock.png');
  }
  if (key == 't' || key == 'T') {
    showingTracking = !showingTracking;
  }
  if (key == 'f' || key == 'F') {
    flower = new Flower(positions, capture);
  }
}


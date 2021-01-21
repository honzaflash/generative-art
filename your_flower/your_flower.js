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
let pos; // positions
let faceScale;
let userImage;

let presentationMode = false;

let flower;


/* SETUP */
function setup() {
  createCanvas(size, size).parent('flower_canvas');

  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();

  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);

  frameRate(30);

  // testing
  moodSlider = createSlider(0, 1, 0.5, 0.1)
  flower = new Flower(0, 20, 5, 7, moodSlider);
}


/* DRAW */
function draw() {
  background(0);
  
  // let newPositions = tracker.getCurrentPosition();
  // if(newPositions) {
  //   pos = newPositions;
  //   faceScale = abs(pos[1][0] - pos[13][0]) / capture.width; // TODO account for face tilt
  // } else {
    
  // }
  // if (showingTracking) showTracking(0.4);
  // if (!pos) return;

  if (flower) {
    translate(width / 2, height / 2);
    flower.draw();
  }
}


function showTracking(scl) {
  push();

  if (presentationMode) {
    scale(1.25);
    image(capture, 0, 0);
    return;
  }

  scale(scl);

  image(capture, 0, 0);
  
  if (!pos) {
    fill(100, 100, 85, 60);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(capture.width * 0.1);
    text("can't find you :(", capture.width/2, capture.height/2);
    return;
  }

  // face area
  beginShape();
  fill(100, 100, 100, 30);
  stroke(100, 100, 100);
  for (let i = 0; i < 19; i++) {
    vertex(pos[i][0], pos[i][1]);
  }
  for (let i = 22; i >= 19; i--) {
    vertex(pos[i][0], pos[i][1]);
  }
  endShape(CLOSE);

  // mouth area
  beginShape();
  let mouthPts = [44, 56, 57, 58, 50, 59, 60, 61];
  fill(50, 100, 100, 30);
  stroke(50, 100, 10);
  mouthPts.forEach(pt => {
    vertex(pos[pt][0], pos[pt][1]);
  });
  endShape(CLOSE);

  // pupils
  circle(pos[27][0], pos[27][1], pos[24][1] - pos[26][1]);
  circle(pos[32][0], pos[32][1], pos[31][1] - pos[29][1]);

  pop();
}



function keyPressed() {
  if (key == 's' || key == 'S') {
    saveCanvas('my_flower.png');
  }
  if (key == 't' || key == 'T') {
    showingTracking = !showingTracking;
  }
  if (key == 'f' || key == 'F') {
    flower = new Flower(0, 10, 5, 7, 0.5);
  }
  if (key == 'p' || key == 'P') {
    presentationMode = !presentationMode;
  }
}


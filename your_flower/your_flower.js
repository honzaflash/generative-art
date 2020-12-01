/*     ~~~ Your Flower ~~~
 * author: Jan Rychlý
 * controlls: s ... save frame
 *            t ... toggle webcam tracker 
 * 
 * project notes on notion:
 * https://www.notion.so/GDP-Final-Project-b452b25e336e4f348264c84f61137a7d
 */
let size = 800;

let showingTracking = true; //
let capture;
let tracker;
let positions;


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
}


/* DRAW */
function draw() {
  background(220, 40, 10);
  
  positions = tracker.getCurrentPosition();
  if (showingTracking) showTracking(0.4);

  if (!positions) return;

  // generate flower here
}


function showTracking(scl) {
  scale(scl);
  
  image(capture, 0, 0);
  
  if (!positions) {
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
    vertex(positions[i][0], positions[i][1]);
  }
  for (let i = 22; i >= 19; i--) {
    vertex(positions[i][0], positions[i][1]);
  }
  endShape(CLOSE);

  // mouth area
  beginShape();
  let mouthPts = [44, 56, 57, 58, 50, 59, 60, 61];
  fill(50, 100, 100, 30);
  stroke(50, 100, 10);
  mouthPts.forEach(pt => {
    vertex(positions[pt][0], positions[pt][1]);
  });
  endShape(CLOSE);

  // eyeballs
  circle(positions[27][0], positions[27][1], positions[24][1] - positions[26][1]);
  circle(positions[32][0], positions[32][1], positions[31][1] - positions[29][1]);

  // all points
  // positions.forEach(pos => {
  //   fill(100, 100, 100);
  //   circle(pos[0], pos[1], 3);
  // });
}



function keyPressed() {
  if (key == 's' || key == 'S') {
    saveCanvas('patern_clock.png');
  }
  if (key == 't' || key == 'T') {
    showingTracking = !showingTracking;
  }
}


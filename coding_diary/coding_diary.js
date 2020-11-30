/*
 * author: Jan Rychlý
 *
 * a 20 minute coding challenge
 * show what your week was like
 * 
 * controlls: s ..... save frame
 *            r ..... catch up with all the work
 */


let position = 0;
let counter = 1;

/* SETUP */
function setup() {
  createCanvas(720, 720).parent('clock_canvas');
  colorMode(HSB, 360, 100, 100, 100);
  background(33);

  frameRate(30);
}




/* DRAW */
function draw() {

  background((frameCount / 2 % 360), 90, 90, 30);
  noStroke();
  fill(100);
  ellipse(position, height/2, 50);
  position = (position + 20) % width;

  let x = -1;
  let y = 0;
  for (let i = 0; i < counter / 3; i++) {
    x++;
    if (i * 20 % 720 == 0) {
      x = 0;
      y++;
    }
    fill(0);
    rect(20 * x, height - 20 * y, 20, 20);
  }
  counter++;
}



function keyPressed() {
  if (key == 's' || key == 'S') {
    saveCanvas('honza_rychly_diary_.png');
  }
  if (key == 'r' || key == 'R') {
    counter = 1;
  }
}

/*              ~~~ Pattern Colck ~~~
 * author: Jan Rychlý
 * controlls: s ... save frame
 *            r ... generate new pattern
 *            c ... change mode / switch between them
 *            1 ... set mode 1 - showing time
 *            2 ... set mode 2 - not showing time
 * 
 * same script should be hosted here:
 * https://www.fi.muni.cz/~xrychly3/gen_design/pattern_clock.html
 */

let cellContent = {};
let orientations = {};
let mode = 0;


/* SETUP */
function setup() {
  createCanvas(720, 720).parent('clock_canvas');
  colorMode(HSB, 360, 100, 100, 100);
  strokeCap(SQUARE);
  noStroke();
  frameRate(10);
}


/* DRAW */
function draw() {
  background(220, 40, 35);

  gridDraw(0, width / 5);
}


/* artsy pattern clock that shows the time */
function clocky(x, y) {

  // generate positions and orientations if there are none saved
  if (cellContent[[x,y]] == null) {
    console.log("[", x, "; ", y, "] assigned");
    // chance of leaving empty space
    cellContent[[x,y]] = random([0, 0, 1, 2, 2, 3, 3, 3]);
  }

  let shadX = 3;
  let shadY = 6; // shodow offset and color
  let shadColor = color(233, 20, 15, 50)
  { // clock faces
    let clockR = 35;
    let strokeC; // stroke color for digit marks
    
    fill(shadColor);
    ellipse(x + 3, y + 6, clockR * 2, clockR * 2);

    if (!cellContent[[x,y]]) {          // empty face
      fill(220, 15, 50);
      strokeC = color(220, 20, 45);
    }
    else if (cellContent[[x,y]] == 1) {      // hours face
      fill(199, 25, 95);
      strokeC = color(211, 18, 48);
    }
    else if (cellContent[[x,y]] == 2) { // minutes face
      fill(40, 25, 95);
      strokeC = color(36, 10, 48);
    }
    else {                              // seconds face
      fill(350, 25, 95);
      strokeC = color(282, 10, 48);
    }
    ellipse(x, y, clockR * 2, clockR * 2);

    // digit marks
    stroke(strokeC);
    strokeWeight(2);
    fan(x, y, clockR + 8, clockR + 5, 12);
    strokeWeight(2.5);
    fan(x, y, clockR + 10, clockR + 5, 4);
    noStroke();
  }

  if (!cellContent[[x,y]]) {                    // empty
    return;
  }
  if (cellContent[[x,y]] == 1) {                // hour arrow
    let hrRot = map(hour() % 12, 0, 12, 0, 1);
    fill(shadColor);
    arrow(x + shadX, y + shadY, hrRot);
    fill(199, 65, 96);
    arrow(x, y, hrRot);
  }
  else if (cellContent[[x,y]] == 2) {           // minutes arrow
    let minRot = map(minute(), 0, 60, 0, 1);
    fill(shadColor);
    arrow(x + shadX, y + shadY, minRot);
    fill(40, 66, 100);
    arrow(x, y, minRot);
  }
  else {                                        // seconds arrow
    let secRot = map(second(), 0, 60, 0, 1);
    fill(shadColor);
    arrow(x + shadX, y + shadY, secRot);
    fill(350, 72, 96); // red crayola - 343, 94, 100);
    arrow(x, y, secRot);
  }
}


/* arrow pattern art without displaying time */
function diagonal(x, y) {

  // generate positions and orientations if there are none saved
  if (cellContent[[x,y]] == null) {
    console.log("[", x, "; ", y, "] assigned");
    // chance of leaving empty space
    cellContent[[x,y]] = random([0, 0, 1, 2, 2, 3, 3, 3]);
  }
  if (!Object.keys(orientations).length) {
      orientations = { 'red': int(random(8))
                     , 'blue': int(random(8))
                     , 'yellow': int(random(8)) }
  }

  let shadX = 3;
  let shadY = 6;
  let shadColor = color(233, 20, 15, 50)
  // circles
  {
    let clockR = 35;
    fill(shadColor);
    ellipse(x + shadX, y + shadY, clockR * 2, clockR * 2);
    if (!cellContent[[x,y]]) {               // empty
      fill(220, 15, 50);
    }
    else if (cellContent[[x,y]] == 1) {      // blue
      fill(199, 25, 95);
    }
    else if (cellContent[[x,y]] == 2) {      // yellow
      fill(40, 25, 95);
    }
    else {                                   // red
      fill(350, 25, 95);
    }
    ellipse(x, y, clockR * 2, clockR * 2);
  }

  // arrows
  if (!cellContent[[x,y]]) {                    // empty
    return;
  }
  if (cellContent[[x,y]] == 1) {                // blue arrow
    fill(shadColor);
    arrow(x + shadX, y + shadY, orientations['blue']/8);
    fill(199, 65, 96);
    arrow(x, y, orientations['blue']/8);
  }
  else if (cellContent[[x,y]] == 2) {           // yellow arrow
    fill(shadColor);
    arrow(x + shadX, y + shadY, orientations['yellow']/8);
    fill(40, 66, 100);
    arrow(x, y, orientations['yellow']/8);
  }
  else {                                        // red arrow
    fill(shadColor);
    arrow(x + shadX, y + shadY, orientations['red']/8);
    fill(350, 72, 96); // red crayola - 343, 94, 100);
    arrow(x, y, orientations['red']/8);
  }
}


/* draws the grid cell based on sellected mode */
function cellDraw(x, y) {
  if (mode == 1) {
    diagonal(x, y);
  }
  else {
    clocky(x, y);
  }
}


/* draws stuff in a grid */
function gridDraw(offset, cellSize) {
  for (y = offset; y < width; y += cellSize) {
    for (x = offset; x < height; x += cellSize) {
      cellDraw(x + cellSize / 2, y + cellSize / 2);
    }
  }
}


/* draws an arrow with its center in ['x'; 'y']
 * rotated around by 'rot' * 2 * PI          */ 
function arrow(x, y, rot) {
  let tipLenght = 40;
  let tipWidth = 37;
  let totalLength = 95;
  let lineWidth = 15;
  translate(x, y);
  rotate(TWO_PI * rot);
  beginShape();
  vertex(             0, - totalLength / 2);
  vertex( -tipWidth / 2, tipLenght - totalLength / 2);
  vertex(-lineWidth / 2, tipLenght - totalLength / 2);
  vertex(-lineWidth / 2, totalLength - totalLength / 2);
  vertex( lineWidth / 2, totalLength - totalLength / 2);
  vertex( lineWidth / 2, tipLenght - totalLength / 2);
  vertex(  tipWidth / 2, tipLenght - totalLength / 2);
  endShape(CLOSE);
  rotate(-TWO_PI * rot);
  translate(-x, -y);
}


/* draw 'count' fanned lines evenly around a circle */
function fan(x, y, inner_r, outter_r, count) {
  translate(x, y);
  for (i = 0; i < count; i++) {
    line(0, inner_r, 0, outter_r);
    rotate(TWO_PI / count);
  }
  translate(-x, -y);
}


function keyPressed() {
  if (key == 'r' || key == 'R') {
    cellContent = {};
    orientations = {};
  }
  else if (key == 'c' || key == 'C') {
    mode = (mode + 1) % 2;
  }
  else if (key == '1') {
    mode = 0;
  }
  else if (key == '2') {
    mode = 1;
  }
  else if (key == 's' || key == 'S') {
    saveCanvas('patern_clock.png');
  }
}


/*        ~~~ Abstract Clock ~~~
 *
 * author: Jan Rychlý
 *
 * creative constraints: 
 *  - Oscilate - two circles in the second "hand" oscilate
 *  - Work only with lines - didn't use only 'line()'
 *    but I worked without fills
 *  - The whole as an addition of parts - it kinda comes naturally
 *    when you work just with lines - every hand consists of
 *    several line elements and they all intersect and compliment
 *    each other as the clock ticks
 * 
 * 
 * controlls: s ..... save frame
 *            t ..... toggle time stamp on/off
 *            b ..... toggle background on/off
 *            m ..... switch between modes 1-3
 *            1-5 ... set mode
 * modes: 1 - circle chaos background
 *        2 - long lasting trails (lightest blend mode)
 *        3 - stars background
 *        4 - controll hands with mouse
 *        5 - static with all hands alligned
 */

let radius = 300;

let userLatitude;
let userLongitude;
let times = SunCalc.getTimes(NaN, NaN, NaN);
let mode = 2;
let timeStamp = false;
let bg = false;


/* SETUP */
function setup() {
  getLocation(); // is executed in paralel
  createCanvas(radius * 3, radius * 3).parent('clock_canvas');
  colorMode(HSB, 360, 100, 100, 100);
  background(33);

  frameRate(15);
}


/* DRAW */
function draw() {

  translate(width/2, height/2);
  noFill();

  drawBackground();

  showNight();

  showDigitMarks();
  
  showHr();
  showMin();
  showSec();

  showDate();

  // digital clock water mark
  if (timeStamp) {
    noStroke();
    fill(80);
    textSize(height * 0.04);
    text(nf(hour(), 2) + ":" + nf(minute(), 2) + ":" + nf(second(), 2), -width * 0.485, height * 0.43);
  }
}


/* draw date bars at the bottom of canvas
 * grouped for easier counting */
function showDate() {
  push();
  translate(-width * 0.48, height * 0.48);
  
  let today = new Date();
  let barX = 0;
  stroke(210, 92, 30);
  strokeWeight(radius * 0.03);
  for (m = 0; m < today.getMonth() + 1; m++, barX += width / 25) {
    if (m == 6) {
      barX += width / 25;
    }
    line(barX, 0, barX, -radius * 0.07);
  }
  let barY = 0;
  for (m = 0; m < today.getDate(); m++, barX += width / 42) {
    if (m % 5 == 0) {
      barX += width / 42;
    }
    if (m == 15) {
      barY = -radius * 0.06;
      barX -= 18 * width / 42; 
    }
    line(barX, 0 + barY, barX, -radius * 0.01 + barY);
  }
  pop();
}


function showHr() {
  // moves every 12 minutes (by 60th of the arc) => 1 hr = 5 segments
  hr = map((hour() % 12) * 5 + int(minute() / 12), 0, 12 * 5, 0, TWO_PI);
  if (mode == 3 || mode == 4) {
    hr = 0;
  }

  rotate(hr);

  stroke(60, 50, 92);
  strokeWeight(radius / 50);
  ellipse(0, -radius * 0.7, radius * 0.1);
  ellipse(0, -radius * 0.6, radius * 0.01);
  
  stroke(60, 30, 95);
  strokeWeight(radius / 60);
  ellipse(0, -radius * 0.82, radius * 0.01); // the tip
  strokeWeight(radius / 90);
  ellipse(0, -radius * 0.55, radius * 0.03);
  strokeWeight(radius / 150);
  ellipse(0, -radius * 0.5, radius * 0.01);
  ellipse(0, -radius * 0.7, radius * 0.15);
  ellipse(0, -radius * 0.55, radius * 0.1);

  rotate(-hr);
}


function showMin() {
  mn = map(minute(), 0, 60, 0, TWO_PI);
  if (mode == 3) {
    mn = map(int(map(mouseX, 0, width, 0, 60)), 0, 60, 0, TWO_PI);
  }
  if (mode == 4) {
    mn = 0;
  }
  rotate(mn);
  
  
  stroke(90, 50, 83);
  strokeWeight(radius / 70);
  ellipse(0, 0, radius * 0.1);
  arc(0, -radius * 0.25, radius * 0.75, radius * 0.75 , -PI/2 - 0.1, -PI/2 + 0.1);
  arc(0, radius * 0.15, radius * 1.1, radius * 1.1, -PI/2 - 0.2, -PI/2 + 0.1);
  ellipse(radius * 0.081, -radius * 0.393, radius * 0.04);
  arc(0, 0, radius * 0.6,radius * 0.6, -PI/2 - 0.2, -PI/2 + 0.2);
  stroke(90, 55, 85);
  line(0, -radius * 0.05, 0, -radius * 0.66);
  stroke(90, 60, 87);
  ellipse(0, -radius * 0.7, radius * 0.07);
  
  rotate(-mn);
}


function showSec() {
  sec = map(second(), 0, 60, 0, TWO_PI);
  if (mode == 3) {
    sec = map(int(map(mouseY, 0, height, 0, 60)), 0, 60, 0, TWO_PI);
  }
  if (mode == 4) {
    sec = 0;
  }
  rotate(sec);

  stroke(165, 55, 89);
  if (mode == 1) {
    stroke(165, 95, 97);
  }
  strokeWeight(radius / 150);
  ellipse(0, 0, 4)
  line(0, 0, 0, -radius * 0.64);
  arc(0, -radius * 0.7, radius * 0.12, radius * 0.12, PI/2 - 0.6, PI/2 + 0.6)
  ellipse(0, -radius * 0.7, radius * 0.03); // tiny tip circle
  line(0, -radius * 0.76, 0, -radius * 0.9);
  
  stroke(165, 43, 84);
  if (mode == 1) {
    stroke(165, 95, 97);
  }
  ellipse(0, radius * 0.15, radius * 1); // big static circle
  ellipse(0, radius * -cos(sec) * 0.15, radius * 0.6); // big moving circle
  strokeWeight(radius / 100);
  ellipse(0, radius * (cos(sec) * 0.325 + 0.075), radius * 0.12); // small moving circle

  rotate(-sec);
}

function showDigitMarks() {
  stroke(23, 30, 100);
  strokeWeight(radius / 150);
  fan(0, 0, radius * 0.98, radius * 1.03, 60);
  
  stroke(11, 50, 100);
  strokeWeight(radius / 60);
  fan(0, 0, radius * 0.95, radius * 1.05, 12);
}


// this will not work properly in places near the poles but oh well lol
function showNight() {
  
  if (!times.sunset.getHours() || (hour() == 0 && minute() == 0 && second() == 0)) {
    times = SunCalc.getTimes(Date.now(), userLatitude, userLongitude);
  }

  let from;
  let to;  
  if (hour() < 12) {
    from = -PI/2; // 00:00
    to = map((times.sunrise.getHours() % 12) * 60 +
             times.sunrise.getMinutes(), 0, 12 * 60,
             -PI/2, PI * 3/2) ; // sunrise
  }
  else {
    from = map((times.sunset.getHours() % 12) * 60 +
               times.sunset.getMinutes(), 0, 12 * 60,
               -PI/2, PI * 3/2) ; // sunset
    to = -PI/2; // 24:00
  }
  blendMode(LIGHTEST);
  stroke(210, 93, 29);
  strokeWeight(radius * 0.07);
  arc(0, 0, radius * 1.64, radius * 1.64, from, to);
  if (mode != 1) {
    blendMode(BLEND);
  }
}

/* draws random generated sircles or stars,
 * using 'minute()' as the seed */
function backgroundSystems() {
  if (!bg) {
    return;
  }
  blendMode(LIGHTEST);
  randomSeed(minute());
  for (let i = 0; i < 100; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);

    if (mode == 2) { // stars
      stroke(random(30, 70));
      strokeWeight(radius * random(1,2) / 150);
      ellipse(x, y, 0.5);
      continue;
    } // circle chaos
    stroke(210, 30, random(5, 30));
    strokeWeight(radius / 300);
    ellipse(x, y, radius * 2);
  }
  blendMode(BLEND);
}


function drawBackground() {
  if (mode == 1 && second() != 0) {
    background(40, 40, 5, 40);
    backgroundSystems();
    blendMode(LIGHTEST);
    return;
  }
  blendMode(BLEND);
  background(40, 40, 5, 20);
  backgroundSystems();
}


/* draw 'count' fanned lines evenly around a circle */
function fan(x, y, inner_r, outter_r, count) {
  translate(x, y);
  for (i = 0; i < count; i++) {
    line(0, inner_r, 0, outter_r);
    rotate(TWO_PI / count);
  }
}


function keyPressed() {
  if (key == 't' || key == 'T') {
    timeStamp = !timeStamp;
  }

  if (key == 'b' || key == 'B') {
    bg = !bg;
  }

  else if (key == 's' || key == 'S') {
    saveCanvas('circle_clock_.png');
  }

  if (key == 'm' || key == 'M') {
    console.log("changing mode: ", mode + 1, " -> ", (mode + 1) % 3 + 1);
    mode = (mode + 1) % 3;
  }

  if ('1' <= key && key <= '4') {
    console.log("changing mode: ", mode + 1, " -> ", key);
    mode = int(key) - 1;
  }
}


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(savePosition);
  } else {
    userLatitude = 49.2;
    userLongitude = 16.6;
  }
}

function savePosition(pos) {
  userLatitude = pos.coords.latitude;
  userLongitude = pos.coords.longitude;
  console.log(userLatitude, userLongitude);
}

/*      ~~~~ Force Brush ~~~~
 * Author: Jan Rychly
 * 
 * controlls:
 *  mouse
 *    click left MB (and drag) to repell surrounding particles
 *    click middle MB to gather all particles around the cursor
 *    scroll to change the brush size
 *  keyboard
 *    C     to clear screen
 *    S     to save current frame
 *    R     to toggle brush size circle (sadly it leaves trails behind)
 *    B     to toggle bound reflection / loop around
 *    j/k   to decrese/increse force field strength
 *    h/l   to decrese/increse brush strength (strength of the repelling force)
 
 * Used reference: https://github.com/daneden/processing-flow-field
 */


float MAX_SPEED = 10;
float DECELERATION = 0.92;

float brushRadius = 100;
boolean showBrushRadius = false;
float brushStrength = 4;
boolean brushActive = false;

float forceFieldStrength = 0;

boolean BOUND_REFLECT = false;

int PARTICLE_COUNT = 400;
float PARTICLE_SIZE = 3;
color PARTICLE_COLOR = color(80, 98, 100);

Particle[] pts = new Particle[PARTICLE_COUNT];


void setup() {
  colorMode(HSB, 360, 100, 100, 100);
  frameRate(30);
  size(1000, 1000);
  
  noStroke();
  fill(0);
  rect(0, 0, width, height);
  
  for (int i = 0; i < PARTICLE_COUNT; i++) {
    pts[i] = new Particle();
  }
}

void draw() {
  if (frameCount % 5 == 0) {
    noStroke();
    fill(0, 5);
    rect(0, 0, width, height);
  }
  
  for (int i = 0; i < PARTICLE_COUNT; i++) {
    pts[i].update();
    pts[i].show();
  }
  
  if (showBrushRadius) {
    noFill();
    strokeWeight(2);
    stroke(0, 0, 100);
    circle(mouseX, mouseY, brushRadius * 2);
  }
}



class Particle {
  PVector pos = new PVector(randomGaussian() * width * 0.2 + width / 2,
                            randomGaussian() * height * 0.2 + height / 2);
  PVector vel = new PVector(0,0);
  PVector acc = new PVector(0,0);

  public void update() {
    react();
    vel.add(acc);
    vel.limit(MAX_SPEED);
    bounds();
    pos.add(vel);
    
    vel.mult(DECELERATION);
    acc.mult(0);
  }

  public void react() {
    PVector mouseDist = PVector.sub(pos, new PVector(mouseX, mouseY));
    if (brushActive && mouseDist.mag() < brushRadius && mouseDist.mag() != 0) {
      mouseDist.setMag(1 / mouseDist.mag() - 1 / brushRadius);
      mouseDist.mult(brushStrength * MAX_SPEED);
      applyForce(mouseDist);
    }
    float fieldScale = 0.008;
    applyForce(PVector.fromAngle(noise(pos.x * fieldScale, pos.y * fieldScale, frameCount * 0.005) * 1.6 * TWO_PI).setMag(forceFieldStrength));
  }

  void applyForce(PVector force) {
    acc.add(force);
  }

  public void show() {
    noFill();
    stroke(hue(PARTICLE_COLOR) - vel.mag() * 5,
           40 + vel.mag() * 7,
           100);
    strokeWeight(PARTICLE_SIZE);
    point(pos.x, pos.y);
  }

  public void bounds() {
    if (BOUND_REFLECT) {
      if (pos.x > width || pos.x < 0) {
        vel.set(-vel.x, vel.y);
      }
      if (pos.y > height || pos.y < 0) {
        vel.set(vel.x, -vel.y);
      }
    } else {
      if (pos.x > width) {
        pos.x = 0;
      }
      if (pos.x < 0) {
        pos.x = width;
      }
  
      if (pos.y > height) {
        pos.y = 0;
      }
      if (pos.y < 0) {
        pos.y = height;
      }
    }
  }
  
}


void keyPressed() {
  if (key == 's' || key == 'S') {
    saveFrame("Force_Brush_####.png");
  }
  
  if (key == 'r' || key == 'R') {
    showBrushRadius = !showBrushRadius;
  }
  
  if (key == 'c' || key == 'C') {
    noStroke();
    fill(0);
    rect(0, 0, width, height);
  }
  
  if (key == 'k' || key == 'K') {
    forceFieldStrength += 0.1;
        
    noStroke();
    fill(0);
    float hg = 20;
    rect(0, height - hg - 5, 0 + 250, height - 5);
    fill(250);
    textSize(hg);
    text("force field strength: " + forceFieldStrength, 0, height - 5);
  }
  if (key == 'j' || key == 'J') {
    forceFieldStrength -= 0.1;
    if (forceFieldStrength < 0) {
      forceFieldStrength = 0;
    }
            
    noStroke();
    fill(0);
    float hg = 20;
    rect(0, height - hg - 5, 0 + 250, height - 5);
    fill(250);
    textSize(hg);
    text("force field strength: " + forceFieldStrength, 0, height - 5);
  }
  
  if (key == 'l' || key == 'L') {
    brushStrength += 0.25;
    
    noStroke();
    fill(0);
    float hg = 20;
    rect(0, height - hg - 5, 0 + 220, height - 5);
    fill(250);
    textSize(hg);
    text("brush strength: " + brushStrength, 0, height - 5);
  }
  if (key == 'h' || key == 'H') {
    brushStrength -= 0.25;
    if (brushStrength < 0) {
      brushStrength = 0;
    }
    
    noStroke();
    fill(0);
    float hg = 20;
    rect(0, height - hg - 5, 0 + 220, height - 5);
    fill(250);
    textSize(hg);
    text("brush strength: " + brushStrength, 0, height - 5);
  }
  
  if (key == 'b' || key == 'B') {
    BOUND_REFLECT = !BOUND_REFLECT;
  }
  //if (key == '' || key == '') {
  //}
}

void mouseClicked() {
  if (mouseButton == CENTER) {
    for (int i = 0; i < PARTICLE_COUNT; i++) {
      pts[i].pos.set(randomGaussian() * 10 + mouseX,
                     randomGaussian() * 10 + mouseY);
    }
  }
}

void mousePressed() {
  if (mouseButton == LEFT) {
    brushActive = true;
  }
}

void mouseReleased() {
  if (mouseButton == LEFT) {
    brushActive = false;
  }
}

void mouseWheel(MouseEvent event) {
  brushRadius -= 5 * event.getCount();
  if (brushRadius < 0) {
    brushRadius = 0;
  }
  noFill();
  strokeWeight(2);
  stroke(0, 0, 100);
  circle(mouseX, mouseY, brushRadius * 2);
  println(brushRadius);
}

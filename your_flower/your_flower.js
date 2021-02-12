/*     ~~~ Your Flower ~~~
 * author: Jan Rychlý
 * controlls: s ... save frame
 *            g ... generate flower
 *            t ... toggle webcam tracker 
 * 
 * project notes on notion:
 * https://www.notion.so/GDP-Final-Project-b452b25e336e4f348264c84f61137a7d
 */

const size = 800;

let capture;
let tracker;
let pos; // positions
let analysis; // more accurate face landmark data
// received on demand from the Face++ API when 'g' is pressed
let img; // the frame when 'g' is pressed

let showingTracking = true;
let updateMood = true;

let flower;

let userMood;

/* SETUP */
function setup() {
    createCanvas(size, size).parent('flower_canvas');

    colorMode(HSB, 360, 100, 100, 100);
    noStroke();

    capture = createCapture(VIDEO);
    capture.elt.onloadedmetadata = () => {
        tracker = new clm.tracker();
        tracker.init();
        tracker.start(capture.elt);
    }
    capture.hide();

    frameRate(30);

    userMood = new Mood();
}


/* DRAW */
function draw() {
    background(0);
    
    if (!tracker) {
        return;
    }

    let newPositions = tracker.getCurrentPosition();
    if(newPositions) {
        pos = newPositions;
        if (updateMood) {
            userMood.update();
        }
    }
    
    if (showingTracking) {
        showTracking(0.3);
    }

    translate(width / 2, height / 2);
    textAlign(CENTER);
    fill(70, 95, 95);
    noStroke();
    textSize(width * 0.03);
    if (typeof(flower) == "string") {
        text(flower, 0, width * 0.05);
        let a = frameCount / 3;
        noFill();
        stroke(70, 95, 95);
        strokeWeight(3);
        arc(0, -width * 0.07, width * 0.1, width * 0.1, a, a + TWO_PI * 0.8, OPEN);
    } else if (flower) {
        flower.draw();
    } else {
        text("Press 'G' to generate your flower", 0, 0);
    }
}


// generate a new flower (changing the global flower variable)
async function genNewFlower() {
    flower = "waiting for tracking data";
    // uses the global 'feceDetectForm' to send a request for face analysis
    // to Face++ API and then uses the received data to construct a new Flower
    async function fetchDetectionAndGenerate() {
        resp = await fetch("https://api-us.faceplusplus.com/facepp/v3/detect",
                            { method: "POST", body: faceDetectForm });

        analysis = await resp.json();
        console.log("Tracking data: ", analysis.faces[0]);

        let {kind, seed0, seed1, seed2} = processFaceData(analysis.faces[0]);
        flower = new Flower(kind, seed0, seed1, seed2, userMood);
    }

    img = document.createElement('canvas');
    // canv.style.display = 'none';
    img.width = 640;
    img.height = 480;
    const video = capture.elt;
    img.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    // document.body.appendChild(img);
    img.toBlob((blob) => {
        faceDetectForm.set("image_file", blob, "capture.png");
        console.log(faceDetectForm.get("image_file").size);

        fetchDetectionAndGenerate();
    }); // get the image blob and call the async generation
}


function processFaceData({attributes, landmark}) {
    // this could / should be improved

    let glasses = attributes.eyestatus.left_eye_status.no_glass_eye_close + attributes.eyestatus.left_eye_status.no_glass_eye_open < attributes.eyestatus.left_eye_status.normal_glass_eye_close + attributes.eyestatus.left_eye_status.normal_glass_eye_open;
    glasses = int(glasses) * 41 + int(attributes.eyestatus.left_eye_status.dark_glasses > 0.6) * 83;
    const genderbeautyglasses = Math.floor(attributes.gender.value.charCodeAt(0) * 11 +
                                    attributes.beauty.male_score * 17 +
                                    attributes.beauty.female_score * 19 +
                                    glasses * 31);
    
    let kind = Math.floor(genderbeautyglasses / 700) % 3;
    let anchor = createVector(landmark.contour_chin.x, landmark.contour_chin.y);
    let l_cheek = createVector(landmark.contour_left4.x, landmark.contour_left4.y);
    let r_cheek = createVector(landmark.contour_right4.x, landmark.contour_right4.y);
    let l_eye = createVector(landmark.left_eye_center.x, landmark.left_eye_center.y);
    let r_eye = createVector(landmark.right_eye_center.x, landmark.right_eye_center.y);
    let nose_l = createVector(landmark.nose_left.x, landmark.nose_left.y);
    let nose_r = createVector(landmark.nose_right.x, landmark.nose_right.y);

    l_cheek.sub(anchor);
    r_cheek.sub(anchor);
    l_eye.sub(anchor);
    r_eye.sub(anchor);
    nose_l.sub(anchor);
    nose_r.sub(anchor);

    let seed0 = genderbeautyglasses * 11 + l_cheek.mag() * 41 + r_cheek.mag() * 41;
    let seed1 = attributes.age.value * 11 + attributes.skinstatus.health * 170 + l_eye.x * 19 + l_eye.y * 19;
    let seed2 = nose_l.mag() * 170 + nose_r.mag() * 170 + attributes.age.value * 19;
    return {'kind': kind, 'seed0': seed0, 'seed1': seed1, 'seed2': seed2};
}


class Mood {
    constructor() {
        this.val = 0.2;
        this.curr;
        this.adjustSpeed = 0.3;
    }
    getCurrent() {
        let rBrow = createVector(pos[17][0], pos[17][1]).sub(createVector(pos[26][0], pos[26][1]));
        // bottom of the right eye
        let lBrow = createVector(pos[21][0], pos[21][1]).sub(createVector(pos[31][0], pos[31][1]));
        // bottom of the left eye
        let curr = (rBrow.mag() + lBrow.mag()) / 2; // current absolte eyebrow height
        let ref = createVector(pos[23][0], pos[23][1]).sub(createVector(pos[28][0], pos[28][1])).mag();
        // reference measurement - from eye to eye
        const c1 = 0.68; // baseline ratio of 'curr' and 'ref' for normal eyebrow height
        const c2 = 12; // normalization constant
        this.curr = (curr / ref - c1) * c2;
    }
    update() {
        this.getCurrent();
        this.val += (this.curr - this.val) * this.adjustSpeed;
        if (this.val < 0) { this.val = 0; }
        if (this.val > 1) { this.val = 1; }
    }
    value() {
        return this.val;
    }
}


// show webcam feed with tracking info overlay
function showTracking(scl) {
    push();

    scl = scl * size / capture.elt.width;
    scale(scl);

    image(capture, 0, 0);
    
    if (!pos) {
        fill(100, 100, 85, 60);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(capture.elt.width * 0.1);
        text("can't find you :(", capture.elt.width/2, capture.elt.height/2);

        pop();
        return;
    }

    strokeWeight(2);
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
    const mouthPts = [44, 56, 57, 58, 50, 59, 60, 61];
    fill(50, 100, 100, 30);
    stroke(50, 100, 10);
    mouthPts.forEach(pt => {
        vertex(pos[pt][0], pos[pt][1]);
    });
    endShape(CLOSE);

    // pupils
    circle(pos[27][0], pos[27][1], pos[24][1] - pos[26][1]);
    circle(pos[32][0], pos[32][1], pos[31][1] - pos[29][1]);

    // eyebrows
    const brows = [[19, 20, 21, 22], [15, 16, 17, 18]];
    brows.forEach(brow => {
        beginShape();
        noFill();
        stroke(50, 100, 100, 50);
        strokeWeight(7);
        brow.forEach(pt =>{
            vertex(pos[pt][0], pos[pt][1]);
        });
        endShape();
    });

    pop();
}


function keyPressed() {
    if (key == 's' || key == 'S') {
        saveCanvas('my_flower.png');
    }
    if (key == 't' || key == 'T') {
        showingTracking = !showingTracking;
    }
    if (key == 'm' || key == 'M') {
        updateMood = !updateMood;
        if (!updateMood) {
            userMood.val = 0.2;
        }
    }
    if (key == 'g' || key == 'G') {
        genNewFlower();
    }
}


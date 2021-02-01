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

let showingTracking = true;

let flower;

let moodSlider;


/* SETUP */
function setup() {
    createCanvas(size, size).parent('flower_canvas');

    colorMode(HSB, 360, 100, 100, 100);
    noStroke();

    capture = createCapture(VIDEO);
    // capture.size(640, 480);
    // This actually throws an error but the tracker doesn't work without this call :thinking: >:(
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
    
    let newPositions = tracker.getCurrentPosition();
    if(newPositions) {
        pos = newPositions;
    }
    
    if (showingTracking) {
        showTracking(1);
    }

    if (flower) {
        // translate(width / 2, height / 2);
        //flower.draw();
    }

    scale(1.3);
    if (analysis) {
        Object.values(analysis.faces[0].landmark).forEach((l) => {
            fill(170, 70, 100);
            circle(l.x, l.y, 3);
        });
    }
}


// generate a new flower (changing the global flower variable)
async function genNewFlower() {
    
    // uses the global 'feceDetectForm' to send a request for face analysis
    // to Face++ API and then uses the received data to construct a new Flower
    async function fetchDetectionAndGenerate() {
        resp = await fetch("https://api-us.faceplusplus.com/facepp/v3/detect",
                            { method: "POST", body: faceDetectForm });

        analysis = await resp.json();
        console.log(analysis);

        noiseSeed(frameCount);
        flower = new Flower(0, 12, 42, 42, moodSlider);
    }

    let canv = document.createElement('canvas');
    // canv.style.display = 'none';
    canv.width = 640;
    canv.height = 480;
    const video = capture.elt;
    canv.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    // document.body.appendChild(canv);
    canv.toBlob((blob) => {
        faceDetectForm.set("image_file", blob, "capture.png");
        console.log(faceDetectForm.get("image_file").size);

        fetchDetectionAndGenerate();
    }); // get the image blob and call the async generation
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
    if (key == 'g' || key == 'G') {
        genNewFlower();
    }
}


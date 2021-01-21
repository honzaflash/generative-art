
// the flower grammar idea: 
// https://www.notion.so/GDP-Final-Project-b452b25e336e4f348264c84f61137a7d#3b7f37c6320d4c06b59d93ba74f9bc80

class Flower {
    constructor(flowerKind, pointCount, seed1, seed2, mood) {
        const flowerConstr = flowerConsturctors[flowerKind];
        this.flower = new flowerConstr(pointCount, seed1, seed2, mood);
    }
    draw() {
        this.flower.draw();
    }
};


// polynomials for saturation and brightness realative to the current layer and current 'mood'
const satPol = (l, m, c) => {return -2 * Math.pow(m - 0.55, 4) -0.4 * Math.pow(m - 0.55, 2) * 0.2 * Math.pow(l - 0.3, 5) + c;};
const briPol = (l, m, c) => {return 0.4 * m * Math.pow(l, 3) + 0.6 * l + c;};

class Rose {
    constructor(pointCount, seed1, seed2, mood) {
        // Rose parameter combination limits
        const parLims = (vertexCountLim, layerCountLim, vertexJitterLim, layerIndependancyLim) => {
            return {
                'vc': {'lo': vertexCountLim[0], 'up': vertexCountLim[1]},
                'lc': {'lo': layerCountLim[0], 'up': layerCountLim[1]},
                'vj': {'lo': vertexJitterLim[0], 'up': vertexJitterLim[1]},
                'li': {'lo': layerIndependancyLim[0], 'up': layerIndependancyLim[1]}
            };
        };
        const rComb = [
            parLims([30,50], [10,35], [0.5,0.9], [0.035,0.055]), //0
            parLims([10,50], [25,35], [0.25,0.6], [0.045,0.055]), //1
            parLims([15,35], [20,35], [0.7,0.9], [0.01,0.015]), //2
            parLims([45,50], [10,15], [0.1,0.3], [0.045,0.055]), //3
            parLims([10,50], [15,20], [0.55,0.85], [0.02,0.055]), //4
            parLims([10,50], [30,35], [0.7,0.9], [0.025,0.055]) //5
        ]
        // this.sliders = [
        //     createSlider(10, 50, 25, 1),
        //     createSlider(10, 30, 10, 5),
        //     createSlider(0.1, 0.9, 0.4, 0.05),
        //     createSlider(0.01, 0.055, 0.03, 0.001)
        // ]
        const comb = Math.floor(random(0, rComb.length));
        this.vertexCount = Math.floor(random(rComb[comb].vc.lo, rComb[comb].vc.up)); // in <10;50>
        this.layerCount = Math.floor(random(rComb[comb].lc.lo, rComb[comb].lc.up)); // PARAM
        this.vertexJitter = random(rComb[comb].vj.lo, rComb[comb].vj.up); // PARAM
        this.layerIndependancy = random(rComb[comb].li.lo, rComb[comb].li.up); // PARAM
        
        this.lerpFromHue = random(0, 360); // PARAM
        this.lerpToHue = this.lerpFromHue + random(30, 80); // PARAM;
        this.mood = mood;
    }
    
    draw() {
        // this.vertexCount = this.sliders[0].value();
        // this.layerCount = Math.floor(this.sliders[1].value());
        // this.vertexJitter = this.sliders[2].value();
        // this.layerIndependancy = this.sliders[3].value();
        
        noStroke()
        // l in <layerCount, layerCount - 1, ..., 1>
        for (let l = this.layerCount; l > 0; l--) {
            let layerProgress = l / this.layerCount;
            fill(lerp(this.lerpFromHue + 360, this.lerpToHue + 360,
                      layerProgress) % 360,
                 satPol(layerProgress, this.mood.value(), 0.97) * 100,
                 briPol(layerProgress, this.mood.value(), 0.1) * 100);
            wigglyCircle(width * 0.35 * layerProgress,
                         this.vertexCount, this.layerIndependancy,
                         this.vertexJitter * (layerProgress * 3/4 + 1/4) * width * 0.4);
        }
    }
};

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53,
                59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113,
                127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179];

class MaurerRose {
    constructor() {
        this.n = Math.floor(random(0, 90)) * 2;
        this.d = random(primes);
    }

    draw() {
        fill(40, 20, 100, 90);
        stroke(30, 90, 100, 80);
        // maurerOutline(this.n);
        
        noFill()
        stroke(50, 90, 97, 90);
        maurer(this.n, this.d);
      }
}


class Daisy {
    constructor(pointCount, seed1, seed2, mood) {
        this.petalCount = pointCount;
        this.petalLength = width * 0.4;
        this.petalWidth = 30;
        this.petalJagged = random([false, true]);
        this.petalColor = color(random(0, 360), 90, 98);
    }
    
    draw() {
        push()

        noStroke();
        fill(this.petalColor);
        for (let i = 0; i < this.petalCount; i++) {
            drawPetal(this.petalLength, this.petalWidth, this.petalJagged, 0.5, i);
            rotate(TWO_PI/this.petalCount);
        }
        // ellipse(0, 0, width * 0.15);
        
        pop()
    }
};


const flowerConsturctors = [
    Rose,
    MaurerRose,
    Daisy
]


function drawPetal(length, pWidth, jagged, jitter, i) {
    const nr = 1; // noise rez
    beginShape();
    curveVertex( pWidth * 3, 0);
    curveVertex( 0, 0);
    curveVertex(-pWidth, length/2 * noiseJitter(0.75, 420 + i * nr, 0)); // side
    curveVertex(-pWidth * 0.4, length * noiseJitter(0.25, 420 + i * nr, 1)); // tip
    if (jagged) {
        curveVertex( 0, length * noiseJitter(0.25, 420 + i * nr, 2));
    }
    curveVertex( pWidth * 0.4, length * noiseJitter(0.25, 420 + i * nr, 3)); // tip
    curveVertex( pWidth, length/2 * noiseJitter(0.75, 420 + i * nr, 4)); // side
    curveVertex( 0, 0);
    curveVertex(-pWidth * 3, 0);
    endShape();
}


function noiseJitter(strength, a, b) {
    return 1 + (noise(a, b) - 0.5) * strength/2;
}


// Used refference by: The Coding Train / Daniel Shiffman
//  - https://editor.p5js.org/codingtrain/sketches/qa7RiptE9
function maurer(n, d) {
    beginShape();
    strokeWeight(1);
    for (let i = 0; i <= TWO_PI; i += TWO_PI/360) {
        let r = width * 0.4 * sin(n * i * d);
        let x = r * cos(i * d);
        let y = r * sin(i * d);
        vertex(x,y);    
    }
    endShape();
}

function maurerOutline(n) {
    strokeWeight(3);
    beginShape();
    for (let i = 0; i <= TWO_PI; i += TWO_PI/360) {
        let r = width * 0.4 * sin(n * i);
        let x = r * cos(i);
        let y = r * sin(i);
        vertex(x,y);    
    }
    endShape();
}


function wigglyCircle(r, vertC, noiseRes, jitterRange) {
    beginShape();
    // drawing 3 extra vertices to smoothly close up the curve
    for (let angle = 0; angle < vertC + 3; angle++) {
        let curCos = cos(angle * TWO_PI / vertC);
        let curSin = sin(angle * TWO_PI / vertC);
        let jitter = (noise(1000 + curCos * r * noiseRes,
                            1000 + curSin * r * noiseRes)
                      - 0.5) * jitterRange;
        let x = (r + jitter) * curCos;
        let y = (r + jitter) * curSin;
        curveVertex(x, y);
    }
    endShape();
}


function burnRandom(n) {
    for (let i = 0; i < n; i++) {
        random();
    }
}

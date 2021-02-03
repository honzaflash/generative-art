
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
}


// polynomials for saturation and brightness realative to the current layer and current 'mood'
const satPol = (l, m, c) => {return -2 * Math.pow(m - 0.55, 4) -0.4 * Math.pow(m - 0.55, 2) * 0.2 * Math.pow(l - 0.3, 5) + c;};
const briPol = (l, m, c) => {return 0.4 * m * Math.pow(l, 3) + 0.6 * l + c;};

// lerp the shortes distance between two hues on a color wheel
function lerpHue(from, to, x) {
    return (lerp(from, to, x) + 360) % 360;
    // adding 360 because of js modulo's behaviour on negative numbers 
}

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

        noStroke()
        // l in <layerCount, layerCount - 1, ..., 1>
        for (let l = this.layerCount; l > 0; l--) {
            let layerProgress = l / this.layerCount;
            fill(lerpHue(this.lerpFromHue, this.lerpToHue, layerProgress),
                 satPol(layerProgress, this.mood.value(), 0.97) * 100,
                 briPol(layerProgress, this.mood.value(), 0.1) * 100);
            wigglyCircle(width * 0.35 * layerProgress,
                         this.vertexCount, this.layerIndependancy,
                         this.vertexJitter * (layerProgress * 3/4 + 1/4) * width * 0.4);
        }
    }
}

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
        this.petalCount = 16;
        this.petalLength = width * 0.4;
        this.petalWidth = 30;
        this.petalJagged = random([false, true]);
        this.lerpFromHue = random(0, 360); // PARAM
        this.lerpToHue = this.lerpFromHue + random(20, 70); // PARAM;
        this.layerCount = random([1, 4, 5, 6]);
        this.layers = [];

        if (this.layerCount == 1) {
            // single regular daisy
            this.layers.push(new DaisyLayer(
                mood,
                this.petalCount,
                false,
                this.petalLength,
                this.petalWidth,
                this.petalJagged,
                this.lerpFromHue,
                this.lerpToHue,
                (x) => {return map(x, 0, 1, 80, 97);}
                ));
        // maybe TODO else if (...) {randomly spread petals (uneven noise based rotation)}
        } else {
            // layered geometrical daisy
            for (let i = this.layerCount; i > 0; i--) {
                this.layers.push(new DaisyLayer(
                    mood,
                    Math.floor(random(this.petalCount * (i / this.layerCount), this.petalCount)),
                    true,
                    this.petalLength * map(i, this.layerCount, 1, 1, 0.5),
                    this.petalWidth * map(i, this.layerCount, 1, 1, 0.7),
                    this.petalJagged,
                    this.lerpFromHue + i * 5,
                    null,
                    (x) => {return map(x, 0, 1, 50, 100);}
                    ));
            }
        }
    }

    draw() {
        this.layers.forEach((layer) => {
            layer.draw();
        });
        // draw center
    }
}


// petal based Daisy like pseudoflower with optional gradient
class DaisyLayer {
    constructor(mood, count, rOffset, pLength, pWidth, jagged, lerpFrom, lerpTo, bMap) {
        this.petalCount = count;
        this.petalLength = pLength;
        this.petalWidth = pWidth;
        this.petalJagged = jagged;
        this.rOffset = rOffset;
        this.lerpFromHue = lerpFrom;
        this.lerpToHue = lerpTo;
        this.brightnessMap = bMap;
        this.mood = mood;
        this.gradientRez = 20; // number of inner layers
        console.log(this);
    }
    
    draw() {
        push()

        noStroke();
        
        if (this.rOffset) {
            rotate(TWO_PI / this.petalCount / 2);
        }
        let curHue = this.lerpFromHue;
        for (let p = 0; p < this.petalCount; p++) {
            for (let i = this.gradientRez; i > 0; i--) {
                if (this.lerpToHue) {
                    curHue = lerpHue(this.lerpFromHue, this.lerpToHue, i / this.gradientRez);
                }
                fill(curHue, 90, this.brightnessMap(i / this.gradientRez));
                drawPetal(this.petalLength * ((i + 0) / (this.gradientRez + 0)), this.petalWidth * ((i + 5) / (this.gradientRez + 5)), this.petalJagged, 0.5, p);
            }
            rotate(TWO_PI/this.petalCount);
        }

        pop()
    }
}


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
    curveVertex(-pWidth, length/2 * noiseJitter(jitter * 1.5, 420 + i * nr, 0)); // side
    curveVertex(-pWidth * 0.4, length * noiseJitter(jitter * 0.5, 420 + i * nr, 1)); // tip
    if (jagged) {
        curveVertex( 0, length * noiseJitter(jitter * 0.5, 420 + i * nr, 2));
    }
    curveVertex( pWidth * 0.4, length * noiseJitter(jitter * 0.5, 420 + i * nr, 3)); // tip
    curveVertex( pWidth, length/2 * noiseJitter(jitter * 1.5, 420 + i * nr, 4)); // side
    curveVertex( 0, 0);
    curveVertex(-pWidth * 3, 0);
    endShape();
}


// expecting 0 <= strength <= 1
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

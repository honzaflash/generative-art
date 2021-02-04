
// the flower grammar idea: 
// https://www.notion.so/GDP-Final-Project-b452b25e336e4f348264c84f61137a7d#3b7f37c6320d4c06b59d93ba74f9bc80

/**
 * Class representing a flower that can be drawn
 * acts as a wrapper around the three flower kinds
 */
class Flower {
    /**
     * create a flower
     * @param {Number} flowerKind - 0 is circle rose, 1 is maurer rose, 2 is daisy style flower
     * @param {Number} seed0
     * @param {Number} seed1
     * @param {Number} seed2
     * @param {Object} mood - object with 'value' method that returns a number between 0 and 1
     */
    constructor(flowerKind, seed0, seed1, seed2, mood) {
        noiseSeed(seed0 + seed1);
        const flowerConsturctors = [
            Rose,
            MaurerRose,
            Daisy
        ]
        const flowerConstr = flowerConsturctors[flowerKind];
        this.flower = new flowerConstr(seed0, seed1, seed2, mood);
    }
    draw() {
        this.flower.draw();
    }
}


// maybe TODO make the background of given flower dark complementary color



/* ---------------------------------------
 * |    ~~ ROSE related structures ~~    |
 * --------------------------------------- */

// polynomials for saturation and brightness realative to the current layer and current 'mood'
function satPol(l, m, c) {return -2 * Math.pow(m - 0.55, 4) -0.4 * Math.pow(m - 0.55, 2) * 0.2 * Math.pow(l - 0.3, 5) + c;}
function briPol(l, m, c) {return 0.4 * m * Math.pow(l, 3) + 0.6 * l + c;}

// Rose parameter combination limits
function parLims(vertexCountLim, layerCountLim, vertexJitterLim, layerIndependancyLim) {
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
];

/** Class representing a rose formed by layers of noise deformed loops */
class Rose {
    constructor(seed0, seed1, seed2, mood) {
        const comb = Math.floor((seed1 / 10) % rComb.length);
        randomSeed(seed2);
        this.vertexCount = Math.floor(random(rComb[comb].vc.lo, rComb[comb].vc.up));
        this.layerCount = Math.floor(random(rComb[comb].lc.lo, rComb[comb].lc.up));
        this.vertexJitter = random(rComb[comb].vj.lo, rComb[comb].vj.up);
        this.layerIndependancy = random(rComb[comb].li.lo, rComb[comb].li.up);
        
        randomSeed(seed0);
        this.lerpFromHue = random(0, 360);
        this.lerpToHue = this.lerpFromHue + random(30, 80);
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



/* ---------------------------------------
 * |   ~~ Maurer related structures ~~   |
 * --------------------------------------- */

// at least 4, not a prime, some other numbers are not included
const maurerNs = [4, 5, 6, 8, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24,
                  25, 26, 27, 28, 30, 32, 33, 34, 35, 36, 38, 39, 40, 42,
                  44, 45, 46, 48, 49, 50, 51, 52, 54, 55, 56, 60, 63,
                  64, 65, 66, 68, 69, 70, 72, 75, 76, 77, 78, 80, 81, 84,
                  85, 88, 92, 95, 96, 98, 99, 100, 102, 104, 105, 108,
                  110, 112, 114, 125, 126, 128, 130, 132, 133,
                  135, 136, 138, 140, 143, 144, 147, 150, 152, 153, 154,
                  156, 160, 161, 162, 165, 168, 169, 170, 171, 175, 176];
                  // potential blacklist: 69, 55, 169, 21, 114, 51
// at least 11 and less than 163, pretty much primes only, some are not included
const maurerDs = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53,
                  59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107,
                  109, 113, 121, 127, 131, 139, 149, 151, 157];
                  // potential blacklist: 83, 41, 97, 131, 127, 79


/** Class representing a Maurer rose */
class MaurerRose {
    constructor(seed0, seed1, seed2, mood) {
        // this.n = createSlider(0, maurerNs.length - 1, 0, 1);
        // this.d = createSlider(0, maurerDs.length - 1, 5, 1);
        // this.showND = createP('nd');
        // this.showND.style('color', 'white');
        this.n = maurerNs[Math.floor(seed1 % maurerNs.length)];
        this.d = maurerDs[Math.floor(seed2 % maurerDs.length)];
        randomSeed(seed0);
        this.color = color(random(0, 360), 70, 100);
        this.mood = mood;

        console.log('maurer - n: ' + this.n + ', d: ' + this.d);
    }

    draw() {
        fill(hue(this.color), 60, 100, 30);
        noStroke();
        maurerBackground(this.n);
        
        noFill();
        stroke(this.color);
        // maurer(maurerNs[this.n.value()], maurerDs[this.d.value()]);
        // this.showND.elt.innerText = 'n: ' + maurerNs[this.n.value()] + ', d: ' + maurerDs[this.d.value()];
        maurer(this.n, this.d);
    }
}


// draws a walk around the rose curve aka Maurer rose
// Refference by: The Coding Train / Daniel Shiffman
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


function rainbowMaurer(n, d) {
    // i == 0:
    let prevX = 0;
    let prevY = 0;
    strokeWeight(1);
    for (let i = 1; i <= TWO_PI; i += TWO_PI/360) {
        let r = width * 0.4 * sin(n * i * d);
        let x = r * cos(i * d);
        let y = r * sin(i * d);
        stroke(i * 6, 70, 100);
        line(prevX, prevY, x, y);
        prevX = x;
        prevY = y;    
    }
}


// draws only the rose curve
function maurerBackground(n) {
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



/* ---------------------------------------
 * |   ~~ Daisy related structures ~~    |
 * --------------------------------------- */

/** Class representing a daisy style flower formed by petals */
class Daisy {
    constructor(seed0, seed1, seed2, mood) {
        this.petalCount = Math.floor(seed1 % 16) + 7;
        this.petalLength = width * 0.4;
        this.petalWidth = 30; // TODO lower petal count --> wider petals
        this.petalJagged = (seed2 % 10 < 5);
        this.layerCount = [1, 4, 5, 6][Math.floor((seed2 / 10) % 4)];
        this.layers = [];

        randomSeed(seed0);
        this.lerpFromHue = random(0, 360); // PARAM
        this.lerpToHue = this.lerpFromHue + random(20, 70); // PARAM;

        if (this.layerCount == 1) {
            // single petal layer regular daisy
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
        // maybe TODO draw center
    }
}


/** single petal layer with optional gradient */
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
    }
    
    draw() {
        push();

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

        pop();
    }
}


/**
 * draw a single petal
 * @param {Number} length - length of the petal 
 * @param {Number} pWidth - width of the petal
 * @param {Boolean} jagged - wheather the petal end is jagged
 * @param {Number} jitter - jitter strength of the points forming the petal outline
 *                          number between 0 and 1 (or potentially more)
 * @param {Number} i - petal token used for noise sampling (as a )
 */
function drawPetal(length, pWidth, jagged, jitter, i) {
    const x = 420 + i * 1; // sets a line in the noise plane
    beginShape();
    curveVertex( pWidth * 3, 0); // control vertex widening the base
    curveVertex( 0, 0); // the base point
    curveVertex(-pWidth, length/2 * noiseJitter(jitter * 1.5, x, 0)); // side
    curveVertex(-pWidth * 0.4, length * noiseJitter(jitter * 0.5, x, 1)); // tip
    // the curve overshoots the "tip" vertex and comes back down through the other "tip"
    // vertex resulting in the actual tip of the curve being above the two vertices
    if (jagged) {
        // adding extra point has the overshooting curve come back to it forming a dimple
        curveVertex( 0, length * noiseJitter(jitter * 0.5, x, 2));
    }
    curveVertex( pWidth * 0.4, length * noiseJitter(jitter * 0.5, x, 3)); // tip
    curveVertex( pWidth, length/2 * noiseJitter(jitter * 1.5, x, 4)); // side
    curveVertex( 0, 0); // base
    curveVertex(-pWidth * 3, 0); // control
    endShape();
}


/* ----------------------------------------
 * multipurpose helper functions structures
 * ---------------------------------------- */

/**
 * jitter multiplier based on noise value at 'x' and 'y' and strength,
 * where strength is percentual range of the jitter
 * @returns {Number} value between (1 - strength/2 ) and (1 + strength/2)
 */
function noiseJitter(strength, x, y) {
    return 1 + (noise(x, y) - 0.5) * strength/2;
}


/** lerp the shortes distance between two hues on a color wheel */
function lerpHue(from, to, x) {
    return (lerp(from, to, x) + 360) % 360;
    // adding 360 because of js modulo's behaviour on negative numbers 
}


function burnRandom(n) {
    for (let i = 0; i < n; i++) {
        random();
    }
}

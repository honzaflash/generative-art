
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
        console.log('layers:', this.layerCount);
        
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

class MaurerRose {
    // TODO https://www.youtube.com/watch?v=4uU9lZ-HSqA
    constructor() {
    }
};

class Daisy {
    constructor(pointCount, seed1, seed2, mood) {
        this.crown = new DaisyLayer();
    }
    
    draw() {
        this.crown.draw();
    }
};


const flowerConsturctors = [
    Rose,
    Daisy,
    Rose
    // (lerpFrom, lerpTo, levelCount, vertexCount) => { return Rose(false, lerpFrom, lerpTo, levelCount, vertexCount) },
    // (lerpFrom, lerpTo, levelCount, vertexCount) => { return Rose(true, lerpFrom, lerpTo, levelCount, vertexCount) },
    // (levelCount) => { return Daisy(false, levelCount)},
    // (levelCount) => { return Daisy(true, levelCount)}
]


class FlowerCrownLayer {
    constructor(level, maxLevel) {
        this.maxLevel = maxLevel;
        this.level = level;
        this.crownDraw = undefined;
        this.subCrown = undefined;
    }
    draw() {
        this.crownDraw();
        if (this.subCrown) {
            this.subCrown.draw();
        }
    }
};


class DaisyLayer extends FlowerCrownLayer {
    constructor(level, maxLevel) {
        super(level, maxLevel);
        console.log(level, maxLevel);

        this.color = color(random(0,360), 75, 98, 50);

        let counts = [32, 20, 16, 10, 8];
        let c = Math.floor(random(0, 1.5 - this.level / this.maxLevel) / 1.5 * counts.length);
        this.leafCount = counts[c];
        this.leafWidth = random(15, 40);
        this.leafRotOffset = random([true, false]);

        this.crownDraw = () => {
            fill(this.color);
            leafFan(250 * this.level/this.maxLevel, this.leafCount, this.leafWidth, this.leafRotOffset);
        }

        this.subCrown = level > 1 ? new DaisyLayer(level - 1, maxLevel) : undefined;
    }
};


class Center {
    constructor() {
        this.color = color(random(0, 360), 75, 80);
        // this.dotsColor = random([undefined, color(random(0, 360), 75, 80)]);
        // this.secondLayer = random([undefined, color(random(0, 360), 75, 80)]);
    }
    draw() {
        // if (this.secondLayer) {
        //     fill(this.secondLayer)
        //     wigglyCircle(28, 15, 3, 10);
        // }
        fill(this.color);
        circle(0, 0, 50);
        // if (this.dotsColor) {
        //     stroke(this.dotsColor);
        //     strokeWeight(3);
        //     for (let i = 0; i < 20; i++) {
        //         point((noise(i) - 0.5) * 40, (noise(i * 42) - 0.5) * 40);
        //     }
        //     noStroke();
        // }
    }
};


function wigglyCircle(r, vertC, noiseRes, jitterStrength) {
    beginShape();
    // drawing 3 extra vertices to smoothly close up the curve
    for (let angle = 0; angle < vertC + 3; angle++) {
        let curCos = cos(angle * TWO_PI / vertC);
        let curSin = sin(angle * TWO_PI / vertC);
        let jitter = (noise(1000 + curCos * r * noiseRes,
                            1000 + curSin * r * noiseRes)
                      - 0.5) * jitterStrength;
        let x = (r + jitter) * curCos;
        let y = (r + jitter) * curSin;
        curveVertex(x, y);
    }
    endShape();
}

function leafFan(r, leafC, leafWidth, rotOffset, noiseRes, amplitude) {
    push();
    if (rotOffset) {
        rotate(TWO_PI / leafC / 2);
    }
    for (let i = 0; i < leafC; i++) {
        ellipse(0, r / 2, leafWidth, r * (0.9 + noise(42 * i) * 0.2));
        rotate(TWO_PI / leafC);
    }
    pop();
}


function burnRandom(n) {
    for (let i = 0; i < n; i++) {
        random();
    }
}

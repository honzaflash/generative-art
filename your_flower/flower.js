// the flower grammar: 
// https://www.notion.so/GDP-Final-Project-b452b25e336e4f348264c84f61137a7d#3b7f37c6320d4c06b59d93ba74f9bc80



class Crown {
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
}

class CircullarCrown extends Crown {
    constructor(level, maxLevel, edgeHue, centerHue) {
        super(level, maxLevel);
        console.log(level, maxLevel);

        if (edgeHue == undefined) {
            this.edgeHue = random(10, 350);
            this.centerHue = this.edgeHue + random(-10, 10);
        } else {
            this.edgeHue = edgeHue;
            this.centerHue = centerHue;
        }
        
        // this.subCrown = lvl < 4 ? new ( random([CircullarCrown, LeafFanCrown]) )(1) : undefined;
        this.subCrown = level > 1 ? new CircullarCrown(level - 0.5, maxLevel, this.edgeHue, this.centerHue)
                                  : undefined;
        
        this.crownDraw = () => {
            fill(lerpColor(color(this.centerHue, 80, 10),
                           color(this.edgeHue, 80, 100),
                           (this.level / this.maxLevel)));
            wigglyCircle(250 * this.level/this.maxLevel, 16, 0.5, 40 * this.level/this.maxLevel + 10);
        }
    }
}

class LeafFanCrown extends Crown {
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

        this.subCrown = level > 1 ? new LeafFanCrown(level - 1, maxLevel) : undefined;
    }
}

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
}

class Flower {

    constructor(pos, img) {
        this.data = {
            positions: pos,
            image: img
        };
        randomSeed(abs(pos[1][0] - pos[13][0]) / abs(pos[33][1] - pos[7][1]) * 10);
        noiseSeed(abs(pos[1][0] - pos[13][0]) / abs(pos[33][1] - pos[7][1]) * 10);

        burnRandom();
        
        this.crown = new ( random([LeafFanCrown, CircullarCrown]) )(3, 3);
        this.center = new Center();
    }

    setData(positions, image) {
        this.data.positions = positions;
        this.data.image = image;
    }

    draw() {
        this.crown.draw();
        this.center.draw();
        return;
    }
};


function wigglyCircle(r, vertC, noiseRes, amplitude) {
    beginShape();
    let x = 0;
    let y = 0;
    for (let angle = 0; angle < vertC + 3; angle++) {
        // drawing extra vertices to close up the 
        let cosine = cos(angle * TWO_PI / vertC);
        let sine = sin(angle * TWO_PI / vertC);
        let offset = noise(1000 - cosine * r * noiseRes,
            1000 - sine * r * noiseRes) * amplitude;
        // let offset = noise(x * noiseRes, y * noiseRes) * amplitude;
        x = (r + offset) * cosine;
        y = (r + offset) * sine;
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


function burnRandom() {
    for (let i = 0; i < 20; i++) {
        random();
    }
}

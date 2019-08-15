function setGlobals() {
    cameraPosition = new THREE.Vector3(14.5, 10.4, 28.9);
    cameraTarget   = new THREE.Vector3(5, 0.5, 5);
    cameraFocalDistance = 33.8;


    minimumLineSize = 0.005;

    // bokehStrength  = 0.018;
    bokehStrength  = 0.01;
    focalPowerFunction = 1;
    exposure = 0.0009;

    useBokehTexture = true;
    bokehTexturePath = "assets/bokeh/pentagon.png";

    let dn = Date.now();
    console.log(dn);
    Utils.setRandomSeed(dn.toString());
}

// use this function to create the lines that will be rendered
function createScene(frame) {
    let field = [];

    let fieldSize = 100;
    for(let i = 0; i < fieldSize; i++) {
        field.push([]);
        for(let j = 0; j < fieldSize; j++) {
            field[i].push(0);
        }
    }


    let scalingFactor = 0.1;


    let minWidth = 5;
    let maxWidth = 40;
    let numQuads = 80;
    let quadHeight = 7;
    for(let i = 0; i < numQuads; i++) {
        let wt = Utils.rand();
        let ht = Utils.rand();

        let width  = Math.floor(minWidth * wt + maxWidth * (1-wt));
        let height = Math.floor(minWidth * ht + maxWidth * (1-ht));

        width  = width  - (width  % 5);
        height = height - (height % 5);

        let xt = Math.floor(Utils.rand() * fieldSize);
        let zt = Math.floor(Utils.rand() * fieldSize);
        
        let xs = Math.max(Math.floor(xt - width  * 0.5),   0);
        let zs = Math.max(Math.floor(zt - height * 0.5),   0);

        let xe = Math.min(Math.floor(xt + width * 0.5), fieldSize);
        let ze = Math.min(Math.floor(zt + height * 0.5), fieldSize);

        // now add the coefficients to each cell
        for(let x = xs; x < xe; x++) {
            for(let z = zs; z < ze; z++) {
                field[z][x] += Math.floor(Utils.rand() * quadHeight);
            }
        }
    }


    // draw lines
    for(let i = 0; i < fieldSize; i++) {
        for(let j = 0; j < fieldSize; j++) {


            if(Math.random() > 0.3) continue;


        
            let yVal = field[i][j];
            let z = i;
            let x = j;


            let color = {
                x: 0.045,
                y: 0.045,
                z: 0.045,
            };

            if(Math.random() > (1 - z * 0.01)) {
                color = {
                    x: 0.1 * (1 + Math.random()),
                    y: 0.03,
                    z: 0.01,
                };
            }

            lines.push({
                x1: x    * scalingFactor,
                y1: yVal * scalingFactor,
                z1: z    * scalingFactor,
            
                x2: x     * scalingFactor,
                y2: yVal  * scalingFactor,
                z2: (z+1) * scalingFactor,
            
                c1r: color.x, 
                c1g: color.y, 
                c1b: color.z,

                c2r: color.x, 
                c2g: color.y, 
                c2b: color.z,
            });


            lines.push({
                x1: x    * scalingFactor,
                y1: yVal * scalingFactor,
                z1: z    * scalingFactor,
            
                x2: (x+1) * scalingFactor,
                y2: yVal  * scalingFactor,
                z2: (z) * scalingFactor,
            
                c1r: color.x,
                c1g: color.y,
                c1b: color.z,

                c2r: color.x,
                c2g: color.y,
                c2b: color.z,
            });



            

            // check if you need to make an upward wall
            if(i != (fieldSize - 1)) {
                let nyVal = field[i+1][j];
                if(nyVal !== yVal) {
                    lines.push({
                        x1: x     * scalingFactor,
                        y1: yVal  * scalingFactor,
                        z1: (z+1) * scalingFactor,
                    
                        x2: x     * scalingFactor,
                        y2: nyVal * scalingFactor,
                        z2: (z+1) * scalingFactor,
                    
                        c1r: color.x,
                        c1g: color.y,
                        c1b: color.z,
        
                        c2r: color.x,
                        c2g: color.y,
                        c2b: color.z,
                    });
                }
            }
            
            
            // check if you need to make an upward wall
            if(j != (fieldSize - 1)) {
                let nyVal = field[i][j+1];
                if(nyVal !== yVal) {
                    lines.push({
                        x1: (x+1) * scalingFactor,
                        y1: yVal  * scalingFactor,
                        z1: (z) * scalingFactor,
                    
                        x2: (x+1)     * scalingFactor,
                        y2: nyVal * scalingFactor,
                        z2: (z) * scalingFactor,
                    
                        c1r: color.x,
                        c1g: color.y,
                        c1b: color.z,
        
                        c2r: color.x,
                        c2g: color.y,
                        c2b: color.z,
                    });
                }
            }



            if(Math.random() > 0.9)
            if(j != (fieldSize - 1)) {
                
                let nyVal = field[i][j+1];
                if(nyVal !== yVal) {
                    let ii = 5;
                    for(let ii = 0; ii < 5; ii++) {
                        lines.push({
                            x1: (x+ (ii/5)) * scalingFactor,
                            y1: yVal  * scalingFactor,
                            z1: (z) * scalingFactor,
                        
                            x2: (x+ (ii/5)) * scalingFactor,
                            y2: nyVal * scalingFactor,
                            z2: (z) * scalingFactor,
                        
                            c1r: color.x * 3,
                            c1g: color.y * 3,
                            c1b: color.z * 3,
            
                            c2r: color.x * 3,
                            c2g: color.y * 3,
                            c2b: color.z * 3,
                        });
                    }
                }
            }
            
          
        }
    }
}



function smoothstepAnim(from, to, animStart, animEnd, animCurrent) {
    let t = (animCurrent - animStart) / (animEnd - animStart);
    t = t * t * (3.0 - 2.0 * t);
    let delta = to - from;

    return from + delta * t;
}


function indexToUvs(index) {
    let charsPerRow = 16;

    let x = index % charsPerRow;
    let y = Math.floor(index / charsPerRow);

    let us = x / charsPerRow;
    let vs = y / charsPerRow;

    let ue = us + 1 / charsPerRow;
    let ve = vs + 1 / charsPerRow;

    return {
        us: us * 0.5,
        vs: vs * 0.5,

        ue: ue * 0.5,
        ve: ve * 0.5,
    }
}
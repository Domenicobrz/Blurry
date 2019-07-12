function setGlobals() {
    cameraPosition = new THREE.Vector3(14.5, 10.4, 28.9);
    cameraTarget   = new THREE.Vector3(2.16, 0.51, -1.5);
    cameraFocalDistance = 33.8;

    // bokehStrength  = 0.018;
    bokehStrength  = 0.01;
    focalPowerFunction = 1;
    exposure = 0.0011;

    useBokehTexture = true;
    bokehTexturePath = "assets/bokeh/pentagon.png";
    quadsTexturePath = "assets/textures/texture1.png";

    // let seed = Date.now();
    Utils.setRandomSeed("1562701299834");
    // console.log(seed);
}

// use this function to create the lines that will be rendered
function createScene(frame) {
    Utils.setRandomSeed("1562701299834");
    
    let groundM1 = 0.03;
    let groundDispStrength = 1.15;

    let quadColorMult = 1.3;

    let at = frame / framesCount;
    let t = 0;
    let mr = 0.003;
    if(at > 0 && at < 0.25) {
        t = smoothstepAnim(0, mr, 0, 0.25, at);
    } else if(at >= 0.25 && at < 0.5) {
        t = smoothstepAnim(mr, 0, 0.25, 0.5, at);
    } else if(at > 0.5 && at < 0.75) {
        t = -smoothstepAnim(0, mr, 0.5, 0.75, at);
    } else if(at >= 0.75 && at < 1) {
        t = -smoothstepAnim(mr, 0, 0.75, 1, at);
    }

    controls.rotate(t);//Math.sin(frame / framesCount * Math.PI * 2) * 0.004);


    let goodTreeFallingTextPositions = [];

    function createTree(sv, relRot, level) {
        if(level >= 6) return;

        let v1 = sv.clone();
        let v2 = new THREE.Vector3(0, (1 + ((6 - level) * 0.5)) * (Utils.rand() + 0.15), 0);
        v2.applyAxisAngle(new THREE.Vector3(0, 0, 1), relRot + (Utils.rand() * 2 - 1) * 0.25);
        v2.applyAxisAngle(new THREE.Vector3(1, 0, 0), (Utils.rand() * 2 - 1) * 0.25);
        v2.add(v1);

        let colorMult = 1;


        if(v1.z < 15)
            lines.push({
                x1: v1.x,
                y1: v1.y,
                z1: v1.z,
            
                x2: v2.x,
                y2: v2.y,
                z2: v2.z,
            
                c1r: 1 * colorMult, 
                c1g: 1 * colorMult, 
                c1b: 1 * colorMult,
            
                c2r: 1 * colorMult, 
                c2g: 1 * colorMult, 
                c2b: 1 * colorMult,
            });



        let relRotAnim = (Math.sin(frame / framesCount * Math.PI * 2 + (v1.x + v1.z) * 0.2) * 0.5 + 0.5) * 0.03;
        if(level < 2) relRotAnim = 0;



        if(Utils.rand() > 0.3)
            createTree(v2, relRot - 0.5 + relRotAnim, level + 1);
        
        if(Utils.rand() > 0.85)
            createTree(v2, relRot + 0.0 + relRotAnim, level + 1);

        if(Utils.rand() > 0.3)
            createTree(v2, relRot + 0.5 + relRotAnim, level + 1);


        if(level === 5 /*&& (Math.abs(relRot) > 0.25)*/ && Utils.rand() > 0.4) {
            let skip = goodtree;
            createFallingText(v2, skip);
        } 

        if(level === 5 && goodtree) {
            goodTreeFallingTextPositions.push(v2);
        }
    }
    function createFirstTree(sv, relRot, level) {
        if(level >= 4) return;


        let v1 = sv.clone();
        let v2 = new THREE.Vector3(0, (0.65 + ((6 - level) * 0.35)) * (Utils.rand() + 0.15), 0);
        v2.applyAxisAngle(new THREE.Vector3(0, 0, 1), relRot + (Utils.rand() * 2 - 1) * 0.25);
        v2.applyAxisAngle(new THREE.Vector3(1, 0, 0), (Utils.rand() * 2 - 1) * 0.25);
        v2.add(v1);

        let colorMult = 1;

        lines.push({
            x1: v1.x,
            y1: v1.y,
            z1: v1.z,
        
            x2: v2.x,
            y2: v2.y,
            z2: v2.z,
        
            c1r: 1 * colorMult, 
            c1g: 1 * colorMult, 
            c1b: 1 * colorMult,

            c2r: 1 * colorMult, 
            c2g: 1 * colorMult, 
            c2b: 1 * colorMult,
        });

        if(Utils.rand() > 0.25)
            createTree(v2, relRot - 0.5, level + 1);
        
        if(Utils.rand() > 0.95)
            createTree(v2, relRot + 0.0, level + 1);

        if(Utils.rand() > 0.25)
            createTree(v2, relRot + 0.5, level + 1);



        if(level === 5 /*&& (Math.abs(relRot) > 0.25)*/ && Utils.rand() > 0.4) {
            createFallingText(v2);
        } 
    }

    var goodtree = false;
    for(let i = 0; i < 35; i++) {

        let x = (Utils.rand() * 2 - 1) * 30;
        let z = -(Utils.rand()) * 90 + 30;

        let pos = new THREE.Vector3(x, 0, z);
        pos.x += (Utils.rand() * 2 - 1) * 2;
        pos.z += (Utils.rand() * 2 - 1) * 2;
        pos.z = pos.z - pos.z % 0.375;

        if(i === 0) {
            pos.x = 0;
            pos.z = 0;
        }

        let cv = curlNoise(pos.clone().multiplyScalar(groundM1)).multiplyScalar(groundDispStrength);
        pos.add(cv);

        if(i === 5) {
            goodtree = true;
        } else {
            goodtree = false;
        }

        if(i === 0)
            createFirstTree(pos, 0, 1);
        else
            createTree(pos, 0, 1);        
    }

    function createFallingText(start, skip) {

        let chars = Math.floor(4 + Utils.rand() * 5);

        let a1Start = Utils.rand() * Math.PI * 2;

        for(let i = 0; i < chars; i++) {

            let index = 0;

            if(i === 0)
                index = Math.floor(33 + Utils.rand() * 25);
            else
                index = Math.floor(65 + Utils.rand() * 22);

                              // 16 * 16 because uvs starts from the bottom 
            let t = indexToUvs(16 * 16 - index);


            let maxRot = 0.1 + Utils.rand() * 0.1;
            let maxRotSpeed = 0.5 + Utils.rand() * 0.9;
            let a1 = Math.sin(a1Start + i * maxRotSpeed + frame / framesCount * Math.PI * 2) * maxRot;

            let color = {
                x: 100,
                y: 100,
                z: 100,
            };

            let cm = Utils.rand() * 0.4 + 0.6;
            if(Utils.rand() > 0.65) {
                color.x = 100 * cm + Utils.rand() * 50 * cm;
                color.y = 30  * cm + Utils.rand() * 50 * cm;
                color.z = 10  * cm + Utils.rand() * 50 * cm;
            }

            let quad = new Quad(0,0,0, t.us, t.vs, t.ue, t.ve);

            quad =  quad
                    .scale(0.5)
                    .translate(0, 1, 0)
                    .rotate(0, 0, 1, a1)
                    .translate(-(quad.v1.x + quad.v2.x) / 2, 0, 0)
                    .color(color.x * quadColorMult, color.y * quadColorMult, color.z * quadColorMult)
                    .translate(start.x, start.y - 0.5 - i * 0.35, start.z)
                    .translate(0, -1, 0)

            if(!skip && start.z < 15)
                quads.push(quad);
        }
    }



    // *************** grass
    for(let j = -30; j < 30; j++) {
        for(let i = -50; i < 50; i++) {
            let v1 = new THREE.Vector3( j * 0.7,    0, i * 0.375 );
            let v2 = new THREE.Vector3( (j+1) * 0.7,  0, i * 0.375 );

            let cv = curlNoise(v1.clone().multiplyScalar(groundM1)).multiplyScalar(groundDispStrength);
            v1.add(cv);

            cv = curlNoise(v2.clone().multiplyScalar(groundM1)).multiplyScalar(groundDispStrength);
            v2.add(cv);

            let color = 0.027;

            lines.push({
                x1: v1.x,
                y1: v1.y,
                z1: v1.z,
            
                x2: v2.x,
                y2: v2.y,
                z2: v2.z,
            
                c1r: color, 
                c1g: color, 
                c1b: color,

                c2r: color, 
                c2g: color, 
                c2b: color,

                weight: 0.025,
            });
        }
    }



    for(let i = 0; i < 85000; i++) {
    // for(let i = 0; i < 2000; i++) {
        let v1 = new THREE.Vector3(
            (Utils.rand() * 2 - 1) * 45,
            // (Utils.rand() * 2 - 1) * 10,
            0, 
            Math.floor((Utils.rand() * 2 - 1) * 135) * 0.375,
            // Math.floor((Utils.rand() * 2 - 1) * 45) * 0.375 - 5,
        );

        let cv = curlNoise(v1.clone().multiplyScalar(groundM1)).multiplyScalar(groundDispStrength);
        v1.add(cv);

        let v2 = new THREE.Vector3(0, 0.1 + Utils.rand() * 1.15, 0);
        let windAngle = 0;
        let at = ((frame / framesCount) + Math.abs(cv.x + cv.z) * 0.2) % 1;
        if(at >= 0 && at < 0.25) {
            windAngle = -smoothstepAnim(0, 0.15, 0, 0.25, at);
        } 
        if(at >= 0.25 && at <= 0.4) {
            windAngle = -smoothstepAnim(0.15, 0, 0.25, 0.4, at);
        }
        if(at >= 0.4 && at <= 0.54) {
            windAngle = -smoothstepAnim(0, 0.3, 0.4, 0.54, at);
        }
        if(at >= 0.54 && at <= 0.60) {
            windAngle = -smoothstepAnim(0.3, 0.2, 0.54, 0.60, at);
        }
        if(at >= 0.60 && at <= 0.73) {
            windAngle = -smoothstepAnim(0.2, 0.55, 0.60, 0.73, at);
        }
        if(at >= 0.73 && at <= 1) {
            windAngle = -smoothstepAnim(0.55, 0, 0.73, 1, at);
        }
        
        v2.applyAxisAngle(new THREE.Vector3(0,0,1), windAngle);


        let ax = 1;
        let az = 0;
        if(Utils.rand() > 0.5) {
            ax = 0;
            az = 1;
        }
        v2.applyAxisAngle(new THREE.Vector3(ax, 0, az), (Utils.rand() * 2 - 1) * 0.25);
        v2.add(v1);

        let colorMult = 0.05 * Math.pow(Utils.rand(), 1.25) * 0.95;

        lines.push({
            x1: v1.x,
            y1: v1.y,
            z1: v1.z,
        
            x2: v2.x,
            y2: v2.y,
            z2: v2.z,
        
            c1r: 1 * colorMult, 
            c1g: 1 * colorMult, 
            c1b: 1 * colorMult,

            c2r: 1 * colorMult, 
            c2g: 1 * colorMult, 
            c2b: 1 * colorMult,
        });
    }

    // *************** grass - END














    // ************** grounded letters
    for(let i = 0; i < 500; i++) {
        let x = (Utils.rand() * 2 - 1) * 15;
        let z = (Utils.rand() * 2 - 1) * 15 + 0;
        let y = (Utils.rand()) * 1;

        let pos = new THREE.Vector3(x, y, z);
        pos.x += (Utils.rand() * 2 - 1) * 2;
        pos.z += (Utils.rand() * 2 - 1) * 2;
        pos.z = pos.z - pos.z % 0.375;

        let cv = curlNoise(pos.clone().multiplyScalar(groundM1)).multiplyScalar(groundDispStrength);
        pos.add(cv);



        
        // ************* animation params
        let r1 = ((x + y) % 0.015) / 0.015;
        r1 += frames / framesCount;
        r1 *= Math.PI * 2;
        pos.y += (Math.sin(r1)) * 0.2 + 0.2; 
        // ************* animation params - END




        let index = 0;
        index = Math.floor(33 + Utils.rand() * 52);
                          // 16 * 16 because uvs starts from the bottom 
        let t = indexToUvs(16 * 16 - index);

        let cm = Utils.rand();
        let color = {
            x: 100 * cm,
            y: 100 * cm,
            z: 100 * cm,
        };
        if(Utils.rand() > 0.15) {
            color.x = 100 * cm + Utils.rand() * 50 * cm;
            color.y = 30  * cm + Utils.rand() * 50 * cm;
            color.z = 10  * cm + Utils.rand() * 50 * cm;
        }

        let quad = new Quad(0,0,0, t.us, t.vs, t.ue, t.ve);

        quad =          quad
                        .scale(0.35)
                        .rotate(1, 0, 0, Utils.rand() * Math.PI)
                        .color(color.x * quadColorMult, color.y * quadColorMult, color.z * quadColorMult)
                        .translate(pos.x, pos.y, pos.z)

        quads.push(quad);
    }
    // ************** grounded letters - END





    // ************** cat
    let catquad = new Quad(0,0,0,    0.5, 0, 1, 0.5)
                      .scale(-2, 2)
                      .rotate(0, 1, 0, Math.PI)
                      .color(500 * quadColorMult, 500 * quadColorMult, 500 * quadColorMult)
                      .translate(0, 0, 0)

    let cv = curlNoise(new THREE.Vector3(0, 0, 0).multiplyScalar(groundM1)).multiplyScalar(groundDispStrength);
    catquad.translate(cv.x + 5, cv.y + 0.98, cv.z - 2);
    catquad.weight = 0.1;

    quads.push(catquad);
    // ************** cat - END











    // *************** good tree letters
    for(let i = 0; i < goodTreeFallingTextPositions.length; i++) {

        goodTreeFallingTextPositions[i].add(new THREE.Vector3(0.15, 0.2, 0));

        if(i === 0) createFallingText(goodTreeFallingTextPositions[i]);
        if(i === 1) createFallingText(goodTreeFallingTextPositions[i]);
        if(i === 2) createFallingText(goodTreeFallingTextPositions[i]);
        if(i === 3) createFallingText(goodTreeFallingTextPositions[i]);
        if(i === 4) createFallingText(goodTreeFallingTextPositions[i]);
        // if(i === 5) createFallingText(goodTreeFallingTextPositions[i]);
        if(i === 6) createFallingText(goodTreeFallingTextPositions[i]);
        if(i === 7) createFallingText(goodTreeFallingTextPositions[i]);
        if(i === 8) createFallingText(goodTreeFallingTextPositions[i]);
        // if(i === 9) createFallingText(goodTreeFallingTextPositions[i]);
        if(i === 10) createFallingText(goodTreeFallingTextPositions[i]);
        if(i === 11) createFallingText(goodTreeFallingTextPositions[i]);
        if(i === 12) createFallingText(goodTreeFallingTextPositions[i]);
    }
    // *************** good tree letters - END





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
function setGlobals() {
    let distanceMult = 1.25;
    // cameraPosition = new THREE.Vector3(14.5 * distanceMult, 10.4 * distanceMult, 28.9 * distanceMult);
    cameraPosition = new THREE.Vector3(-29, 0, 5);
    cameraTarget   = new THREE.Vector3(fieldSize * 0.05, 0.5, fieldSize * 0.05);

    let dv = new THREE.Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    dv.sub(cameraTarget);
    cameraFocalDistance = dv.length(); //33.8;


    minimumLineSize = 0.005;

    // bokehStrength  = 0.018;
    bokehStrength = 0.01;
    focalPowerFunction = 1;
    exposure = 0.0009;

    useBokehTexture = true;
    bokehTexturePath = "assets/bokeh/pentagon.png";
    quadsTexturePath = "assets/textures/texture2.png";







    let rotationFunction = [];
    let cumulativeValue  = 0;
    for(let i = 0; i < framesCount * motionBlurFrames; i++) {
        let rt = i / (framesCount * motionBlurFrames);

        let value = 0;

        // rt += 0.85;
        rt = rt % 1;

        if (rt < 0.15) {
            let t = (rt) / 0.15;
            value = smoothstepAnim(0, 1.6, 0, 1, t);
            rotationFunction.push(value);
        } else if (rt < 0.3) {
            let t = (rt - 0.15) / 0.15;
            value = smoothstepAnim(1.6, 0.05, 0, 1, t);
            rotationFunction.push(value);
        } else if (rt < 0.7) {
            value = 0.05;
            rotationFunction.push(value);
        } else if (rt < 0.85) {
            let t = (rt - 0.7) / 0.15;
            value = smoothstepAnim(0.05, 1, 0, 1, t);
            rotationFunction.push(value);    
        } else {
            let t = (rt - 0.85) / 0.15;
            value = smoothstepAnim(1, 0, 0, 1, t);
            rotationFunction.push(value);
        }

        cumulativeValue += value;
        rotationIntegral[i] = cumulativeValue; 
    }

    for(let i = 0; i < framesCount * motionBlurFrames; i++) {
        rotationIntegral[i] /= cumulativeValue; 
    }



    // let dn = Date.now();
    // console.log(dn);
    // Utils.setRandomSeed(dn.toString());
}

let fieldSize = 110;
let rotateOnce = false;
let rotationIntegral = [];
// use this function to create the lines that will be rendered
function createScene(frame) {

    Utils.setRandomSeed("1565731290467");

    let field = [];
    let field2 = [];
    let fieldYOffset = [];

    for(let i = 0; i < fieldSize; i++) {
        field.push([]);
        field2.push([]);
        fieldYOffset.push([]);
        for(let j = 0; j < fieldSize; j++) {
            field[i].push(0);
            fieldYOffset[i].push(0);
            field2[i].push(0);
        }
    }


    // // required for motion blur to work
    // preventOnControlsChangeReset = true;
    // controls.rotate(Math.sin(frame / framesCount * Math.PI * 2) * 0.1);
    // // // // if(!rotateOnce) {
    // // // //     controls.rotate(2.85);
    // // // //     rotateOnce = true;
    // // // // }
    // // // controls.rotate(2.85);

    // ***************** camera controls    
    let rt = frame / framesCount;
    rt = 0.25;
    // rt = 0.44;
    let yoa = 0;
    let bokehS = 0.125;
    if(rt < 0.15) {
        // do nothing
        bokehStrength = 0.005 + (1) * bokehS;
        yoa = 1;
    } else if(rt < 0.3) {
        let t = (rt-0.15) / 0.15;
        t = smoothstepAnim(0, 1, 0, 1, smoothstepAnim(0, 1, 0, 1, t));
        bokehStrength = 0.005 + (1-t) * bokehS;
        yoa = 1 - t;
    } else if (rt < 0.6) {
        let t = (rt-0.3) / 0.3;
        yoa = 0;
        bokehStrength = 0.005 + (t) * 0.01;
    } else {
        let t = (rt-0.6) / 0.4;
        t = smoothstepAnim(0, 1, 0, 1, smoothstepAnim(0, 1, 0, 1, t));
        yoa = t;

        bokehStrength = 0.005 + 0.01 + (t) * (bokehS - 0.01);
    }


    let cameraLookAt = new THREE.Vector3(fieldSize * 0.05, 0.5, fieldSize * 0.05);
    let cameraPos = new THREE.Vector3(-29 - fieldSize * 0.05, 0, 5 - fieldSize * 0.05);
    if(rt < 0.1) {
        // do nothing
    } else if (rt < 0.3) {
        let t = (rt - 0.1) / 0.2;
        t = smoothstepAnim(0, 1, 0, 1, smoothstepAnim(0, 1, 0, 1, t));
        cameraPos.applyAxisAngle(new THREE.Vector3(0, 0, 1), t * Math.PI * -0.13);
    } else if (rt < 0.6) {
        cameraPos.applyAxisAngle(new THREE.Vector3(0, 0, 1), 1 * Math.PI * -0.13);
    } else {
        let t = (rt - 0.6) / 0.4;
        t = smoothstepAnim(0, 1, 0, 1, smoothstepAnim(0, 1, 0, 1, t));
        cameraPos.applyAxisAngle(new THREE.Vector3(0, 0, 1), (1-t) * Math.PI * -0.13);
    }
    let integralT =  (frame / framesCount) * Math.PI * 4;
    // integralT = -Math.cos((integralT - Math.PI*0.5 - 159/1000)*0.5) + (13679 * integralT) / 10000 - Math.sin(integralT - 159/1000) + 0.4904;
    // normalize the integral to be in range [0...1];
    // integralT = (integralT / 17.1895516);
    // integralT = -Math.cos((integralT - Math.PI*0.5-17/500) * 0.5) / 5 + (2679*integralT)/2500 - 
    //             Math.sin(integralT - 17/500) + 0.105;
    // // normalize the integral to be in range [0...1];
    // integralT = (integralT / 13.46);

    // // original derivative: (sin(x - PI*0.5 - 0.159 + 0.103 + 0.022) + sin((x - PI*0.5 - 0.159 + 0.073 + 0.052)*0.5) * 0.1) + 1.3679 - 0.1873 - 0.110
    // integralT = -Math.cos((integralT-Math.PI/2-17/500)/2)/5+(5353*integralT)/5000-Math.sin(integralT-17/500) + 0.105;
    // // normalize the integral to be in range [0...1];
    // integralT = (integralT / 13.45);



    
    // already normalized to be in range [0...1];
    integralT = rotationIntegral[Math.floor(frame * motionBlurFrames)];
    cameraPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), integralT * Math.PI * 2);

    // cameraPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), 
    //     integralT * Math.PI * 2 + (Math.sin(integralT * Math.PI)) * Math.PI*0.175);
    cameraPos.add(new THREE.Vector3(fieldSize * 0.05, 0, fieldSize * 0.05));
    // // let savedCameraQuaternion = new THREE.Quaternion().copy(camera.quaternion); 
    camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    camera.lookAt(cameraLookAt);
    // ***************** camera controls - END    



















    let scalingFactor = 0.1;


    let minWidth   = 5;
    let maxWidth   = 40;
    let step       = 20;
    let numQuads   = 100;
    let quadHeight = 10;
    for(let i = 0; i < numQuads; i++) {

        if(i > 80) {
            minWidth   = 10;
            maxWidth   = 20;
            step       = 5;
            quadHeight = 4;
        }



        let wt = Utils.rand();
        let ht = Utils.rand();

        let width  = Math.floor(minWidth * wt + maxWidth * (1-wt));
        let height = Math.floor(minWidth * ht + maxWidth * (1-ht));

        width  = width  - (width  % step);
        height = height - (height % step);

        let xt = Math.floor(Utils.rand() * fieldSize);
        let zt = Math.floor(Utils.rand() * fieldSize);
        
        let xs = Math.max(Math.floor(xt - width  * 0.5),   0);
        let zs = Math.max(Math.floor(zt - height * 0.5),   0);

        let xe = Math.min(Math.floor(xt + width * 0.5), fieldSize);
        let ze = Math.min(Math.floor(zt + height * 0.5), fieldSize);


        let cellHeight = Math.floor(Utils.rand() * quadHeight);
        let cellOffset = (Utils.rand() * 2 - 1) * 25 * yoa; 

        // now add the coefficients to each cell
        for(let x = xs; x < xe; x++) {
            for(let z = zs; z < ze; z++) {
                field[z][x] += cellHeight; // Math.floor(Utils.rand() * quadHeight);
                fieldYOffset[z][x] += cellOffset;
            }
        }
    }


    let chimneyDrawn = 0;
    let flagsDrawn = 0;
    let samples = Math.floor(fieldSize * fieldSize * 0.5);
    let maxSampleSquareSize = 20;
    for(let i = 0; i < samples; i++) {
        let xs = Math.floor(Utils.rand() * fieldSize);
        let zs = Math.floor(Utils.rand() * fieldSize);
        let ys = field[zs][xs];
        let yo = fieldYOffset[zs][xs];

        let xw = 1;
        let zw = 1;


        // this sample is occupied
        if(field2[zs][xs] !== 0) continue;


        // for(let j = 1; j < maxSampleSquareSize; j++) {
        //     if((xs + j) >= fieldSize) continue;
            
        //     if(field[zs][xs + j] == ys  &&  field2[zs][xs + j] === 0  ) xw++; 
        // }

        // for(let j = 1; j < maxSampleSquareSize; j++) {
        //     if((zs + j) >= fieldSize) continue;
            
        //     if(field[zs + j][xs] == ys  &&  field2[zs + j][xs] === 0  ) zw++; 
        // }

        function possible(xs, zs, xw, zw) {


            for(let x = 0; x < xw; x++) {
                for(let z = 0; z < zw; z++) {
                    if( field[zs + z][xs + x] !== ys || 
                        field2[zs + z][xs + x] !== 0) return false;
                }
            }

            return true;
        }

        let bestArea  = 1;
        let bestAreaX = 1;
        let bestAreaZ = 1;
        for(let x = 1; x < maxSampleSquareSize; x++) {
            for(let z = 1; z < maxSampleSquareSize; z++) {
                let area = (x+1) * (z+1);
                let xt = x;
                let zt = z;

                if((xs + xt) > (fieldSize - 1)) {
                    xt = fieldSize - 1 - xs;
                }
                if((zs + zt) > (fieldSize - 1)) {
                    zt = fieldSize - 1 - zs;
                }

                if(possible(xs, zs, xt, zt) && area > bestArea) {
                    bestArea  = area;
                    bestAreaX = xt;
                    bestAreaZ = zt;
                }
            }
        }

        xw = bestAreaX;
        zw = bestAreaZ;
        
        for(let xx = 0; xx < xw; xx++) {
            for(let zz = 0; zz < zw; zz++) {
                field2[zs + zz][xs + xx] = 1;
            }
        }







        let color = {
            x: 0.045,
            y: 0.045,
            z: 0.045,
        };
        let quadColor = { x: color.x, y: color.y, z: color.z };

        if(Utils.rand() > (1 - zs * (1 / fieldSize))) {
            color = {
                x: 0.1 * (1 + Utils.rand()),
                y: 0.03,
                z: 0.01,
            };
            quadColor = { x: color.x, y: color.y * 1.75, z: color.z };
        }


        // **************** flags 
        if(Utils.rand() > 0.5 && ys > 13 && bestArea > 15 && bestArea < 45 && flagsDrawn < 4) {
            let quad = new Quad(0,0,0,    0.5, 0, 1, 0.5);
            let size = Math.min(xw, zw) * 1.5;
            let quadColorMult = 150 * Math.pow(size, 1.5);

            flagsDrawn++;

            quad =  quad
                    .scale(size * scalingFactor)
                    // .rotate(1, 0, 0, Math.PI * 0.5)
                    .color(
                        quadColor.x * quadColorMult, 
                        quadColor.y * quadColorMult, 
                        quadColor.z * quadColorMult)    
                    .translate((xs + size * 0.5) * scalingFactor, (ys + yo + size * 0.5) * scalingFactor, (zs - size * 0.0) * scalingFactor)
    
            quads.push(quad);
        }
        // **************** flags - END
        

        lines.push({
            x1: xs * scalingFactor,
            y1: (ys+yo) * scalingFactor,
            z1: zs * scalingFactor,
        
            x2: xs * scalingFactor,
            y2: (ys+yo) * scalingFactor,
            z2: (zs+zw) * scalingFactor,
        
            c1r: color.x, 
            c1g: color.y, 
            c1b: color.z,

            c2r: color.x, 
            c2g: color.y, 
            c2b: color.z,
        });

        lines.push({
            x1: xs    * scalingFactor,
            y1: (ys+yo) * scalingFactor,
            z1: zs    * scalingFactor,
        
            x2: (xs+xw) * scalingFactor,
            y2: (ys+yo)  * scalingFactor,
            z2: (zs) * scalingFactor,
        
            c1r: color.x,
            c1g: color.y,
            c1b: color.z,

            c2r: color.x,
            c2g: color.y,
            c2b: color.z,
        });




        // "X" ceiling ?
        if(Utils.rand() > 0.875 && Math.abs(xw - zw) < 3 && (xw + zw) > 5) {
            lines.push({
                x1: xs * scalingFactor,
                y1: (ys+yo) * scalingFactor,
                z1: zs * scalingFactor,
            
                x2: (xs+xw) * scalingFactor,
                y2: (ys+yo) * scalingFactor,
                z2: (zs+zw) * scalingFactor,
            
                c1r: color.x, 
                c1g: color.y, 
                c1b: color.z,
    
                c2r: color.x, 
                c2g: color.y, 
                c2b: color.z,
            });
    
            lines.push({
                x1: xs * scalingFactor,
                y1: (ys+yo) * scalingFactor,
                z1: (zs+zw) * scalingFactor,
            
                x2: (xs+xw) * scalingFactor,
                y2: (ys+yo)  * scalingFactor,
                z2: (zs) * scalingFactor,
            
                c1r: color.x,
                c1g: color.y,
                c1b: color.z,
    
                c2r: color.x,
                c2g: color.y,
                c2b: color.z,
            });
        }

        

        // check if you need to make an upward wall
        if((zs+zw) <= (fieldSize - 1)) {
            let nyVal = field[zs+zw][xs];
            let cm = nyVal < ys ? 0.25 : 1;

            if(nyVal !== ys) {
                lines.push({
                    x1: xs     * scalingFactor,
                    y1: (ys+yo)  * scalingFactor,
                    z1: (zs+zw) * scalingFactor,
                
                    x2: xs     * scalingFactor,
                    y2: (nyVal+yo) * scalingFactor,
                    z2: (zs+zw) * scalingFactor,
                
                    c1r: color.x * cm,
                    c1g: color.y * cm,
                    c1b: color.z * cm,
    
                    c2r: color.x * cm,
                    c2g: color.y * cm,
                    c2b: color.z * cm,
                });
            }

            // make windows
            if(Utils.rand() > 0.75) {// (Utils.rand() > 0.65 && ys > 5) || (Utils.rand() > 0.9)) {
                let yDir = nyVal - ys < 0 ? -1 : 1;
                let yDelta = Math.floor(Math.abs(nyVal - ys));
                let windows = Math.floor(Utils.rand() * 10);
                for(let r = 0; r < xw; r++) {
                    for(let r2 = 0; r2 < yDelta; r2++) {
                        if(Utils.rand() > 0.25) continue;

                        windows--;
                        if(windows >= 0) 
                            makeWindow(xs, ys + yo + r2 * yDir, zs + r, color, cm, scalingFactor, "z");
                    }
                }
            }
        }
        
        // check if you need to make an upward wall
        if((xs + xw) <= (fieldSize - 1)) {
            let nyVal = field[zs][xs+xw];
            let cm = nyVal < ys ? 0.25 : 1;

            if(nyVal !== ys) {
                lines.push({
                    x1: (xs+xw) * scalingFactor,
                    y1: (ys+yo)  * scalingFactor,
                    z1: (zs) * scalingFactor,
                
                    x2: (xs+xw)     * scalingFactor,
                    y2: (nyVal+yo) * scalingFactor,
                    z2: (zs) * scalingFactor,
                
                    c1r: color.x * cm,
                    c1g: color.y * cm,
                    c1b: color.z * cm,
    
                    c2r: color.x * cm,
                    c2g: color.y * cm,
                    c2b: color.z * cm,
                });


                // make windows
                if(Utils.rand() > 0.75) {// (Utils.rand() > 0.65 && ys > 5) || (Utils.rand() > 0.9)) {
                    let yDir = nyVal - ys < 0 ? -1 : 1;
                    let yDelta = Math.floor(Math.abs(nyVal - ys));
                    let windows = Math.floor(Utils.rand() * 10);
                    for(let r = 0; r < xw; r++) {
                        for(let r2 = 0; r2 < yDelta; r2++) {
                            if(Utils.rand() > 0.25) continue;
    
                            windows--;
                            if(windows >= 0)
                                makeWindow(xs + r, ys + yo + r2 * yDir, zs, color, cm, scalingFactor, "x");
                        }
                    }
                }
                
            }
        }


        // *************** create enforced walls 
        if(Utils.rand() > 0.8) {
            if((xs + xw) <= (fieldSize - 1)) {
         
                let nyVal = field[zs][xs+xw];
                if(nyVal !== ys) {
                    let ic = Math.floor(2.5 * xw * Utils.rand());
                    let cm = nyVal < ys ? 0.25 : 1;

                    for(let ii = 0; ii < ic; ii++) {
                        lines.push({
                            x1: (xs + (ii/ic) * xw) * scalingFactor,
                            y1: (ys + yo)  * scalingFactor,
                            z1: (zs) * scalingFactor,
                     
                            x2: (xs + (ii/ic) * xw) * scalingFactor,
                            y2: (nyVal + yo) * scalingFactor,
                            z2: (zs) * scalingFactor,
                     
                            c1r: color.x * 3 * cm,
                            c1g: color.y * 3 * cm,
                            c1b: color.z * 3 * cm,
            
                            c2r: color.x * 3 * cm,
                            c2g: color.y * 3 * cm,
                            c2b: color.z * 3 * cm,
                        });

                        // ***************** ceiling
                        lines.push({
                            x1: (xs + (ii/ic) * xw) * scalingFactor,
                            y1: (ys+yo)  * scalingFactor,
                            z1: (zs) * scalingFactor,
                     
                            x2: (xs + (ii/ic) * xw) * scalingFactor,
                            y2: (ys+yo) * scalingFactor,
                            z2: (zs + zw) * scalingFactor,
                     
                            c1r: color.x * 3,
                            c1g: color.y * 3,
                            c1b: color.z * 3,
            
                            c2r: color.x * 3,
                            c2g: color.y * 3,
                            c2b: color.z * 3,
                        });
                        // ***************** ceiling - END
                    }
                }
            }

            if((zs + zw) <= (fieldSize - 1)) {
         
                let nyVal = field[zs+zw][xs];
                if(nyVal !== ys) {
                    let ic = Math.floor(2.5 * zw * Utils.rand());
                    let cm = nyVal < ys ? 0.25 : 1;

                    for(let ii = 0; ii < ic; ii++) {
                        lines.push({
                            x1: (xs) * scalingFactor,
                            y1: (ys + yo)  * scalingFactor,
                            z1: (zs + (ii/ic) * zw) * scalingFactor,
                     
                            x2: (xs) * scalingFactor,
                            y2: (nyVal + yo) * scalingFactor,
                            z2: (zs + (ii/ic) * zw) * scalingFactor,
                     
                            c1r: color.x * 3 * cm,
                            c1g: color.y * 3 * cm,
                            c1b: color.z * 3 * cm,
            
                            c2r: color.x * 3 * cm,
                            c2g: color.y * 3 * cm,
                            c2b: color.z * 3 * cm,
                        });

                        // lines.push({
                        //     x1: (xs) * scalingFactor,
                        //     y1: ys  * scalingFactor,
                        //     z1: (zs + (ii/ic) * zw) * scalingFactor,
                     
                        //     x2: (xs + xw) * scalingFactor,
                        //     y2: ys * scalingFactor,
                        //     z2: (zs + (ii/ic) * zw) * scalingFactor,
                     
                        //     c1r: color.x * 3,
                        //     c1g: color.y * 3,
                        //     c1b: color.z * 3,
            
                        //     c2r: color.x * 3,
                        //     c2g: color.y * 3,
                        //     c2b: color.z * 3,
                        // });

                    }
                }
            }
        }
        // *************** create enforced walls - END







        // ************ glitters in the sky 
        if(Utils.rand() > 0.95 && ys > 6 && chimneyDrawn < 5) {

            chimneyDrawn++;
            let gCount = Math.floor(Utils.rand() * 7) + 4;
            let zAcc = 0;
            let yt = ys + 1;

            for(let ir = 0; ir < gCount; ir++) {

                let zt = 1; // Utils.rand() > (0.95 / (1 + ir * 1.75)) ? 1 : 0;
                zAcc += zt * ir * 0.25;

                let randStart = Utils.rand() * Math.PI * 2;
                let xst = Math.sin((frame / framesCount) * Math.PI * 4 + randStart) * (0.2 + ir * 0.3);
                let zst = Math.cos((frame / framesCount) * Math.PI * 4 + randStart) * (0.2 + ir * 0.3);

                makeGlitter(xst + xs + zAcc + Utils.rand() * 2, yt + yo + ir * 2, zst + zs + Utils.rand() * 2, color, scalingFactor);
            }
        }

        if(Utils.rand() > 0.99) {
            let randStart = Utils.rand() * Math.PI * 2;
            makeGlitter(xs, ys + yo + 5 + Utils.rand() * 20 + Math.sin((frame / framesCount) * Math.PI * 4 + randStart) * 2.5, zs, color, scalingFactor);
        }
        // ************ glitters in the sky - END 
    }




    // ******************** ground 
    let gs = 0.75;
    for(let i = 0; i < Math.floor(fieldSize * gs); i++) {
        let yp = -0.5;
        let cm = Math.abs((i % 2) - 1) * 0.5 + 0.15;
        


        let im = i / gs;

        lines.push({
            x1: (-fieldSize) * scalingFactor,
            y1: (yp) * scalingFactor,
            z1: (im) * scalingFactor,
     
            x2: (fieldSize*2) * scalingFactor,
            y2: (yp) * scalingFactor,
            z2: (im) * scalingFactor,
     
            weight: 0.05,

            c1r: 0.6 * cm,
            c1g: 0.6 * cm,
            c1b: 0.6 * cm,

            c2r: 0.6 * cm,
            c2g: 0.6 * cm,
            c2b: 0.6 * cm,
        });

        lines.push({
            x1: (im) * scalingFactor,
            y1: (yp) * scalingFactor,
            z1: (-fieldSize) * scalingFactor,
     
            x2: (im) * scalingFactor,
            y2: (yp) * scalingFactor,
            z2: (fieldSize*2) * scalingFactor,
     
            weight: 0.05,

            c1r: 0.6 * cm,
            c1g: 0.6 * cm,
            c1b: 0.6 * cm,

            c2r: 0.6 * cm,
            c2g: 0.6 * cm,
            c2b: 0.6 * cm,
        });
    }
    // ******************** ground - END 


}

function makeGlitter(x, y, z, color, scalingFactor) {
    for(let it = 0; it < 6; it++) {

        let x1 = 0, x2 = 0, z1 = 0, z2 = 0, y1 = 0, y2 = 0;
        let sc = 0.6;
        switch(it) {
            case 0: 
                x1 = +1.2 * sc; x2 = 1.6 * sc; break;
            case 1: 
                x1 = -1.2 * sc; x2 = -1.6 * sc; break;
            case 2: 
                z1 = +1.2 * sc; z2 = 1.6 * sc; break;
            case 3: 
                z1 = -1.2 * sc; z2 = -1.6 * sc; break;
            case 4: 
                y1 = +1.2 * sc; y2 = +1.6 * sc; break;
            case 5: 
                y1 = -1.2 * sc; y2 = -1.6 * sc; break;
        }

        lines.push({
            x1: (x + x1) * scalingFactor,
            y1: (y + y1) * scalingFactor,
            z1: (z + z1) * scalingFactor,
     
            x2: (x + x2) * scalingFactor,
            y2: (y + y2) * scalingFactor,
            z2: (z + z2) * scalingFactor,
     
            c1r: color.x * 3,
            c1g: color.y * 3,
            c1b: color.z * 3,

            c2r: color.x * 3,
            c2g: color.y * 3,
            c2b: color.z * 3,
        });
    }
}

function makeWindow(x, y, z, color, cm, scalingFactor, dir) {
    let xm = 0;
    let zm = 0;
    if(dir == "x") xm = 1;
    if(dir == "z") zm = 1;

    lines.push({
        x1: x * scalingFactor,
        y1: y * scalingFactor,
        z1: z * scalingFactor,
    
        x2: (x+0.5*xm) * scalingFactor,
        y2: (y) * scalingFactor,
        z2: (z+0.5*zm) * scalingFactor,
    
        c1r: color.x * cm, c1g: color.y * cm, c1b: color.z * cm,
        c2r: color.x * cm, c2g: color.y * cm, c2b: color.z * cm,
    });
    lines.push({
        x1: x * scalingFactor,
        y1: y * scalingFactor,
        z1: z * scalingFactor,
    
        x2: (x) * scalingFactor,
        y2: (y-0.5) * scalingFactor,
        z2: z * scalingFactor,
    
        c1r: color.x * cm, c1g: color.y * cm, c1b: color.z * cm,
        c2r: color.x * cm, c2g: color.y * cm, c2b: color.z * cm,
    });
    lines.push({
        x1: x * scalingFactor,
        y1: (y-0.5) * scalingFactor,
        z1: z * scalingFactor,
    
        x2: (x+0.5*xm) * scalingFactor,
        y2: (y-0.5) * scalingFactor,
        z2: (z+0.5*zm) * scalingFactor,
    
        c1r: color.x * cm, c1g: color.y * cm, c1b: color.z * cm,
        c2r: color.x * cm, c2g: color.y * cm, c2b: color.z * cm,
    });
    lines.push({
        x1: (x+0.5*xm) * scalingFactor,
        y1: (y-0.5) * scalingFactor,
        z1: (z+0.5*zm) * scalingFactor,
    
        x2: (x+0.5*xm) * scalingFactor,
        y2: (y) * scalingFactor,
        z2: (z+0.5*zm) * scalingFactor,
    
        c1r: color.x * cm, c1g: color.y * cm, c1b: color.z * cm,
        c2r: color.x * cm, c2g: color.y * cm, c2b: color.z * cm,
    });
}


function smoothstepAnim(from, to, animStart, animEnd, animCurrent) {
    if(animCurrent > animEnd) animCurrent = animEnd;

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
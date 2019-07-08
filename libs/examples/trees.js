function setGlobals() {
    cameraPosition = new THREE.Vector3(0, 20, 70);
    cameraTarget   = new THREE.Vector3(0, 0, 0);
    cameraFocalDistance = 58.4;

    bokehStrength  = 0.01;
}

// use this function to create the lines that will be rendered
function createScene(frame) {
    
    Utils.setRandomSeed("cauliflower1");


    function createTree(sv, relRot, level) {
        if(level >= 6) return;

        let v1 = sv.clone();
        let v2 = new THREE.Vector3(0, (1 + ((6 - level) * 0.5)) * (Utils.rand() + 0.15), 0);
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


        if(Utils.rand() > 0.3)
            createTree(v2, relRot - 0.5, level + 1);
        
        if(Utils.rand() > 0.85)
            createTree(v2, relRot + 0.0, level + 1);

        if(Utils.rand() > 0.3)
            createTree(v2, relRot + 0.5, level + 1);



        if(level === 5 && (Math.abs(relRot) > 0.5) && Utils.rand() > 0.5) {
            createFallingText(v2);
        } 
    }



    for(let i = 0; i < 40; i++) {

        let x = (Utils.rand() * 2 - 1) * 30;
        let z = -(Utils.rand()) * 90 + 30;

        let pos = new THREE.Vector3(x, 0, z);
        pos.x += (Utils.rand() * 2 - 1) * 2;
        pos.z += (Utils.rand() * 2 - 1) * 2;

        createTree(pos, 0, 1);        
    }



    function createFallingText(start) {

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


            let maxRot = 0.1 + Utils.rand() * 0.3;
            let maxRotSpeed = 0.5 + Utils.rand() * 0.9;
            let a1 = Math.sin(a1Start + i * maxRotSpeed) * maxRot;

            let color = {
                x: 100,
                y: 100,
                z: 100,
            };
            if(Utils.rand() > 0.85) {
                color.x = 10;
                color.y = 30;
                color.z = 100;
            }

            let quad = new Quad(0,0,0, t.us, t.vs, t.ue, t.ve);

            quad =          quad
                            .scale(0.5)
                            .translate(0, 1, 0)
                            .rotate(0, 0, 1, a1)
                            .translate(-(quad.v1.x + quad.v2.x) / 2, 0, 0)
                            .color(color.x, color.y, color.z)
                            .translate(start.x, start.y - 0.5 - i * 0.35, start.z)
                            .translate(0, -1, 0)

            quads.push(quad);
        }
    }




    // *************** grass
    for(let i = -80; i < 80; i++) {
        let v1 = new THREE.Vector3( -100, 0, i * 0.375 );
        let v2 = new THREE.Vector3( 100,  0, i * 0.375 );

        let color = 1;

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

            weight: 0.25,
        });
    }



    for(let i = 0; i < 85000; i++) {
        let v1 = new THREE.Vector3(
            (Utils.rand() * 2 - 1) * 45,
            0, // (Utils.rand() * 2 - 1) * 30,
            Math.floor((Utils.rand() * 2 - 1) * 135) * 0.375,
        );

        let v2 = new THREE.Vector3(0, 0.1 + Utils.rand() * 1.15, 0);
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
        us: us,
        vs: vs,

        ue: ue,
        ve: ve,
    }
}
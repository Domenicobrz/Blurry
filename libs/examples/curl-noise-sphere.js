function createLines() {
    let nrings = 150;

    for(let j = 0; j < nrings; j++) {
        let angle = (j / nrings) * Math.PI;
        let p = new THREE.Vector3(0, 0, 1);
        p.applyAxisAngle(new THREE.Vector3(1, 0, 0), angle);

        let rad = p.y;
        let z   = p.z;

        let trad = 5.75;

        let nsegments = 70 + Math.abs(Math.floor(rad * 360));

        for(let i = 0; i < nsegments; i++) {

            let a1 = (i / nsegments) * Math.PI * 2;
            let a2 = ((i+1) / nsegments) * Math.PI * 2;

            let frad = trad;
            if(Math.random() > 0.92) frad = (frad + 0.15);

            let x1 = Math.cos(a1) * rad * frad;
            let y1 = Math.sin(a1) * rad * frad;
            let z1 = z                  * frad;

            let x2 = Math.cos(a2) * rad * frad;
            let y2 = Math.sin(a2) * rad * frad;
            let z2 = z                  * frad;

            let noiseSpeed = 0.5;
            let noiseStrength1 = 0.1 + curlNoise(new THREE.Vector3(x1 * noiseSpeed * 0.3, y1 * noiseSpeed * 0.3, z1 * noiseSpeed * 0.3)).x * 0.7;
            let noiseStrength2 = 0.1 + curlNoise(new THREE.Vector3(x2 * noiseSpeed * 0.3, y2 * noiseSpeed * 0.3, z2 * noiseSpeed * 0.3)).x * 0.7;
            let v1 = curlNoise(new THREE.Vector3(x1 * noiseSpeed, y1 * noiseSpeed, z1 * noiseSpeed)).multiplyScalar(noiseStrength1);
            let v2 = curlNoise(new THREE.Vector3(x2 * noiseSpeed, y2 * noiseSpeed, z2 * noiseSpeed)).multiplyScalar(noiseStrength2);

            let colorMult = 0.1;
            let colorMult2 = 0.1;


            let ldir = new THREE.Vector3(-0.2, -0.35, -0.5);
            ldir.normalize();
            ldir.multiplyScalar(-1);

            let normal = new THREE.Vector3(x1, y1, z1);
            normal.normalize();

            let diffuse1 = Math.pow(Math.max(normal.dot(ldir), 0.0), 3.0);
            let diffuse2 = Math.pow(Math.max(normal.dot(ldir), 0.0), 1.5);
            colorMult *= diffuse1;
            colorMult2 *= diffuse1;
            colorMult += 0.002;
            colorMult2 += 0.002;


            let t = 1; 

            lines.push({
                x1: x1 + v1.x,
                y1: y1 + v1.y,
                z1: z1 + v1.z,
            
                x2: x2 + v2.x,
                y2: y2 + v2.y,
                z2: z2 + v2.z,
            
                c1r: 1 * colorMult, 
                c1g: 1 * colorMult * t, 
                c1b: 1 * colorMult * t,

                c2r: 1 * colorMult, 
                c2g: 1 * colorMult * t, 
                c2b: 1 * colorMult * t,
            });

            if(Math.random() > 0.975) {

                let rc = 2;
                let rd1 = 1 + Math.random() * 0.2
                let rd2 = rd1 + Math.pow(Math.random(), 2) * 0.2;
                if(Math.random() > 0.8) {
                    rc = 6;
                }

                lines.push({
                    x1: (x1 + v1.x) * rd1,
                    y1: (y1 + v1.y) * rd1,
                    z1: (z1 + v1.z) * rd1,
                
                    x2: (x1 + v1.x) * rd2,
                    y2: (y1 + v1.y) * rd2,
                    z2: (z1 + v1.z) * rd2,
                
                    c1r: rc * colorMult2, 
                    c1g: rc * colorMult2, 
                    c1b: rc * colorMult2,
    
                    c2r: rc * colorMult2, 
                    c2g: rc * colorMult2, 
                    c2b: rc * colorMult2,
                });
            }
           
        }
    }
}
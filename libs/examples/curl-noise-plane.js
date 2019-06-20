function createLines() {
    for(let j = -50; j < 50; j++) {
        for(let i = -50; i < 50; i++) {
            let x1 = i * 0.25;
            let y1 = 0;
            let z1 = j * 0.25; 

            let x2 = (i+1) * 0.25;
            let y2 = 0;
            let z2 = j * 0.25; 

            let v1 = curlNoise(new THREE.Vector3(x1 * 0.1, y1 * 0.1, z1 * 0.1 + 200));
            let v2 = curlNoise(new THREE.Vector3(x2 * 0.1, y2 * 0.1, z2 * 0.1 + 200));

            let colorMult = 0.1;

            colorMult *= Math.exp(-Math.abs(j * 0.025));

            lines.push({
                x1: x1 + v1.x,
                y1: y1 + v1.y,
                z1: z1 + v1.z,
            
                x2: x2 + v2.x,
                y2: y2 + v2.y,
                z2: z2 + v2.z,
            
                c1r: 1 * colorMult, 
                c1g: 1 * colorMult, 
                c1b: 1 * colorMult,

                c2r: 1 * colorMult, 
                c2g: 1 * colorMult, 
                c2b: 1 * colorMult,
            });


            if(Math.random() < 0.6) {
                
                let y = Math.random();
                if(Math.random() > 0.8) {
                    colorMult *= 4;
                }

                lines.push({
                    x1: x1 + v1.x,
                    y1: y1 + v1.y,
                    z1: z1 + v1.z,
                
                    x2: x1 + v1.x,
                    y2: y1 + v1.y + y,
                    z2: z1 + v1.z,
                
                    c1r: 1 * colorMult, 
                    c1g: 1 * colorMult, 
                    c1b: 1 * colorMult,

                    c2r: 1 * colorMult, 
                    c2g: 1 * colorMult, 
                    c2b: 1 * colorMult,
                });

            }

        }
    }
}

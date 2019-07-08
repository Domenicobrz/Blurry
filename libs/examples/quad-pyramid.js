function createScene(frames) {
    Utils.setRandomSeed("Keanu Reeves");

    for(let i = 50; i < 100; i++) {

        let xo = 0;
        let yo = 0;
        let zo = 0;
        
        if(i > 0) {
            xo = Utils.rand() * 1 - 0.5;
            yo = Utils.rand() * 1 - 0.5;
            zo = 0; 
        }


        let ii = 100 + (50 - i);
        let rt = -(ii-50)*0.1 + frames * 0.042;
        if(rt > 1) rt = 1;
        if(rt < 0) rt = 0;

        rt = rt * rt * (3.0 - 2.0 * rt);
        rt *= Math.PI * 0.5;

        if(i % 2 === 1) rt *= -1;



        for(let j = 0; j < 4; j++) {
            let angle1 = (j / 4) * Math.PI * 2 + rt;
            let angle2 = ((j+1) / 4) * Math.PI * 2 + rt;
            let rad1 = (1 - Math.abs(Math.abs(i - 50) / 50)) * 9;
            let rad2 = (1 - Math.abs(Math.abs(i - 50) / 50)) * 9;

            let x1 = Math.cos(angle1) * rad1;
            let y1 = Math.sin(angle1) * rad1;
            let z1 = (i / 10 - 5) * 2;

            let x2 = Math.cos(angle2) * rad2;
            let y2 = Math.sin(angle2) * rad2;
            let z2 = (i / 10 - 5) * 2;

            let c1 = [0.5, 0.5,  1];
            let c2 = [1, 0.075, 0];

            let zt = (z1 + 10) / 20;

            let cm = 8;
            let dzt = Math.abs(zt - 0.5) / 0.5;
            cm *= dzt;

            if(z1 > 0) zt = Math.pow(zt, 0.4);
                
            let c = [
                c1[0] * zt + c2[0] * (1-zt),
                c1[1] * zt + c2[1] * (1-zt),
                c1[2] * zt + c2[2] * (1-zt)
            ]

            lines.push({
                x1: x1 + xo,
                y1: y1 + yo,
                z1: z1 + zo,
            
                x2: x2 + xo,
                y2: y2 + yo,
                z2: z2 + zo,
            
                c1r: c[0] * cm, 
                c1g: c[1] * cm,
                c1b: c[2] * cm,

                c2r: c[0] * cm, 
                c2g: c[1] * cm,
                c2b: c[2] * cm,
            });
        }
    }
}
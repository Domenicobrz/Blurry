// use this function to create the lines that will be rendered
function createQuads(frame) {
    
    for(let j = -100; j < 100; j++) 
    for(let i = -100; i < 100; i++) {

        let yo = Math.sin(i * 0.1 * 5) * 2;
        // yo     += Math.cos(j * 0.1 * 5) * 2;

        let c1 = Math.random();

        // if(Math.random() > 0.3) continue;


        let t = indexToUvs(Math.floor(Math.random() * 100));

        // quads.push(
        //     new Quad(0,0,0, t.us, t.vs, t.ue, t.ve)
        //     // .rotate(0,0,1, i*0.12 + j * 0.3)
        //     // .rotate(1,0,0, i*0.25)
        //     // .rotate(0,1,0, j*0.2)
        //     .color(25, 25, 25)
        //     .scale(2)
        //     // .rotate(0,0,1, Math.random() * 1.28)
        //     // .rotate(1,0,0, Math.random() * 1.28)
        //     // .rotate(0,1,0, Math.random() * 1.28)
        //     .translate(i * 1, 0, j * 1)
        //     .translate(0, Math.cos(i * 0.3) + Math.sin(j * 0.25), 0)
        //     // .translate(0, Math.cos(i * 0.5) * 0.2  + Math.sin(j * 1) * 0.2 )
        // );

        // quads.push({
        //     x1: -1 + i * 1.5,
        //     y1: -1 + yo,
        //     z1: -1 + j * 2 + Math.random() * 2 - 1,
    
        //     x2: +1 + i * 1.5,
        //     y2: +1 + yo,
        //     z2: +1 + j * 2 + Math.random() * 2 - 1,
    
        //     r: 5,
        //     g: c1 > 0.05 ? 5 : 1.7,
        //     b: c1 > 0.05 ? 5 : 1.7,
        // });
    }

    let color = 27500;
    quads.push(
        new Quad(0,0,0, 0,0,1,1)
        .color(color, color, color)
        .scale(8.5, 10)
    );
    quads.push(
        new Quad(0,0,0, 0,0,1,1)
        .color(color, color, color)
        .scale(-8.5, 10)
        .translate(8.5, 0, 0)
    );
    quads.push(
        new Quad(0,0,0, 0,0,1,1)
        .color(color, color, color)
        .scale(-8.5, 10)
        .translate(-8.5, 0, 0)
    );
}


function indexToUvs(index) {
    let x = index % 10;
    let y = Math.floor(index / 10);

    let us = x / 10;
    let vs = y / 10;

    let ue = us + 0.1;
    let ve = vs + 0.1;

    return {
        us: us,
        vs: vs,

        ue: ue,
        ve: ve,
    }
}
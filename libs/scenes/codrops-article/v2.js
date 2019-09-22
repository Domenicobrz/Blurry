function setGlobals() {
    pointsPerFrame     = 50000;

    cameraPosition = new THREE.Vector3(0, 0, 115);
    cameraFocalDistance = 100;

    minimumLineSize = 0.005;

    bokehStrength = 0.02; 
    focalPowerFunction = 1;
    exposure = 0.009;
    distanceAttenuation = 0.002;

    useBokehTexture = true;
    bokehTexturePath = "assets/bokeh/pentagon2.png";

    backgroundColor[0] *= 0.8;
    backgroundColor[1] *= 0.8;
    backgroundColor[2] *= 0.8;
}

let rand, nrand;
let vec3      = function(x,y,z) { return new THREE.Vector3(x,y,z) };

function createScene() {
    Utils.setRandomSeed("3926153465010");

    rand  = function() { return Utils.rand(); };
    nrand = function() { return rand() * 2 - 1; };

    computeWeb();
    computeSparkles();
}

function computeWeb() { 
    let r1 = 35;
    let r2 = 17;
    for(let j = 0; j < r2; j++) {
        for(let i = 0; i < r1; i++) {
            let phi1   = (j + i * 0.075) / r2 * Math.PI * 2;
            let theta1 = i / r1 * Math.PI - Math.PI * 0.5;
            
            let phi2   = (j + (i+1) * 0.075) / r2 * Math.PI * 2;
            let theta2 = (i+1) / r1 * Math.PI - Math.PI * 0.5;


            let x1 = Math.sin(phi1) * Math.cos(theta1);
            let y1 = Math.sin(theta1);
            let z1 = Math.cos(phi1) * Math.cos(theta1);

            let x2 = Math.sin(phi2) * Math.cos(theta2);
            let y2 = Math.sin(theta2);
            let z2 = Math.cos(phi2) * Math.cos(theta2);


            lines.push(
                new Line({
                    v1: vec3(x1,z1,y1).multiplyScalar(15),
                    v2: vec3(x2,z2,y2).multiplyScalar(15),
                    c1: vec3(5,5,5),
                    c2: vec3(5,5,5),
                })
            );
        }
    }
}
function computeSparkles() { }
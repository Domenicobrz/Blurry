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

    for(let i = 0; i < 10; i++) {
        lines.push(
            new Line({
                v1: vec3(i, 0, 15),
                v2: vec3(i, 10, 15),

                c1: vec3(5, 5, 5),
                c2: vec3(5, 5, 5),
            })
        );    
    }
}
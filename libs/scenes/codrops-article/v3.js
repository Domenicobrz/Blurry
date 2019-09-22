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

    // intersect many 3d planes against all the lines we made so far
    for(let i = 0; i < 4500; i++) {
        let x0 = nrand() * 15;
        let y0 = nrand() * 15;
        let z0 = nrand() * 15;

        let dir = vec3(nrand(), nrand(), nrand()).normalize();
        findIntersectingEdges(vec3(x0, y0, z0), dir);
    }
}
function computeSparkles() { }


function findIntersectingEdges(center, dir) {

    let contactPoints = [];
    for(line of lines) {
        let ires = intersectsPlane(
            center, dir,
            line.v1, line.v2
        );

        if(ires === false) continue;

        contactPoints.push(ires);
    }

    if(contactPoints.length < 2) return;

    let randCpIndex = Math.floor(rand() * contactPoints.length);
    let randCp = contactPoints[randCpIndex];
    
    // lets search the closest contact point from randCp
    let minl = Infinity;
    let minI = -1;
    for(let i = 0; i < contactPoints.length; i++) {

        if(i === randCpIndex) continue;

        let cp2 = contactPoints[i];

        // 3d point in space of randCp
        let v1 = vec3(randCp.x, randCp.y, randCp.z);
        // 3d point in space of the contact point we're testing for proximity
        let v2 = vec3(cp2.x, cp2.y, cp2.z);

        let sv = vec3(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z);
        // "l" holds the euclidean distance between the two contact points
        let l = sv.length();

        // if "l" is smaller than the minimum distance we've registered so far, store this contact point's index as minI
        if(l < minl) { 
            minl = l;
            minI = i;
        }
    }
    
    let cp1 = contactPoints[randCpIndex];
    let cp2 = contactPoints[minI];
    
    lines.push(
        new Line({
            v1: vec3(cp1.x, cp1.y, cp1.z),
            v2: vec3(cp2.x, cp2.y, cp2.z),
            c1: vec3(2,2,2),
            c2: vec3(2,2,2),
        })
    );
}

function intersectsPlane(planePoint, planeNormal, linePoint, linePoint2) {

    let lineDirection = new THREE.Vector3(linePoint2.x - linePoint.x, linePoint2.y - linePoint.y, linePoint2.z - linePoint.z);
    let lineLength = lineDirection.length();
    lineDirection.normalize();

    if (planeNormal.dot(lineDirection) === 0) {
        return false;
    }

    let t = (planeNormal.dot(planePoint) - planeNormal.dot(linePoint)) / planeNormal.dot(lineDirection);
    if (t > lineLength) return false;
    if (t < 0) return false;

    let px = linePoint.x + lineDirection.x * t;
    let py = linePoint.y + lineDirection.y * t;
    let pz = linePoint.z + lineDirection.z * t;

    let planeSize = Infinity; 
    if(vec3(planePoint.x - px, planePoint.y - py, planePoint.z - pz).length() > planeSize) return false;

    return vec3(px, py, pz);
}
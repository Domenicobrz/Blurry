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
let lightDir0 = vec3(1, 1, 0.2).normalize();
let lightDir1 = vec3(-1, 1, 0.2).normalize();

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

    // recolor edges  
    for(line of lines) {
        let v1 = line.v1;

        // these will be used as the "red vectors" of the previous example
        let normal1 = v1.clone().normalize();

   	    // lets calculate how much light the two endpoints of the line
	    // will get from the "lightDir0" light source (the white light)
	    // we need Math.max( ... , 0.1) to make sure the dot product doesn't get lower than
	    // 0.1, this will ensure each point is at least partially lit by a light source and
	    // doesn't end up being completely black
        let diffuse0  = Math.max(lightDir0.dot(normal1) * 3, 0.15);
        let diffuse1  = Math.max(lightDir1.dot(normal1) * 2, 0.2 );

        let firstColor  = [diffuse0, diffuse0, diffuse0];
        let secondColor = [2 * diffuse1, 0.2 * diffuse1, 0];

        let r1 = firstColor[0] + secondColor[0];
        let g1 = firstColor[1] + secondColor[1];
        let b1 = firstColor[2] + secondColor[2];

        let r2 = firstColor[0] + secondColor[0];
        let g2 = firstColor[1] + secondColor[1];
        let b2 = firstColor[2] + secondColor[2];

        line.c1 = vec3(r1, g1, b1);
        line.c2 = vec3(r2, g2, b2);
    }
}

function computeSparkles() {
    for(let i = 0; i < 5500; i++) {
        let v0 = vec3(nrand(), nrand(), nrand()).normalize().multiplyScalar(18 + rand() * 65);

        let c = 1.325 * (0.3 + rand() * 0.7);
        let s = 0.125;

        if(rand() > 0.9) {
            c *= 4; 
        }

        let normal1 = v0.clone().normalize();

        let diffuse0  = Math.max(lightDir0.dot(normal1) * 3, 0.15);
        let diffuse1  = Math.max(lightDir1.dot(normal1) * 2, 0.2 );

        let r = diffuse0 + 2 * diffuse1;
        let g = diffuse0 + 0.2 * diffuse1;
        let b = diffuse0;

        lines.push(new Line({
            v1: vec3(v0.x - s, v0.y, v0.z),
            v2: vec3(v0.x + s, v0.y, v0.z),

            c1: vec3(r * c, g * c, b * c),
            c2: vec3(r * c, g * c, b * c),
        }));    
        
        lines.push(new Line({
            v1: vec3(v0.x, v0.y - s, v0.z),
            v2: vec3(v0.x, v0.y + s, v0.z),
    
            c1: vec3(r * c, g * c, b * c),
            c2: vec3(r * c, g * c, b * c),
        }));    
    }
}


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
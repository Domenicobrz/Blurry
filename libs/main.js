window.addEventListener("load", init);

var scene;
var postProcScene;
var camera;
var postProcCamera;
var controls;
var renderer;
var canvas;

var postProcQuadMaterial;

var capturerStarted = false;

let lines = [ ];
let linesGeometry;
let linesMaterial;

let quads = [ ];
let quadsGeometry;
let quadsMaterial;

let samples = 0;

var offscreenRT;



// The threejs version used in this repo was modified at line: 23060  to disable frustum culling



var controls = { };

function init() {    
    renderer = new THREE.WebGLRenderer( {  } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( innerWidth, innerHeight );
    renderer.autoClear = false;
    document.body.appendChild(renderer.domElement);
    canvas = renderer.domElement;


    scene            = new THREE.Scene();
    postProcScene    = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 20, innerWidth / innerHeight, 2, 200 );
    let dirVec = new THREE.Vector3(-5, -5, 10).normalize().multiplyScalar(49);
    camera.position.set( dirVec.x, dirVec.y, dirVec.z );


    postProcCamera = new THREE.PerspectiveCamera( 20, innerWidth / innerHeight, 2, 200 );
    postProcCamera.position.set(0, 0, 10);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed     = 1;
	controls.minAzimuthAngle = -Infinity; 
	controls.maxAzimuthAngle = +Infinity; 
	controls.minPolarAngle   = 0.85;      
    controls.maxPolarAngle   = Math.PI - 0.85; 

    controls.addEventListener("change", function() {
        resetCanvas();
    });



    offscreenRT = new THREE.WebGLRenderTarget(innerWidth, innerHeight, {
        stencilBuffer: false,
        depthBuffer: false,
        type: THREE.FloatType,
    });

    var postProcQuadGeo = new THREE.PlaneBufferGeometry(2,2);
    postProcQuadMaterial = new THREE.ShaderMaterial({
        vertexShader: postprocv,
        fragmentShader: postprocf,
        uniforms: {
            texture: { type: "t", value: offscreenRT.texture },
            uSamples: { value: samples },
            uExposure: { value: exposure },
            uBackgroundColor: new THREE.Uniform(new THREE.Vector3(21/255, 16/255, 16/255)),
        },
        side: THREE.DoubleSide,
    });
    postProcScene.add(new THREE.Mesh(postProcQuadGeo, postProcQuadMaterial));


    
    linesMaterial = new THREE.ShaderMaterial({
        vertexShader: linev,
        fragmentShader: linef,
        uniforms: {
            uTime: { value: 0 },
            uRandom: { value: 0 },
            uRandomVec4: new THREE.Uniform(new THREE.Vector4(0, 0, 0, 0)),
            uFocalDepth: { value: cameraFocalDistance },
            uBokehStrength: { value: bokehStrength },
            uMinimumLineSize: { value: minimumLineSize },
            uFocalPowerFunction: { value: focalPowerFunction },
            uBokehTexture: { type: "t", value: new THREE.TextureLoader().load(bokehTexturePath) },
        },

        side:           THREE.DoubleSide,
        depthTest:      false,

        blending:      THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc:      THREE.OneFactor, 
        blendSrcAlpha: THREE.OneFactor,
        blendDst:      THREE.OneFactor, 
        blendDstAlpha: THREE.OneFactor,  
    });

    quadsMaterial = new THREE.ShaderMaterial({
        vertexShader: quadv,
        fragmentShader: quadf,
        uniforms: {
            uTexture: { type: "t",   value: new THREE.TextureLoader().load("assets/textures/example6.jpg") },
            uTime: { value: 0 },
            uRandom: { value: 0 },
            uRandomVec4: new THREE.Uniform(new THREE.Vector4(0, 0, 0, 0)),
            uFocalDepth: { value: cameraFocalDistance },
            uBokehStrength: { value: bokehStrength },
            uMinimumLineSize: { value: minimumLineSize },
            uFocalPowerFunction: { value: focalPowerFunction },
            uBokehTexture: { type: "t", value: new THREE.TextureLoader().load(bokehTexturePath) },
        },

        side:           THREE.DoubleSide,
        depthTest:      false,

        blending:      THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc:      THREE.OneFactor, 
        blendSrcAlpha: THREE.OneFactor,
        blendDst:      THREE.OneFactor, 
        blendDstAlpha: THREE.OneFactor,  
    });


    createLinesWrapper(0);


    buildControls();
    render();
}  


let frames = 0;
let lastFrameDate = 0;
function render(now) {
    requestAnimationFrame(render);

    checkControls();



    if(!capturerStarted) {
        capturerStarted = true;
    }

    controls.update();

    for(let i = 0; i < drawCallsPerFrame; i++) {
        samples++;
        linesMaterial.uniforms.uBokehStrength.value = bokehStrength;
        linesMaterial.uniforms.uFocalDepth.value = cameraFocalDistance;
        linesMaterial.uniforms.uFocalPowerFunction.value = focalPowerFunction;
        linesMaterial.uniforms.uMinimumLineSize.value = minimumLineSize;
        linesMaterial.uniforms.uRandom.value = Math.random() * 1000;
        linesMaterial.uniforms.uTime.value = (now * 0.001) % 100;   // modulating time by 100 since it appears hash12 suffers with higher time values
        linesMaterial.uniforms.uRandomVec4.value = new THREE.Vector4(Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100);

        quadsMaterial.uniforms.uBokehStrength.value = bokehStrength;
        quadsMaterial.uniforms.uFocalDepth.value = cameraFocalDistance;
        quadsMaterial.uniforms.uFocalPowerFunction.value = focalPowerFunction;
        quadsMaterial.uniforms.uMinimumLineSize.value = minimumLineSize;
        quadsMaterial.uniforms.uRandom.value = Math.random() * 1000;
        quadsMaterial.uniforms.uTime.value = (now * 0.001) % 100;   // modulating time by 100 since it appears hash12 suffers with higher time values
        quadsMaterial.uniforms.uRandomVec4.value = new THREE.Vector4(Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100);

        renderer.render(scene, camera, offscreenRT);
    }

    postProcQuadMaterial.uniforms.uSamples.value = samples;
    postProcQuadMaterial.uniforms.uExposure.value = exposure;
    renderer.render(postProcScene, postProcCamera);


    // used to make GIF animations
    // if(lastFrameDate + 3000 < Date.now()) {
    //     frames++;
    //     createLinesWrapper(frames);
    //     resetCanvas();

    //     lastFrameDate = Date.now();

    //     var photo = canvas.toDataURL('image/jpeg');                
    //     $.ajax({
    //         method: 'POST',
    //         url: 'photo_upload.php',
    //         data: {
    //             photo: photo
    //         }
    //     });

    //     if(frames === 200) {
    //         lastFrameDate = Infinity;

    //     }
    // }
}


function resetCanvas() {
    scene.background = new THREE.Color(0x000000);
    renderer.render(scene, camera, offscreenRT);
    samples = 0;
    scene.background = null;
}

function createLinesWrapper(frames) {
    // ***************** lines creation 
    lines = [];
    scene.remove(scene.getObjectByName("points"));

    createLines(frames);

    createLinesGeometry();
    let mesh = new THREE.Points(linesGeometry, linesMaterial);
    mesh.name = "points";

    scene.add(mesh);
    // ***************** lines creation - END





    // ***************** quads creation 
    quads = [];
    scene.remove(scene.getObjectByName("quad-points"));

    createQuads(frames);

    createQuadsGeometry();
    let quadmesh = new THREE.Points(quadsGeometry, quadsMaterial);
    quadmesh.name = "quad-points";

    scene.add(quadmesh);
    // ***************** quads creation - END

}

function createLinesGeometry() {

    var geometry  = new THREE.BufferGeometry();
    var position1 = [];
    var position2 = [];
    var color1    = [];
    var color2    = [];
    var seed      = [];



    let accumulatedLinesLength = 0;
    for(let i = 0; i < lines.length; i++) {
        let line = lines[i];

        let lx1 = line.x1; 
        let ly1 = line.y1;
        let lz1 = line.z1;
    
        let lx2 = line.x2; 
        let ly2 = line.y2;
        let lz2 = line.z2;

        let weight = line.weight || 1;
    
        let dx = lx1 - lx2;
        let dy = ly1 - ly2;
        let dz = lz1 - lz2;
        let lineLength = Math.sqrt(dx*dx + dy*dy + dz*dz) * weight;

        accumulatedLinesLength += lineLength;
    }
    let pointsPerUnit = pointsPerFrame / accumulatedLinesLength;




    for(let j = 0; j < lines.length; j++) {

        let line = lines[j];

        let lx1 = line.x1; 
        let ly1 = line.y1;
        let lz1 = line.z1;
    
        let lx2 = line.x2; 
        let ly2 = line.y2;
        let lz2 = line.z2;

        let weight = line.weight || 1;

    
        // how many points per line?
        let points = pointsPerLine;
        let invPointsPerLine = 1 / points;

        if(useLengthSampling) {
            let dx = lx1 - lx2;
            let dy = ly1 - ly2;
            let dz = lz1 - lz2;
            let lineLength = Math.sqrt(dx*dx + dy*dy + dz*dz);

            points = Math.max(  Math.floor(pointsPerUnit * lineLength * weight), 1  );
            invPointsPerLine = 1 / points;
        }

        for(let ppr = 0; ppr < points; ppr++) {
            position1.push(lx1, ly1, lz1);
            position2.push(lx2, ly2, lz2);
            color1.push(line.c1r * invPointsPerLine, line.c1g * invPointsPerLine, line.c1b * invPointsPerLine);
            color2.push(line.c2r * invPointsPerLine, line.c2g * invPointsPerLine, line.c2b * invPointsPerLine)    
            
            seed.push(Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100);    
        }
    }

 
    geometry.addAttribute( 'position',  new THREE.BufferAttribute( new Float32Array(position1), 3 ) );
    geometry.addAttribute( 'position1', new THREE.BufferAttribute( new Float32Array(position2), 3 ) );
    geometry.addAttribute( 'color1',    new THREE.BufferAttribute( new Float32Array(color1), 3 ) );
    geometry.addAttribute( 'color2',    new THREE.BufferAttribute( new Float32Array(color2), 3 ) );
    geometry.addAttribute( 'aSeed',     new THREE.BufferAttribute( new Float32Array(seed), 4 ) );
    
    linesGeometry = geometry;
} 

function createQuadsGeometry() {

    var geometry  = new THREE.BufferGeometry();
    var position1 = [];
    var position2 = [];
    var position3 = [];
    var uv1 = [];
    var uv2 = [];
    var color     = [];
    var seeds     = [];

    let accumulatedQuadsArea = 0;
    for(let i = 0; i < quads.length; i++) {
        let quad = quads[i];

        let lx1 = quad.v1.x; 
        let ly1 = quad.v1.y;
        let lz1 = quad.v1.z;
    
        let lx2 = quad.v2.x; 
        let ly2 = quad.v2.y;
        let lz2 = quad.v2.z;

        let weight = quad.weight || 1;
    
        let dx = lx1 - lx2;
        let dy = ly1 - ly2;
        let dz = lz1 - lz2;
        let sideLength = Math.sqrt(dx*dx + dy*dy + dz*dz);
        let areaLength = (sideLength * sideLength) * weight;

        accumulatedQuadsArea += areaLength;
    }
    let pointsPerUnitArea = quadPointsPerFrame / accumulatedQuadsArea;

    for(let j = 0; j < quads.length; j++) {

        let quad = quads[j];

        let lx1 = quad.v1.x; 
        let ly1 = quad.v1.y;
        let lz1 = quad.v1.z;
    
        let lx2 = quad.v2.x; 
        let ly2 = quad.v2.y;
        let lz2 = quad.v2.z;

        let lx3 = quad.v3.x; 
        let ly3 = quad.v3.y;
        let lz3 = quad.v3.z;

        let weight = quad.weight || 1;

        if(weight !== 1) {
            let debug = 0;
        }

        let u1 = quad.uv1.x;
        let v1 = quad.uv1.y;

        let u2 = quad.uv2.x;
        let v2 = quad.uv2.y;

    
        let points = pointsPerQuad;
        let invPointsPerQuad = 1 / points;

        if(useLengthSampling) {
            let dx = lx1 - lx2;
            let dy = ly1 - ly2;
            let dz = lz1 - lz2;
            let sideLength = Math.sqrt(dx*dx + dy*dy + dz*dz);
            let areaLength = (sideLength * sideLength);

            points = Math.max(  Math.floor(pointsPerUnitArea * areaLength * weight), 1  );
            invPointsPerQuad = 1 / points;
        }


        for(let ppr = 0; ppr < points; ppr++) {
            position1.push(lx1, ly1, lz1);
            position2.push(lx2, ly2, lz2);
            position3.push(lx3, ly3, lz3);
            uv1.push(u1, v1);
            uv2.push(u2, v2);
            color.push(quad.col.x * invPointsPerQuad, quad.col.y * invPointsPerQuad, quad.col.z * invPointsPerQuad);

            seeds.push(Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100);    
        }
    }
 
    geometry.addAttribute( 'position',  new THREE.BufferAttribute( new Float32Array(position1), 3 ) );
    geometry.addAttribute( 'position1', new THREE.BufferAttribute( new Float32Array(position2), 3 ) );
    geometry.addAttribute( 'position2', new THREE.BufferAttribute( new Float32Array(position3), 3 ) );
    geometry.addAttribute( 'uv1',       new THREE.BufferAttribute( new Float32Array(uv1),       2 ) );
    geometry.addAttribute( 'uv2',       new THREE.BufferAttribute( new Float32Array(uv2),       2 ) );
    geometry.addAttribute( 'color',     new THREE.BufferAttribute( new Float32Array(color),     3 ) );
    geometry.addAttribute( 'aSeeds',    new THREE.BufferAttribute( new Float32Array(seeds),     4 ) );
    
    quadsGeometry = geometry;
} 



function buildControls() {
    window.addEventListener("keydown", function(e) {
        controls[e.key] = true;
    });

    window.addEventListener("keyup", function(e) {
        controls[e.key] = false;
    });


    window.addEventListener("keypress", function(e) {
        if(e.key == "h" || e.key == "H") {
            document.querySelector(".controls").classList.toggle("active");
        }
        if(e.key == "m" || e.key == "M") {
            if(focalPowerFunction === 0) focalPowerFunction = 1;
            else                         focalPowerFunction = 0;

            resetCanvas();
        }
    });
}

function checkControls() {
    if(controls["o"]) {
        cameraFocalDistance -= 0.2;
        console.log("cfd: " + cameraFocalDistance);
        resetCanvas();
    }
    if(controls["p"]) {
        cameraFocalDistance += 0.2;        
        console.log("cfd: " + cameraFocalDistance);
        resetCanvas();
    }
    
    if(controls["k"]) {
        bokehStrength += 0.0025;
        console.log("bs: " + bokehStrength);
        resetCanvas();    
    }
    if(controls["l"]) {
        bokehStrength -= 0.0025;        
        bokehStrength = Math.max(bokehStrength, 0);        
        console.log("bs: " + bokehStrength);
        resetCanvas();
    }

    if(controls["n"]) {
        bokehFalloff += 3.5;
        console.log("bf: " + bokehFalloff);
    }
    if(controls["m"]) {
        bokehFalloff -= 3.5;        
        console.log("bf: " + bokehFalloff);
    }

    if(controls["v"]) {
        exposure += 0.0001;
        console.log("exp: " + exposure);
    }
    if(controls["b"]) {
        exposure -= 0.0001;
        exposure = Math.max(exposure, 0.0001);
        console.log("exp: " + exposure);
    }
}
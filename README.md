# Blurry
Simulating depth of field with particles on a shader


<img src="https://github.com/Domenicobrz/DOF-lines-renderer/blob/master/screenshot.jpg?raw=true" width="100%">
<img src="https://github.com/Domenicobrz/DOF-lines-renderer/blob/master/screenshot2.jpg?raw=true" width="100%">
 
------
[Live demo here](https://domenicobrz.github.io/webgl/projects/DOFlinesrenderer/)
 
How to use
======

Inside `libs/createScene.js` you can code the scene you want to render, only lines and quads are supported atm, here's an example on how to populate the `lines` array:

```javascript
function createScene(frame) {   // frame is used to make animations, I'll update soon the readme to explain how that's done
    // lines is a global array
    lines.push({
        // first vertex of the line
        x1: x1,
        y1: y1,
        z1: z1,
    
        // second vertex of the line
        x2: x2,
        y2: y2,
        z2: z2,
    
        // color of the first vertex, can take values bigger than 1.0
        c1r: 1, 
        c1g: 0,
        c1b: 0,

        // color of the second vertex, can take values bigger than 1.0
        c2r: 0, 
        c2g: 0,
        c2b: 1,

        // optional, if $useLengthSampling is set to true this variable will change the weight this lines has in the distribution of points for each line
        weight: 1,
    });


    let quad = new Quad(0,0,0, /* <- starting position */ 0,0,1,1 /* texture uvs */)
                   .scale(0.5)
                   .color(100, 50, 10)
                   .translate(0, 1, 0)
                   .rotate(0, 0, 1, /* <- rotation axis */, 0.5 /* <- rotation angle */)
    // quads is a global array
    quads.push(quad);
}
```

Quads can make use of a single texture, specified in `libs/globals.js` 

------

You can change various parameters of the renderer by adding a `setGlobals()` function inside `libs/createScene.js`

```javascript
function setGlobals() {
    // camera parameters
    cameraPosition = new THREE.Vector3(0, 0, 100);
    cameraTarget   = new THREE.Vector3(0, 0, 0);

    cameraFocalDistance = 49.19;
    bokehStrength = 0.095;
    exposure = 0.0019;
    // set to 1 to have non-linear increase in focal strength
    focalPowerFunction = 0;

    // how much light fades as you get out of the focal plane
    distanceAttenuation = 0;

    // how big lines should be on screen when they're in the focal plane
    minimumLineSize = 0.015;

    // how many render calls are made each frame
    drawCallsPerFrame = 5;

    // texture used by quads when specifying uvs
    quadsTexturePath = "assets/textures/ExportedFont1.bmp";


    // wether each line has assigned a quantity of points proportional to its length or a fixed number instead
    useLengthSampling = false;

    // if $useLengthSampling is false, every line will by rendered by default with $pointsPerLine points, same for $pointsPerQuad
    pointsPerLine     = 25;
    pointsPerQuad     = 500;

    // if $useLengthSampling is true, every line will be drawn with an amount of points that 
    // is proportional to the line's length, (or quad's area length for $quadPointsPerFrame)
    // use $pointsPerFrame/$quadPointsPerFrame to determine how many points will be drawn in 
    // a single drawcall. Keep in mind that each line/quad is drawn with
    // at least one point
    pointsPerFrame = 100000;
    quadPointsPerFrame = 50000;

    // wether to use a bokeh texture or not, keep an eye on render times
    // since they will be a bit slower when using bokeh textures
    useBokehTexture  = false;
    bokehTexturePath = "assets/bokeh/c1.png";
    // static background color (is additive with the rest of the scene)
    backgroundColor  = [21/255, 16/255, 16/255];
}


```
`setGlobals()` will be called once at startup


The threejs source attached in the repo was modified to always disable frustum culling (check `libs/main.js` to see the exact changes)

Credits
------
The DOF displacement algorithm was taken from [This blog post](https://inconvergent.net/2019/depth-of-field/)
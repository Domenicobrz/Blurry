# Blurry
Simulating depth of field with particles on a shader


<img src="https://github.com/Domenicobrz/DOF-lines-renderer/blob/master/screenshot.jpg?raw=true" width="100%">
 
------
[Live demo here](https://domenicobrz.github.io/webgl/projects/DOFlinesrenderer/)
 
How to use
======

Inside `libs/createLines.js` you can code the scene you want to render, only lines and quads are supported atm, here's an example on how to populate the `lines` array:

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


    // quads is a global array
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

You can change various parameters of the renderer by modifying the values in `libs/globals.js`

```javascript
// camera parameters
var cameraFocalDistance = 49.19;
var bokehStrength = 0.095;
var exposure = 0.0019;
// set to 1 to have non-linear increase in focal strength
var focalPowerFunction = 0;

// how big lines should be on screen when they're in the focal plane
var minimumLineSize = 0.015;

// how many render calls are made each frame
var drawCallsPerFrame = 5;

// texture used by quads when specifying uvs
var quadsTexturePath = "assets/textures/ExportedFont1.bmp";


// wether each line has assigned a quantity of points proportional to its length or a fixed number instead
var useLengthSampling = false;

// if $useLengthSampling is false, every line will by rendered by default with $pointsPerLine points, same for $pointsPerQuad
var pointsPerLine     = 25;
var pointsPerQuad     = 500;

// if $useLengthSampling is true, every line will be drawn with an amount of points that 
// is proportional to the line's length, (or quad's area length for $quadPointsPerFrame)
// use $pointsPerFrame/$quadPointsPerFrame to determine how many points will be drawn in 
// a single drawcall. Keep in mind that each line/quad is drawn with
// at least one point
var pointsPerFrame = 1000000;
var quadPointsPerFrame = 500000;

// wether to use a bokeh texture or not, keep an eye on render times
// since they will be a bit slower when using bokeh textures
var useBokehTexture  = false;
var bokehTexturePath = "assets/bokeh/c1.png";

```
Alternatively, you can create a `setGlobals` function inside `libs/createScene.js` to modify any variable of `libs/globals.js`
In case `setGlobals` is specified, it will be called before any other function


The threejs source attached in the repo was modified to always disable frustum culling (check `libs/main.js` to see the exact changes)

Credits
------
The DOF displacement algorithm was taken from [This blog post](https://inconvergent.net/2019/depth-of-field/)
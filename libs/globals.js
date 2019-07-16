// camera parameters
var cameraPosition = new THREE.Vector3(0, 0, 100);
var cameraTarget   = new THREE.Vector3(0, 0, 0);

var cameraFocalDistance = 49.19;
var bokehStrength = 0.025;
var exposure = 0.0019;
// set to 1 to have non-linear increase in focal strength
var focalPowerFunction = 0;

// how big lines should be on screen when they're in the focal plane
var minimumLineSize = 0.015;

// how many render calls are made each frame
var drawCallsPerFrame = 100;

var quadsTexturePath = "assets/textures/texture1.png";


// wether each line has assigned a quantity of points proportional to its length or a fixed number instead
var useLengthSampling = true;

// if $useLengthSampling is false, every line will by rendered by default with $pointsPerLine points
var pointsPerLine     = 500;
var pointsPerQuad     = 500;

// if $useLengthSampling is true, every line will be drawn with an amount of points that is proportional to the line's length,
// use $pointsPerFrame to determine how many points will be drawn in a single drawcall. Keep in mind that each line is drawn with
// at least one point
var pointsPerFrame     = 50000;
var quadPointsPerFrame = 50000;

// animation params
var millisecondsPerFrame = Infinity;
var framesCount          = 200;

// additional bokeh params
var useBokehTexture  = false;
var bokehTexturePath = "assets/bokeh/c1.png";
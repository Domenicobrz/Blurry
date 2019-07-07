// camera parameters
var cameraFocalDistance = 49.19;
var bokehStrength = 0.095;
var exposure = 0.0019;
// set to 1 to have non-linear increase in focal strength
var focalPowerFunction = 0;

// how big lines should be on screen when they're in the focal plane
var minimumLineSize = 0.015;

// how many render calls are made each frame
var drawCallsPerFrame = 10;


// wether each line has assigned a quantity of points proportional to its length or a fixed number instead
var useLengthSampling = false;

// if $useLengthSampling is false, every line will by rendered by default with $pointsPerLine points
var pointsPerLine     = 500;

// if $useLengthSampling is true, every line will be drawn with an amount of points that is proportional to the line's length,
// use $pointsPerFrame to determine how many points will be drawn in a single drawcall. Keep in mind that each line is drawn with
// at least one point
var pointsPerFrame = 500000;



var useBokehTexture = false;
var bokehTexturePath = "assets/bokeh/pentagon.png";
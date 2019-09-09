let shaderpassv = `
varying vec2 vUv;

void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
    
    vUv = uv;
}`;

let shaderpassf = "";
const coordinateSize = 1000;
const canvas = document.querySelector("#webgl");
const gl = canvas.getContext("webgl2");
if (gl == null) {
    document.querySelector("h2").innerHTML = "WebGL is not supported by your browers. Cannot Render Animation.";
}
const vertexShaderSource = `#version 300 es
in vec4 position;
uniform mat4 transformation;
out vec4 vColor;
void main() {
    gl_Position = transformation*position;
    vColor = gl_Position*0.5 + 0.5;
}`;
const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 color;
in vec4 vColor;
void main() {
    color = vColor;
}`;
function createShader(type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    }
    else {
        document.querySelector("h2").innerHTML = "WebGL shader failed compilation.";
    }
}
const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    document.querySelector("h2").innerHTML += "WebGL linking failed.";
}
const positionLocation = gl.getAttribLocation(program, "position");
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [-500, -500, 500, -500, 0, 707.11];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
const positionVAO = gl.createVertexArray();
gl.bindVertexArray(positionVAO);
gl.enableVertexAttribArray(positionLocation);
const size = 2;
const type = gl.FLOAT;
const normalize = false;
const stride = 0;
const offset = 0;
gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
const transformationLocation = gl.getUniformLocation(program, "transformation");
 
function render() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
   gl.useProgram(program);
    xtrans += -1;
    ytrans += 1;
    theta += 10*2*Math.PI/360;
    theta %= 2*Math.PI;
    scale += -0.001;
    let ratio = canvas.width/canvas.height;
    gl.uniformMatrix4fv(transformationLocation, false, [scale*Math.cos(theta)/ratio/coordinateSize, scale*Math.sin(theta)/coordinateSize, 0, 0, -scale*Math.sin(theta)/ratio/coordinateSize, scale*Math.cos(theta)/coordinateSize, 0, 0, 0, 0, 1, 0, xtrans/ratio/coordinateSize, ytrans/coordinateSize, 0, 1]);
    gl.bindVertexArray(positionVAO);
    let primitiveType = gl.TRIANGLES;
    let offset = 0;
    let count = 3;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(primitiveType, offset, count);
}

let xtrans = 0;
let ytrans = 0;
let theta = 0;
let scale = 1;
setInterval(() => render(), 50);

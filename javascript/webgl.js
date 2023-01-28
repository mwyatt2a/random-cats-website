const canvas = document.querySelector("#webgl");
const gl = canvas.getContext("webgl2");
if (gl == null) {
    document.querySelector("h2").innerHTML = "WebGL is not supported by your browers. Cannot Render Animation.";
}
const vertexShaderSource = `#version 300 es
in vec4 position;
void main() {
    gl_Position = position;
}`;
const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 color;
void main() {
    color = vec4(1.0, 0.0, 1.0, 1.0);
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
const positions = [0, 0, 0, 0.5, 0.7, 0];
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
 
function render() {
    gl.useProgram(program);
    gl.bindVertexArray(positionVAO);
    let primitiveType = gl.TRIANGLES;
    let offset = 0;
    let count = 3;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(primitiveType, offset, count);
}

render();

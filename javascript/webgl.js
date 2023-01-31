const coordinateSize = 1000;
const canvas = document.querySelector("#webgl");
const gl = canvas.getContext("webgl2");
if (gl == null) {
    document.querySelector("h2").innerHTML = "WebGL is not supported by your browers. Cannot Render Animation.";
}
const vertexShaderSource = `#version 300 es
in vec4 position;
in vec2 vertexTexCoord;
uniform mat4 transformation;
out vec2 fragTexCoord;
void main() {
    gl_Position = transformation*position;
    fragTexCoord = vertexTexCoord;
}`;
const fragmentShaderSource = `#version 300 es
precision highp float;
uniform sampler2D texImage;
out vec4 color;
in vec2 fragTexCoord;
void main() {
    color = texture(texImage, fragTexCoord);
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
const positions = [-500, -500, 500, -500, 500, 500, 500, 500, -500, 500, -500, -500];
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
const texCoordLocation = gl.getAttribLocation(program, "vertexTexCoord");
const texCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
const texCoords = [0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
gl.enableVertexAttribArray(texCoordLocation);
gl.vertexAttribPointer(texCoordLocation, size, type, normalize, stride, offset);
const texImageLocation = gl.getUniformLocation(program, "texImage");
const unit = 0;
gl.activeTexture(gl.TEXTURE0 + unit);
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

const mipLevel = 0;
const internalFormat = gl.RGBA;
const sourceFormat = gl.RGBA;
const srcType = gl.UNSIGNED_BYTE;
const image = new Image();
image.src = "/testbmp";
image.onload = () => gl.texImage2D(gl.TEXTURE_2D, mipLevel, internalFormat, sourceFormat, srcType, image);
 
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
    gl.uniform1i(texImageLocation, unit);
    gl.bindVertexArray(positionVAO);
    let primitiveType = gl.TRIANGLES;
    let offset = 0;
    let count = 6;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(primitiveType, offset, count);
}

let xtrans = 0;
let ytrans = 0;
let theta = 0;
let scale = 1;
setInterval(() => render(), 50);

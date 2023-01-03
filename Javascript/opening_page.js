function change() {
    fetch("/getNotes").then(data => data.text()).then(result => document.getElementById("test").innerHTML = result);
}

var canvas = document.getElementById("webgl2");
var webgl2 = canvas.getContext("webgl2");
if (!webgl2) alert("Webgl2 is not enabled");
var vertexShaderSource = `#version 300 es
    in vec4 position;
    in vec4 color;
    out vec4 v_Color;
    void main() {
        v_Color = color;
        gl_Position = position;
    }
`;
var fragmentShaderSource = `#version 300 es
    precision highp float;
    in vec4 v_Color;
    out vec4 f_Color;
    void main() {
        f_Color = v_Color;
    }
`;

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

var vertexShader = createShader(webgl2, webgl2.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(webgl2, webgl2.FRAGMENT_SHADER, fragmentShaderSource);

function createProgram(gl, vertShader, fragShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    return program;
}

var program = createProgram(webgl2, vertexShader, fragmentShader);
var positionAttributeLocation = webgl2.getAttribLocation(program, "position");
var colorAttributeLocation = webgl2.getAttribLocation(program, "color");
var positionBuffer = webgl2.createBuffer();
var colorBuffer = webgl2.createBuffer();
webgl2.bindBuffer(webgl2.ARRAY_BUFFER, positionBuffer);

var positions = [0,0, 0,0.5, 0.7,0,  -0.13,0.78, -0.5,-0.6, -0.1,-0.8];
webgl2.bufferData(webgl2.ARRAY_BUFFER, new Float32Array(positions), webgl2.STATIC_DRAW);
var vao = webgl2.createVertexArray();
webgl2.bindVertexArray(vao);
webgl2.enableVertexAttribArray(positionAttributeLocation);
webgl2.vertexAttribPointer(positionAttributeLocation, 2, webgl2.FLOAT, false, 0, 0);

webgl2.bindBuffer(webgl2.ARRAY_BUFFER, colorBuffer);
var colors = [1,0, 1,0.5, 0.7,1,  0.13,0.78, 1,0.1, 0.1,0.8];
webgl2.bufferData(webgl2.ARRAY_BUFFER, new Float32Array(colors), webgl2.STATIC_DRAW);
//var vao2 = webgl2.createVertexArray();
//webgl2.bindVertexArray(vao2);
webgl2.enableVertexAttribArray(colorAttributeLocation);
webgl2.vertexAttribPointer(colorAttributeLocation, 2, webgl2.FLOAT, false, 0, 0);



webgl2.viewport(0, 0, 700, 500);
webgl2.clearColor(0.1,0.1,0.1,0.5);
webgl2.clear(webgl2.COLOR_BUFFER_BIT);
webgl2.useProgram(program);
//webgl2.bindVertexArray(vao);
webgl2.drawArrays(webgl2.TRIANGLES, 0, 6);

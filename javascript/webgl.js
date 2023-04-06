import init, { test, Location, Translation, Rotation, GraphicsMatrix } from "/rust/pkg/rust.js";
init().then(() => {
    console.log(test(5));
    console.log(Translation.js_create(0, 0.5, 6));
    console.log(GraphicsMatrix.create_camera_matrix(false, Rotation.js_create(0, 0.5, 6), Translation.js_create(0, 0.5, 6), Location.js_create(0, 0.5, 6)));
});





//Functions and basic setup
function createModel(scale, ztheta, ytheta, xtheta, xtrans, ytrans, ztrans) {
    let scaling = [scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, 1];
    let zRotation = [Math.cos(ztheta), Math.sin(ztheta), 0, 0, -Math.sin(ztheta), Math.cos(ztheta), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    let yRotation = [Math.cos(ytheta), 0, -Math.sin(ytheta), 0, 0, 1, 0, 0, Math.sin(ytheta), 0, Math.cos(ytheta), 0, 0, 0, 0, 1];
    let xRotation = [1, 0, 0, 0, 0, Math.cos(xtheta), Math.sin(xtheta), 0, 0, -Math.sin(xtheta), Math.cos(xtheta), 0, 0, 0, 0, 1];
    let translation = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, xtrans, ytrans, ztrans, 1];
    return matrixMultiply(translation, matrixMultiply(xRotation, matrixMultiply(yRotation, matrixMultiply(zRotation, scaling))));
}
function createCamera(focus, camztheta, camytheta, camxtheta, camx, camy, camz, focusx, focusy, focusz) {
    if (!focus) {
        let camzRotation = [Math.cos(camztheta), Math.sin(camztheta), 0, 0, -Math.sin(camztheta), Math.cos(camztheta), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        let camyRotation = [Math.cos(camytheta), 0, -Math.sin(camytheta), 0, 0, 1, 0, 0, Math.sin(camytheta), 0, Math.cos(camytheta), 0, 0, 0, 0, 1];
        let camxRotation = [1, 0, 0, 0, 0, Math.cos(camxtheta), Math.sin(camxtheta), 0, 0, -Math.sin(camxtheta), Math.cos(camxtheta), 0, 0, 0, 0, 1];
        let camtranslation = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, camx, camy, camz, 1];
        return matrixMultiply(camtranslation, matrixMultiply(camxRotation, matrixMultiply(camyRotation, matrixMultiply(camzRotation, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]))));
    }
    else {
        let newZ = vectorNormalize([camx - focusx, camy - focusy, camz - focusz]);
        let newX = vectorNormalize(vectorCross([0, 1, 0], newZ));
        let newY = vectorNormalize(vectorCross(newZ, newX));
        return [newX[0], newZ[1], newZ[2], 0, newY[0], newY[1], newY[2], 0, newZ[0], newZ[1], newZ[2], 0, camx, camy, camz, 1];
    }
}
function matrixMultiply(A, B) {
    let C = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    C[0] = A[0]*B[0] + A[4]*B[1] + A[8]*B[2] + A[12]*B[3];
    C[1] = A[1]*B[0] + A[5]*B[1] + A[9]*B[2] + A[13]*B[3];
    C[2] = A[2]*B[0] + A[6]*B[1] + A[10]*B[2] + A[14]*B[3];
    C[3] = A[3]*B[0] + A[7]*B[1] + A[11]*B[2] + A[15]*B[3];
    C[4] = A[0]*B[4] + A[4]*B[5] + A[8]*B[6] + A[12]*B[7];
    C[5] = A[1]*B[4] + A[5]*B[5] + A[9]*B[6] + A[13]*B[7];
    C[6] = A[2]*B[4] + A[6]*B[5] + A[10]*B[6] + A[14]*B[7];
    C[7] = A[3]*B[4] + A[7]*B[5] + A[11]*B[6] + A[15]*B[7];
    C[8] = A[0]*B[8] + A[4]*B[9] + A[8]*B[10] + A[12]*B[11];
    C[9] = A[1]*B[8] + A[5]*B[9] + A[9]*B[10] + A[13]*B[11];
    C[10] = A[2]*B[8] + A[6]*B[9] + A[10]*B[10] + A[14]*B[11];
    C[11] = A[3]*B[8] + A[7]*B[9] + A[11]*B[10] + A[15]*B[11];
    C[12] = A[0]*B[12] + A[4]*B[13] + A[8]*B[14] + A[12]*B[15];
    C[13] = A[1]*B[12] + A[5]*B[13] + A[9]*B[14] + A[13]*B[15];
    C[14] = A[2]*B[12] + A[6]*B[13] + A[10]*B[14] + A[14]*B[15];
    C[15] = A[3]*B[12] + A[7]*B[13] + A[11]*B[14] + A[15]*B[15];
    return C;
}
function matrixTranspose(A) {
    return [A[0], A[4], A[8], A[12], A[1], A[5], A[9], A[13], A[2], A[6], A[10], A[14], A[3], A[7], A[11], A[15]];
}
function createModelInverseTranspose(scale, ztheta, ytheta, xtheta, xtrans, ytrans, ztrans) {
    let scaling = [scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, 1];
    let zRotation = [Math.cos(ztheta), Math.sin(ztheta), 0, 0, -Math.sin(ztheta), Math.cos(ztheta), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    let yRotation = [Math.cos(ytheta), 0, -Math.sin(ytheta), 0, 0, 1, 0, 0, Math.sin(ytheta), 0, Math.cos(ytheta), 0, 0, 0, 0, 1];
    let xRotation = [1, 0, 0, 0, 0, Math.cos(xtheta), Math.sin(xtheta), 0, 0, -Math.sin(xtheta), Math.cos(xtheta), 0, 0, 0, 0, 1];
    let translation = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, xtrans, ytrans, ztrans, 1];
    return matrixTranspose(matrixInverse(matrixMultiply(translation, matrixMultiply(xRotation, matrixMultiply(yRotation, matrixMultiply(zRotation, scaling))))));
}
function matrixInverse(A) {
    let f = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    f[0] = A[10]*A[15] - A[11]*A[14];
    f[1] = A[9]*A[15] - A[11]*A[13];
    f[2] = A[9]*A[14] - A[10]*A[13];
    f[3] = A[6]*A[15] - A[7]*A[14];
    f[4] = A[5]*A[15] - A[7]*A[13];
    f[5] = A[5]*A[14] - A[6]*A[13];
    f[6] = A[6]*A[11] - A[7]*A[10];
    f[7] = A[5]*A[11] - A[7]*A[9];
    f[8] = A[5]*A[10] - A[6]*A[9];
    f[9] = A[8]*A[15] - A[11]*A[12];
    f[10] = A[8]*A[14] - A[10]*A[12];
    f[11] = A[4]*A[15] - A[7]*A[12];
    f[12] = A[4]*A[14] - A[6]*A[12];
    f[13] = A[4]*A[11] - A[11]*A[8];
    f[14] = A[4]*A[10] - A[6]*A[8];
    f[15] = A[8]*A[13] - A[9]*A[12];
    f[16] = A[4]*A[13] - A[5]*A[12];
    f[17] = A[4]*A[9] - A[5]*A[8];
    let C = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    C[0] = A[5]*f[0] - A[6]*f[1] + A[7]*f[2];
    C[1] = -A[1]*f[0] + A[2]*f[1] - A[3]*f[2];
    C[2] = A[1]*f[3] - A[2]*f[4] + A[3]*f[5];
    C[3] = -A[1]*f[6] + A[2]*f[7] - A[3]*f[8];
    C[4] = -A[4]*f[0] + A[6]*f[9] - A[7]*f[10];
    C[5] = A[0]*f[0] - A[2]*f[9] + A[3]*f[10];
    C[6] = -A[0]*f[3] + A[2]*f[11] - A[3]*f[12];
    C[7] = A[0]*f[6] - A[2]*f[13] + A[3]*f[14];
    C[8] = A[4]*f[1] - A[5]*f[9] + A[7]*f[15];
    C[9] = -A[0]*f[1] + A[1]*f[9] - A[3]*f[15];
    C[10] = A[0]*f[4] - A[1]*f[11] + A[3]*f[16];
    C[11] = -A[0]*f[7] + A[1]*f[13] - A[3]*f[17];
    C[12] = -A[4]*f[2] + A[5]*f[10] - A[6]*f[15];
    C[13] = A[0]*f[2] - A[1]*f[10] + A[2]*f[15];
    C[14] = -A[0]*f[5] + A[1]*f[12] - A[2]*f[16];
    C[15] = A[0]*f[8] - A[1]*f[14] + A[2]*f[17];
    let determinant = A[0]*C[0] + A[1]*C[4] + A[2]*C[8] + A[3]*C[12];
    for (let i = 0; i < 16; i++) {
        C[i] = C[i]/determinant;
    }
    return C;
}
function vectorNormalize(v) {
    let magnitude = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]); 
    return [v[0]/magnitude, v[1]/magnitude, v[2]/magnitude];
}
function vectorCross(v1, v2) {
    return [v1[1]*v2[2] - v1[2]*v2[1], v1[2]*v2[0] - v1[0]*v2[2], v1[0]*v2[1] - v1[1]*v2[0]];
}
function createTransformationMatrix(scale, ztheta, ytheta, xtheta, xtrans, ytrans, ztrans, aspect, fieldOfView, near, far, focus, camztheta, camytheta, camxtheta, camx, camy, camz, focusx, focusy, focusz) {
    let scaling = [scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, 1];
    let zRotation = [Math.cos(ztheta), Math.sin(ztheta), 0, 0, -Math.sin(ztheta), Math.cos(ztheta), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    let yRotation = [Math.cos(ytheta), 0, -Math.sin(ytheta), 0, 0, 1, 0, 0, Math.sin(ytheta), 0, Math.cos(ytheta), 0, 0, 0, 0, 1];
    let xRotation = [1, 0, 0, 0, 0, Math.cos(xtheta), Math.sin(xtheta), 0, 0, -Math.sin(xtheta), Math.cos(xtheta), 0, 0, 0, 0, 1];
    let translation = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, xtrans, ytrans, ztrans, 1];
    let cameraMatrix = [];
    if (!focus) {
        let camzRotation = [Math.cos(camztheta), Math.sin(camztheta), 0, 0, -Math.sin(camztheta), Math.cos(camztheta), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        let camyRotation = [Math.cos(camytheta), 0, -Math.sin(camytheta), 0, 0, 1, 0, 0, Math.sin(camytheta), 0, Math.cos(camytheta), 0, 0, 0, 0, 1];
        let camxRotation = [1, 0, 0, 0, 0, Math.cos(camxtheta), Math.sin(camxtheta), 0, 0, -Math.sin(camxtheta), Math.cos(camxtheta), 0, 0, 0, 0, 1];
        let camtranslation = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, camx, camy, camz, 1];
        cameraMatrix = matrixMultiply(camtranslation, matrixMultiply(camxRotation, matrixMultiply(camyRotation, matrixMultiply(camzRotation, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]))));
    }
    else {
        let newZ = vectorNormalize([camx - focusx, camy - focusy, camz - focusz]);
        let newX = vectorNormalize(vectorCross([0, 1, 0], newZ));
        let newY = vectorNormalize(vectorCross(newZ, newX));
        cameraMatrix = [newX[0], newZ[1], newZ[2], 0, newY[0], newY[1], newY[2], 0, newZ[0], newZ[1], newZ[2], 0, camx, camy, camz, 1];
    }
    let viewMatrix = matrixInverse(cameraMatrix);
    let f = Math.tan(Math.PI*0.5 -0.5*fieldOfView);
    let rangeInv = 1.0/(near - far);
    let projection = [f/aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (near + far)*rangeInv, -1, 0, 0, near*far*rangeInv*2, 0];
    return matrixMultiply(projection, matrixMultiply(viewMatrix, matrixMultiply(translation, matrixMultiply(xRotation, matrixMultiply(yRotation, matrixMultiply(zRotation, scaling))))));
}
const canvas = document.querySelector("#webgl");
const gl = canvas.getContext("webgl2");
if (gl == null) {
    document.querySelector("h2").innerHTML = "WebGL is not supported by your browers. Cannot Render Animation.";
}





//Shaders and their setup
const vertexShaderSource = `#version 300 es
in vec4 position;
in vec2 vertexTexCoord;
in vec3 a_normal;
uniform mat4 transformation;
uniform mat4 modelInverseTranspose;
uniform vec3 lightbulbPosition;
uniform mat4 model;
uniform vec3 cameraPosition;
out vec2 fragTexCoord;
out vec3 v_normal;
out vec3 surfaceToLight;
out vec3 surfaceToCamera;
void main() {
    gl_Position = transformation*position;
    fragTexCoord = vertexTexCoord;
    v_normal = mat3(modelInverseTranspose)*a_normal;
    surfaceToLight = lightbulbPosition - (model*position).xyz;
    surfaceToCamera = cameraPosition - (model*position).xyz;
}`;
const fragmentShaderSource = `#version 300 es
precision highp float;
uniform sampler2D texImage;
uniform float kernel[9];
uniform float ambient;
uniform float diffuse;
uniform float shininess;
uniform vec3 reversedSun;
uniform vec3 lightbulbColor;
uniform vec3 lightbulbDirection;
uniform float dotLimitUpper;
uniform float dotLimitLower;
in vec2 fragTexCoord;
in vec3 v_normal;
in vec3 surfaceToLight;
in vec3 surfaceToCamera;
out vec4 outColor;
void main() {
    vec2 pixelSize = vec2(1)/vec2(textureSize(texImage, 0));
    vec4 colorSum = texture(texImage, fragTexCoord + pixelSize*vec2(-1, -1))*kernel[0] +
        texture(texImage, fragTexCoord + pixelSize*vec2(0, -1))*kernel[1] + 
        texture(texImage, fragTexCoord + pixelSize*vec2(1, -1))*kernel[2] + 
        texture(texImage, fragTexCoord + pixelSize*vec2(-1, 0))*kernel[3] + 
        texture(texImage, fragTexCoord + pixelSize*vec2(0, 0))*kernel[4] + 
        texture(texImage, fragTexCoord + pixelSize*vec2(1, 0))*kernel[5] + 
        texture(texImage, fragTexCoord + pixelSize*vec2(-1, 1))*kernel[6] + 
        texture(texImage, fragTexCoord + pixelSize*vec2(0, 1))*kernel[7] + 
        texture(texImage, fragTexCoord + pixelSize*vec2(1, 1))*kernel[8];
    outColor = vec4(colorSum.rgb, 1);
    vec3 ambientReflection = ambient*outColor.rgb;
    float dotCheck = dot(normalize(-surfaceToLight), lightbulbDirection);
    float distance = length(surfaceToLight)/1000.0;
    float lightAmount = (1.0/(0.5 + distance*distance))*smoothstep(dotLimitLower, dotLimitUpper, dotCheck);
    vec3 diffuseReflection = diffuse*outColor.rgb*(0.5*max(dot(normalize(v_normal), reversedSun), 0.0) + lightAmount*max(dot(normalize(v_normal), normalize(surfaceToLight)), 0.0)*lightbulbColor);
    vec3 halfVector = normalize(normalize(surfaceToLight) + normalize(surfaceToCamera));
    float specularReflection = lightAmount*pow(max(dot(normalize(v_normal), halfVector), 0.0), shininess);
    outColor = vec4(ambientReflection + diffuseReflection + specularReflection*lightbulbColor, 1);
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
        console.log(gl.getShaderInfoLog(shader));
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

const vertexShaderSource2 = `#version 300 es
in vec4 position;
in vec4 backColor;
in vec3 a_normal;
uniform mat4 transformation;
uniform mat4 modelInverseTranspose;
uniform vec3 lightbulbPosition;
uniform mat4 model;
uniform vec3 cameraPosition;
out vec4 color;
out vec3 v_normal;
out vec3 surfaceToLight;
out vec3 surfaceToCamera;
void main() {
    gl_Position = transformation*position;
    color = backColor;
    v_normal = mat3(modelInverseTranspose)*a_normal;
    surfaceToLight = lightbulbPosition - (model*position).xyz;
    surfaceToCamera = cameraPosition - (model*position).xyz;
}`;
const fragmentShaderSource2 = `#version 300 es
precision highp float;
in vec4 color;
in vec3 v_normal;
in vec3 surfaceToLight;
in vec3 surfaceToCamera;
uniform float ambient;
uniform float diffuse;
uniform float shininess;
uniform vec3 reversedSun;
uniform vec3 lightbulbColor;
uniform vec3 lightbulbDirection;
uniform float dotLimitUpper;
uniform float dotLimitLower;
out vec4 outColor;
void main() {
    outColor = color;
    vec3 ambientReflection = ambient*outColor.rgb;
    float dotCheck = dot(normalize(-surfaceToLight), lightbulbDirection);
    float distance = length(surfaceToLight)/1000.0;
    float lightAmount = (1.0/(0.5 + distance*distance))*smoothstep(dotLimitLower, dotLimitUpper, dotCheck);
    vec3 diffuseReflection = diffuse*outColor.rgb*(0.5*max(dot(normalize(v_normal), reversedSun), 0.0) + lightAmount*max(dot(normalize(v_normal), normalize(surfaceToLight)), 0.0)*lightbulbColor);
    vec3 halfVector = normalize(normalize(surfaceToLight) + normalize(surfaceToCamera));
    float specularReflection = lightAmount*pow(max(dot(normalize(v_normal), halfVector), 0.0), shininess);
    outColor = vec4(ambientReflection + diffuseReflection + specularReflection*lightbulbColor, 1);
}`;
const vertexShader2 = createShader(gl.VERTEX_SHADER, vertexShaderSource2);
const fragmentShader2 = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource2);
const program2 = gl.createProgram();
gl.attachShader(program2, vertexShader2);
gl.attachShader(program2, fragmentShader2);
gl.linkProgram(program2);
if (!gl.getProgramParameter(program2, gl.LINK_STATUS)) {
    document.querySelector("h2").innerHTML += "WebGL linking failed.";
}





//VAO Setups
const positionLocation = gl.getAttribLocation(program, "position");
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [-500, -500, 100, 500, -500, 100, 500, 500, 100, 500, 500, 100, -500, 500, 100, -500, -500, 100];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
const texturedVAO = gl.createVertexArray();
gl.bindVertexArray(texturedVAO);
gl.enableVertexAttribArray(positionLocation);
const size = 3;
const type = gl.FLOAT;
const normalize = false;
const stride = 0;
const offset = 0;
gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
const texCoordLocation = gl.getAttribLocation(program, "vertexTexCoord");
const texCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
const texCoords = [0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
gl.enableVertexAttribArray(texCoordLocation);
gl.vertexAttribPointer(texCoordLocation, 2, type, normalize, stride, offset);
const normalLocation = gl.getAttribLocation(program, "a_normal");
const normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
const normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
gl.enableVertexAttribArray(normalLocation);
gl.vertexAttribPointer(normalLocation, size, type, normalize, stride, offset);

const backgroundVAO = gl.createVertexArray();
gl.bindVertexArray(backgroundVAO);
const positionLocation2 = gl.getAttribLocation(program2, "position");
gl.enableVertexAttribArray(positionLocation2);
const positionBuffer2 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2);
const positions2 = [-500, -500, -100, 500, 500, -100, 500, -500, -100, 500, 500, -100, -500, -500, -100, -500, 500, -100, 500, -500, 100, 500, -500, -100, 500, 500, -100, 500, 500, -100, 500, 500, 100, 500, -500, 100, -500, -500, 100, -500, 500, -100, -500, -500, -100, -500, 500, -100, -500, -500, 100, -500, 500, 100, -500, 500, 100, 500, 500, 100, 500, 500, -100, 500, 500, -100, -500, 500, -100, -500, 500, 100, -500, -500, -100, 500, -500, -100, 500, -500, 100, 500, -500, 100, -500, -500, 100, -500, -500, -100];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions2), gl.STATIC_DRAW);
gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
const colorLocation = gl.getAttribLocation(program2, "backColor");
gl.enableVertexAttribArray(colorLocation);
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
const colors = [55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55];
gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
gl.vertexAttribPointer(colorLocation, size, gl.UNSIGNED_BYTE, true, stride, offset);

const normalLocation2 = gl.getAttribLocation(program2, "a_normal");
const normalBuffer2 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer2);
const normals2 = [0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals2), gl.STATIC_DRAW);
gl.enableVertexAttribArray(normalLocation2);
gl.vertexAttribPointer(normalLocation2, size, type, normalize, stride, offset);



//Textures and framebuffers
const unit = 0;
gl.activeTexture(gl.TEXTURE0 + unit);
function textureSetup() {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return texture;
}
const mainTexture = textureSetup();
const mipLevel = 0;
const internalFormat = gl.RGBA;
const sourceFormat = gl.RGBA;
const srcType = gl.UNSIGNED_BYTE;
const image = new Image();
const border = 0;
const data = null;
image.src = "testbmp";
let backTexture1;
let backTexture2;
let fbo1;
let fbo2;
image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, mainTexture);
    gl.texImage2D(gl.TEXTURE_2D, mipLevel, internalFormat, sourceFormat, srcType, image);
    backTexture1 = textureSetup();
    gl.texImage2D(gl.TEXTURE_2D, mipLevel, internalFormat, image.width, image.height, border, sourceFormat, srcType, data);
    backTexture2 = textureSetup();
    gl.texImage2D(gl.TEXTURE_2D, mipLevel, internalFormat, image.width, image.height, border, sourceFormat, srcType, data);
    fbo1 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo1);
    const attachmentPoint = gl.COLOR_ATTACHMENT0;
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, backTexture1, mipLevel);
    fbo2 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo2);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, backTexture2, mipLevel);
};





//Uniforms
let gaussianBlur = [1/16, 2/16, 1/16, 2/16, 3/16, 2/16, 1/16, 2/16, 1/16];
let emboss = [-2, -1, 0, -1, 1, 1, 0, 1, 2];
let normalKernel = [0, 0, 0, 0, 1, 0, 0, 0, 0];
const kernelLocation = gl.getUniformLocation(program, "kernel");
const transformationLocation = gl.getUniformLocation(program, "transformation");
const transformationLocation2 = gl.getUniformLocation(program2, "transformation");
const texImageLocation = gl.getUniformLocation(program, "texImage");
const ambientLocation = gl.getUniformLocation(program, "ambient");
const ambientLocation2 = gl.getUniformLocation(program2, "ambient");
const diffuseLocation = gl.getUniformLocation(program, "diffuse");
const diffuseLocation2 = gl.getUniformLocation(program2, "diffuse");
const reversedSunLocation = gl.getUniformLocation(program, "reversedSun");
const reversedSunLocation2 = gl.getUniformLocation(program2, "reversedSun");
const modelInverseTransposeLocation = gl.getUniformLocation(program, "modelInverseTranspose");
const modelInverseTransposeLocation2 = gl.getUniformLocation(program2, "modelInverseTranspose");
const lightbulbPositionLocation = gl.getUniformLocation(program, "lightbulbPosition");
const lightbulbPositionLocation2 = gl.getUniformLocation(program2, "lightbulbPosition");
const modelLocation = gl.getUniformLocation(program, "model");
const modelLocation2 = gl.getUniformLocation(program2, "model");
const cameraPositionLocation = gl.getUniformLocation(program, "cameraPosition");
const cameraPositionLocation2 = gl.getUniformLocation(program2, "cameraPosition");
const shininessLocation = gl.getUniformLocation(program, "shininess");
const shininessLocation2 = gl.getUniformLocation(program2, "shininess");
const lightbulbColorLocation = gl.getUniformLocation(program, "lightbulbColor");
const lightbulbColorLocation2 = gl.getUniformLocation(program2, "lightbulbColor");
const lightbulbDirectionLocation = gl.getUniformLocation(program, "lightbulbDirection");
const lightbulbDirectionLocation2 = gl.getUniformLocation(program2, "lightbulbDirection");
const dotLimitUpperLocation = gl.getUniformLocation(program, "dotLimitUpper");
const dotLimitUpperLocation2 = gl.getUniformLocation(program2, "dotLimitUpper");
const dotLimitLowerLocation = gl.getUniformLocation(program, "dotLimitLower");
const dotLimitLowerLocation2 = gl.getUniformLocation(program2, "dotLimitLower");
 



//State Setup
gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);





//Render Loop
function render() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.useProgram(program);
    if (loop >= 30) {
        loop = 0;
        times *= -1;
        cameraLoop++;
    }
    if (cameraLoop >= 10) {
        cameraLoop = 0;
        focus = !focus;
    }
    loop++;
    xtrans += times*5;
    ytrans += times*5;
    ztrans += times*5;
    ztheta += times*5*2*Math.PI/360;
    ytheta += times*5*4*Math.PI/360;
    xtheta += times*5*2*Math.PI/360;
    scale += -times*0.01;
    camztheta = 0;
    camytheta = 0;
    camxtheta = 0;
    deg += 16*Math.PI/360;
    camx = 500*Math.cos(deg);
    camy = 0;
    camz = -500*Math.sin(deg);
    focusx = xtrans;
    focusy = ytrans;
    focusz = ztrans;
    let aspect = canvas.width/canvas.height;
    gl.uniform1i(texImageLocation, unit);
    gl.bindVertexArray(texturedVAO);
    let primitiveType = gl.TRIANGLES;
    let offset = 0;
    let count = 6;
    gl.uniformMatrix4fv(transformationLocation, false, [2/1000, 0, 0, 0, 0, 2/1000, 0, 0, 0, 0, 2/1000, 0, 0, 0, 0, 1]);
    gl.viewport(0, 0, image.width, image.height);
    gl.bindTexture(gl.TEXTURE_2D, mainTexture);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo1);
    gl.uniform1fv(kernelLocation, gaussianBlur);
    gl.drawArrays(primitiveType, offset, count);
    gl.uniformMatrix4fv(transformationLocation, false, [2/1000, 0, 0, 0, 0, 2/1000, 0, 0, 0, 0, 2/1000, 0, 0, 0, 0, 1]);
    gl.viewport(0, 0, image.width, image.height);
    gl.bindTexture(gl.TEXTURE_2D, backTexture1);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo2);
    gl.uniform1fv(kernelLocation, emboss);
    gl.drawArrays(primitiveType, offset, count);
    let transformationMatrix = createTransformationMatrix(scale, ztheta, ytheta, xtheta, xtrans, ytrans, ztrans, aspect, Math.PI/3, 10, 2000, focus, camztheta, camytheta, camxtheta, camx, camy, camz, focusx, focusy, focusz);
    let modelInverseTranspose = createModelInverseTranspose(scale, ztheta, ytheta, xtheta, xtrans, ytrans, ztrans);
    let model = createModel(scale, ztheta, ytheta, xtheta, xtrans, ytrans, ztrans);
    gl.uniformMatrix4fv(transformationLocation, false, transformationMatrix);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.bindTexture(gl.TEXTURE_2D, backTexture2);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1fv(kernelLocation, normalKernel);
    gl.uniform1f(ambientLocation, ambient);
    gl.uniform1f(diffuseLocation, diffuse);
    gl.uniform3f(reversedSunLocation, reversedSun[0], reversedSun[1], reversedSun[2]);
    gl.uniformMatrix4fv(modelInverseTransposeLocation, false, modelInverseTranspose);
    gl.uniform3f(lightbulbPositionLocation, lightbulb[0], lightbulb[1], lightbulb[2]);
    gl.uniformMatrix4fv(modelLocation, false, model);
    gl.uniform3f(cameraPositionLocation, camx, camy, camz);
    gl.uniform1f(shininessLocation, shininess);
    gl.uniform3f(lightbulbColorLocation, lightbulbColor[0], lightbulbColor[1], lightbulbColor[2]);
    gl.uniform3f(lightbulbDirectionLocation, lightbulbDirection[0], lightbulbDirection[1], lightbulbDirection[2]);
    gl.uniform1f(dotLimitUpperLocation, dotLimitUpper);
    gl.uniform1f(dotLimitLowerLocation, dotLimitLower);
    gl.drawArrays(primitiveType, offset, count);

    gl.useProgram(program2);
    gl.bindVertexArray(backgroundVAO);
    gl.uniformMatrix4fv(transformationLocation2, false, transformationMatrix);
    gl.uniform1f(ambientLocation2, ambient);
    gl.uniform1f(diffuseLocation2, diffuse);
    gl.uniform3f(reversedSunLocation2, reversedSun[0], reversedSun[1], reversedSun[2]);
    gl.uniformMatrix4fv(modelInverseTransposeLocation2, false, modelInverseTranspose);
    gl.uniform3f(lightbulbPositionLocation2, lightbulb[0], lightbulb[1], lightbulb[2]);
    gl.uniformMatrix4fv(modelLocation2, false, model);
    gl.uniform3f(cameraPositionLocation2, camx, camy, camz);
    gl.uniform1f(shininessLocation2, shininess);
    gl.uniform3f(lightbulbColorLocation2, lightbulbColor[0], lightbulbColor[1], lightbulbColor[2]);
    gl.uniform3f(lightbulbDirectionLocation2, lightbulbDirection[0], lightbulbDirection[1], lightbulbDirection[2]);
    gl.uniform1f(dotLimitUpperLocation2, dotLimitUpper);
    gl.uniform1f(dotLimitLowerLocation2, dotLimitLower);
    gl.drawArrays(primitiveType, offset, 30);
}





//Main Code
let xtrans = 0;
let ytrans = 0;
let ztrans = -1000;
let ztheta = -Math.PI/2;
let ytheta = 0//-Math.PI/2;
let xtheta = 0//-Math.PI/2;
let scale = 1;
let loop = 0;
let cameraLoop = 0;
let focus = false;
let camztheta = 0;
let camytheta = 0;
let camxtheta = 0;
let camx = 0;
let camy = 0;
let camz = 0;
let focusx = 10
let focusy = 10;
let focusz = -10;
let times = 1;
let deg = 0;
let ambient = 0.2;
let diffuse = 0.8;
let shininess = 500;
let reversedSun = vectorNormalize([1, 1, 1]);
let lightbulb = [0, 0, 0];
let lightbulbColor = [180/255, 100/255, 255/255];
let lightbulbDirection = vectorNormalize([0, 0, -1]);
let dotLimitUpper = Math.cos(Math.PI/12);
let dotLimitLower = Math.cos(Math.PI/6);
setInterval(() => render(), 50);

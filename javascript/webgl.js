function render() {
    const canvas = document.querySelector("#webgl");
    const gl = canvas.getContext("webgl");
    if (gl == null) {
        document.querySelector("h2").innerHTML = "WebGL is not supported by your browers. Cannot Render Animation.";
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    console.log(gl.getParameter(gl.VERSION));
    console.log(gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
}

render();

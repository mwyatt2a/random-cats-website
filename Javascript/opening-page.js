function change() {
    fetch("/getNotes").then(data => data.text()).then(result => document.getElementById("test").innerHTML = result);
}

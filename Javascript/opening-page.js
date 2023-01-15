function change() {
    fetch("/changeImage").then(data => data.text()).then(result => {
        document.getElementById("cat").src = result;
        document.getElementById("source").href = result;
        });
}
change();

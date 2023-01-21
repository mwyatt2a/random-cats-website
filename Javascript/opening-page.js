function change() {
    fetch("/changeImage").then(data => data.text()).then(result => {
        document.getElementById("cat").src = result;
        document.getElementById("source").href = result;
    });
    
}

function add() {
    let url = prompt("Enter the url of the new image");
    if (url === null) {
        return
    }
    fetch("/add?url=" + url).then((response) => response.text()).then((text) => {
        if (text === "success") {
            alert("Image Added Successfully!");
        }
        else if (text === "duplicate") {
            alert("That URL Was Already Added");
        }
        else {
            alert("Something Went Wrong :( , " + text);
        }
    });
}



change();

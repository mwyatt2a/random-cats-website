function change() {
    fetch("/changeImage").then(data => data.json()).then(result => {
        document.getElementById("cat").src = result.url;
        document.getElementById("source").href = result.url;
        document.getElementById("viewsContent").innerHTML = result.views;
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

function bad() {
    url = document.getElementById("source").href;
    fetch("/bad", {method: "POST", body: url}).then((response) => {
        alert("Report Recieved!\n\nIf the ratio of reports to views exceeds a certain value, the image will be removed.");
        change();
    });
}

change();

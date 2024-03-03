function changeMap() {
    // Get the input value
    let inputAddress = document.getElementById("userInput").value;
    let map = document.getElementById("map")
    map.setAttribute("src", "https://www.google.com/maps/embed/v1/search?q=" + inputAddress + "&zoom=18&key=AIzaSyCmSzImOzSIVqGLKXi1ppJJWBlc8iYXJm4&maptype=satellite")
}

function checkLocation() {
    let lat = document.getElementById("lat").value
    let long = document.getElementById("long").value
    let map = document.getElementById("map")
    let stats = document.getElementById("stats").style.display = "block"
    map.setAttribute("src", "https://www.google.com/maps/embed/v1/view?center=" + lat + "," + long + "&zoom=18&key=AIzaSyCmSzImOzSIVqGLKXi1ppJJWBlc8iYXJm4&maptype=satellite")
}
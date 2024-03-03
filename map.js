function initMap(latlng={lat: 35.7596, lng: -79.0193}, zoom=7) {
    const gMap = new google.maps.Map(document.getElementById("map"), {
        zoom: zoom,
        center: latlng,
        mapTypeId: "hybrid",
        backgroundColor: "none",
    })

    gMap.addListener("click", (mapsMouseEvent) => {
        coords = mapsMouseEvent.latLng.toJSON()
        let latlong = document.getElementById("latlong")
        latlong.value = coords['lat'] + ", " + coords['lng']
        checkLocation()
    });
}

window.initMap = initMap;

function changeMap() {
    // Get the input value
    let inputAddress = document.getElementById("userInput").value;
    let map = document.getElementById("map")
    map.setAttribute("src", "https://www.google.com/maps/embed/v1/search?q=" + inputAddress + "&zoom=18&key=AIzaSyCmSzImOzSIVqGLKXi1ppJJWBlc8iYXJm4&maptype=satellite")
}

function checkLocation() {
    let latlong = document.getElementById("latlong").value
    let map = document.getElementById("map")

    latlongList = latlong.split(",")
    latlongList[0] = parseFloat(latlongList[0])
    latlongList[1] = parseFloat(latlongList[1])
    
    if (!(latlongList[0] > 33.8 && latlongList[0] < 36.6 && latlongList[1] < -75.4 && latlongList[1] > -84.2)) {
        alert("For accurate data, choose a location in North Carolina")
        return
    }

    initMap({lat: latlongList[0], lng: latlongList[1]}, 18)
    
    let stats = document.getElementById("stats")
    stats.style.display = "block"

    document.getElementById("coords").textContent = latlong

    //to change k value, change number below
    const knn = new KNN(1, dataset);
    
    //add coordinates here
    const newPoint = { x1: latlongList[0], x2: latlongList[1] };
    console.log(newPoint)
    
    //finds data point closest to the inputted data point
    const result = knn.classify(newPoint);
    console.log(`The predicted label for the new point is: ${result}`);
    
    //data prep to analyze land
    let data1
    let dataset1
    dataset1=[]
    for(let i=0;i<JSONfile.length;i++){
        data1={x1:JSONfile[i].temperature, x2 : JSONfile[i].humidity, x3: JSONfile[i].soil_temp, x4: JSONfile[i].soil_moisture, label:JSONfile[i].land_use}
        dataset1.push(data1)
    }
    
    const knn1 = new KNN1(20, dataset1);
    
    //these are all the categories
    let classification=["Tree cover, broadleaved, evergreen","Tree cover, needleleaved, evergreen","Mosaic cropland and natural vegetation","Mosaic tree and shrub and herbaceous cover","Urban Areas","Cropland, irrigated or post-flooding","Tree cover, flooded, fresh or brakish water", "Shrubland","Lichens and mosses","Mosaic herbaceous cover (>50%) / tree and shrub (<50%)","Water bodies","Tree cover, flooded, saline water","Tree cover, broadleaved, deciduous, closed to open (>15%)","Shrub or herbaceous cover, flooded, fresh/saline/brakish water","Grassland"]
    
    //this was found from previous iteration of algorithm
    const newPoint1 = {x1:JSONfile[result].temperature, x2 : JSONfile[result].humidity, x3: JSONfile[result].soil_temp, x4: JSONfile[result].soil_moisture};
    
    //calculates land type and prints
    const result1 = classification[Math.floor(knn1.classify(newPoint1))];
    console.log(`The predicted label for the new point is: ${result1}`);

    let oldStats = stats.querySelectorAll("p")
    oldStats.forEach(function(element) {
        element.remove()
    })

    let stat = document.createElement("p")
    stat.textContent = result1
    stats.appendChild(stat)

}
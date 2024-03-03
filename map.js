function initMap(latlng={lat: 35.7596, lng: -79.0193}, zoom=7) {
    const gMap = new google.maps.Map(document.getElementById("map"), {
        disableDefaultUI: true,
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
        alert("For accurate results, choose a location in North Carolina")
        return
    }

    initMap({lat: latlongList[0], lng: latlongList[1]}, 18)
    
    let stats = document.getElementById("stats")
    stats.style.display = "block"

    document.getElementById("coords").style.display = "none"
    
    let data
    let dataset
    dataset=[]
    for(let i=0;i<JSONfile.length;i++){
        data={x1:JSONfile[i].Latitude, x2 : JSONfile[i].Longitude,label:i}
        dataset.push(data)
    }
    
    //to change k value, change number below
    const knn = new KNN(1, dataset);
    const knnA = new KNN(15, dataset);
    const knnB = new KNN(30, dataset);
    
    //add coordinates here
    const newPoint = { x1: latlongList[0], x2: latlongList[1]};
    
    //finds data point closest to the inputted data point
    const resultA = knn.classify(newPoint);
    const resultB = knnA.classify(newPoint);
    const resultC = knnB.classify(newPoint);
    
    //console.log(`The predicted label for the new point is: ${result}`);
    
    //data prep to analyze land
    let data1
    let dataset1
    dataset1=[]
    for(let i=0;i<JSONfile.length;i++){
        data1={x1:JSONfile[i].temperature, x2 : JSONfile[i].humidity, x3: JSONfile[i].soil_temp, x4: JSONfile[i].soil_moisture, label:JSONfile[i].land_use}
        dataset1.push(data1)
    }
    
    const knn1 = new KNN1(15, dataset1);
    const knn3 = new KNN1(30, dataset1);
    
    
    //these are all the categories
    let classification=["Tree cover, broadleaved, evergreen","Tree cover, needleleaved, evergreen","Mosaic cropland and natural vegetation","Mosaic tree and shrub and herbaceous cover","Urban Areas","Cropland, irrigated or post-flooding","Tree cover, flooded, fresh or brakish water", "Shrubland","Lichens and mosses","Mosaic herbaceous cover (>50%) / tree and shrub (<50%)","Water bodies","Tree cover, flooded, saline water","Tree cover, broadleaved, deciduous, closed to open (>15%)","Shrub or herbaceous cover, flooded, fresh/saline/brakish water","Grassland"]
    
    //this was found from previous iteration of algorithm
    const newPoint1 = {x1:JSONfile[resultA].temperature, x2 : JSONfile[resultA].humidity, x3: JSONfile[resultA].soil_temp, x4: JSONfile[resultA].soil_moisture};
    
    let statValues = []
    let statElements = []
    
    //calculates land type and prints
    const result1 = classification[Math.floor(knn1.classify(newPoint1))];
    let geo15 = result1
    console.log(`The predicted label for the area in 15 years by geographic features: ${result1}`);
    let loc15 = classification[Math.floor(JSONfile[resultB].land_use)]
    console.log(`The predicted label for the area in 15 years by location is: ${loc15}`);
    let current = classification[Math.floor(JSONfile[resultA].land_use)]
    console.log(`Current area is: ${current}`);
  
    const result3 = classification[Math.floor(knn3.classify(newPoint1))];
    let geo30 = result3
    console.log(`In 30 years, by geographic features, the area is predicted to be: ${result3}`);
    let loc30 = classification[Math.floor(JSONfile[resultC].land_use)]
    console.log(`In 30 years, by location, the area is predicted to be: ${loc30}`);
    
    console.log(" ")
    console.log("Temperature:",JSONfile[resultA].temperature)
    console.log("Humidity:",JSONfile[resultA].humidity)
    console.log("Soil Temperature:",JSONfile[resultA].soil_temp)
    console.log("Soil Moisture:",JSONfile[resultA].soil_moisture)
    console.log(" ")

    let temperature = JSONfile[resultA].temperature
    let humidity = JSONfile[resultA].humidity
    let soilTemp = JSONfile[resultA].soil_temp
    let soilMoisture = JSONfile[resultA].soil_moisture
    
    let binaryClassifier
    if(JSONfile[resultA].land_use === "4"){
        binaryClassifier = 3
    } else if(JSONfile[resultB].land_use === "4" || result1 === "4"){
        binaryClassifier = 2
    } else if(JSONfile[resultC].land_use === "4" || result3 === "4"){
        binaryClassifier = 1
    } else{
        binaryCLassifier=0
    }
    
    
    console.log("Based off the predictions, this area has an urbanization risk level of", binaryClassifier)
    
    if(binaryClassifier===3){
        console.log("Do not farm here. Land should be utilized for urbanization")
        statValues.push("Farming Potential: Very low. Land should be utilized for urbanization.")
    } else if(binaryClassifier===2){
        console.log("High risk. Development will likely occur here. Land should be used for urbanization")
        statValues.push("Farming Potential: Low. Development will likely occur here. Land should be used for urbanization.")
    } else if(binaryClassifier===1){
        console.log("Low risk. Farming is ok here. Urban developers should not go after these lands")
        statValues.push("Farming Potential: Moderate. Farming can be done here. Urban developers should not go after these lands.")
    } else{
        console.log("Urban developers should not touch this land at all. Safe area for farming")
        statValues.push("Farming Potential: High. Urban developers should not touch this land at all. Safe area for farming.")
    }

    statValues.push(current, geo15, loc15, geo30, loc30, temperature, humidity, soilTemp, soilMoisture)

    let oldStats = stats.querySelectorAll("p, li, hr")
    oldStats.forEach(function(element) {
        element.remove()
    })

    let stat = document.createElement("p")
    stat.textContent = statValues[0]
    statElements.push(stat)
    stat.classList.add("proj")

    statElements.push(document.createElement("hr"))

    stat = document.createElement("p")
    stat.textContent = "This land is currently categorized as: " + current + "."
    statElements.push(stat)

    let divider = document.createElement("p")
    divider.textContent = "Based on environmental features, this land is projected to be categorized as..."
    divider.classList.add("divider")
    statElements.push(divider)

    stat = document.createElement("li")
    stat.textContent = geo15 + " in 15 years."
    statElements.push(stat)

    stat = document.createElement("li")
    stat.textContent = geo30 + " in 30 years."
    statElements.push(stat)

    divider = document.createElement("p")
    divider.textContent = "Based on nearby developments, this land is projected to be categorized as..."
    divider.classList.add("divider")
    statElements.push(divider)

    stat = document.createElement("li")
    stat.textContent = loc15 + " in 15 years."
    statElements.push(stat)

    stat = document.createElement("li")
    stat.textContent = loc30 + " in 30 years."
    statElements.push(stat)

    divider = document.createElement("p")
    divider.textContent = "Other Statistics:"
    divider.classList.add("divider")
    statElements.push(divider)

    stat = document.createElement("li")
    stat.textContent = "Average Temperature: " + Math.round((9/5) * temperature + 32) + " \u00B0F"
    statElements.push(stat)

    stat = document.createElement("li")
    stat.textContent = "Average Humidity: " + Math.round(humidity) + "%"
    statElements.push(stat)
    
    stat = document.createElement("li")
    stat.textContent = "Average Soil Temperature: " + Math.round((9/5) * soilTemp + 32) + " \u00B0F"
    statElements.push(stat)
    
    stat = document.createElement("li")
    stat.textContent = "Average Soil Moisture: " + Math.round(soilMoisture * 100) / 100 + "%"
    statElements.push(stat)

    for (statElement of statElements) {
        stats.appendChild(statElement)
    }

    console.log(statValues)

}
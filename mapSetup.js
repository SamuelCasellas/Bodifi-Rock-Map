const API_KEY = "AAPK321d61bd8cb64adcaf742d6cdb358ccdCXO2JrGUFiZl0PQvgiRgB1wGhZCRKBqE5xirtn9bSIMdlfdsRnmH33XiIBVB2JfN";

const IDAHO_PARKS_FEATURE_LAYER_URL = "https://services8.arcgis.com/YY0zev9RpFX809lW/arcgis/rest/services/Parks_in_IF/FeatureServer/0";
const GAME_BOUNDRY_FEATURE_LAYER_URL = "https://services8.arcgis.com/YY0zev9RpFX809lW/arcgis/rest/services/Game_Boundry/FeatureServer/0";

// Rigby is the between Rexburg and Idaho so we will use that.
const RIGBY_LONGITUDE = -111.909829694;
const RIGBY_LATITUDE = 43.670997316;
const ZOOM_START = 10.9;

require([
    "esri/config", 
    "esri/Map", 
    "esri/views/MapView",

    "esri/layers/FeatureLayer"
    ], 
    function (esriConfig, Map, MapView, FeatureLayer) {
    // Basic config
    esriConfig.apiKey = API_KEY;

    const map = new Map({
        basemap: "arcgis-topographic" // Basemap layer service
    });

    const view = new MapView({
        map: map,
        center: [RIGBY_LONGITUDE, RIGBY_LATITUDE], // Longitude, latitude
        zoom: ZOOM_START, // Zoom level
        container: "viewDiv" // Div element
    });

    // Configure parks
    const popupPark = {
        "title": "Parks",
        "content": "<b>Park name:</b> {Park_Name}<br>\
        <b>Address:</b> {Directions}<br>\
        <b>Accessories:</b> {Accessories}<br>\
        <b>Comments:</b> {Comments}<br>"
        
    };

    const parks = new FeatureLayer({
        url: IDAHO_PARKS_FEATURE_LAYER_URL,
        outFields: ["Park_Name", "Directions", "Accessories", "Comments"],
        popupTemplate: popupPark
    });

    map.add(parks);

    // Add Game Boundaries
    const gameBoundarySketch = new FeatureLayer({
        url: GAME_BOUNDRY_FEATURE_LAYER_URL
    });

    map.add(gameBoundarySketch);
    
    
    // Control altitude, game boundary
    const boundaryButton = document.getElementById("boundary");
    let boundaryShow = true;
    
    boundaryButton.addEventListener("click", function() {
        if (boundaryShow) {
            map.remove(gameBoundarySketch);
            boundaryShow = false;
        } else {
            map.add(gameBoundarySketch);
            boundaryShow = true;
        }
    });

});

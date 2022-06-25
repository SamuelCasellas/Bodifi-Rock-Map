const API_KEY = "AAPK321d61bd8cb64adcaf742d6cdb358ccdCXO2JrGUFiZl0PQvgiRgB1wGhZCRKBqE5xirtn9bSIMdlfdsRnmH33XiIBVB2JfN";

const IDAHO_PARKS_FEATURE_LAYER_URL = "https://services8.arcgis.com/YY0zev9RpFX809lW/arcgis/rest/services/Parks_in_IF/FeatureServer/0";
const GAME_BOUNDRY_FEATURE_LAYER_URL = "https://services8.arcgis.com/YY0zev9RpFX809lW/arcgis/rest/services/Game_Boundry/FeatureServer/0";

// const southWest = [-112.182817, 43.304475];
// const northEast = [-111.59577, 44.071117];

const SLOPE_URL = "https://elevation.arcgis.com/arcgis/rest/services/WorldElevation/Terrain/ImageServer/";


// Rigby is the between Rexburg and Idaho so we will use that.
const RIGBY_LONGITUDE = -111.909829694;
const RIGBY_LATITUDE = 43.670997316;
const ZOOM_START = 10.9;

require([
    "esri/config", 
    "esri/Map", 
    "esri/views/MapView",

    "esri/layers/FeatureLayer",
    "esri/layers/ImageryLayer"
    ], 
    function (esriConfig, Map, MapView, FeatureLayer, ImageryLayer) {
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


    // Configure altitude
    const altitude = new ImageryLayer({
        portalItem: {
            id: 'a1ba14d09df14f42ad6ca3c4bcebf3b4'
        }
    });

    altitude.opacity = 0.7;
    map.add(altitude, 0);


    // Add Game Boundaries
    const gameBoundarySketch = new FeatureLayer({
        url: GAME_BOUNDRY_FEATURE_LAYER_URL
    });
    gameBoundarySketch.opacity = 0.15;
    map.add(gameBoundarySketch, 1);

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
        outFields: ["Park_Name",  "Directions", "Accessories", "Comments"],
        popupTemplate: popupPark
    });
    
    map.add(parks, 2);
    
    
    // Control altitude, game boundary
    const altitudeButton = document.getElementById("altitude");
    altitudeButton.addEventListener("click", function() {
        altitude.visible = !(altitude.visible);
    });

    const boundaryButton = document.getElementById("boundary");
    boundaryButton.addEventListener("click", function() {
      gameBoundarySketch.visible = !(gameBoundarySketch.visible);
    });

});

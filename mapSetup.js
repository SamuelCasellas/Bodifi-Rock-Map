const API_KEY = "AAPK321d61bd8cb64adcaf742d6cdb358ccdCXO2JrGUFiZl0PQvgiRgB1wGhZCRKBqE5xirtn9bSIMdlfdsRnmH33XiIBVB2JfN";

const SLOPE_URL = "https://elevation.arcgis.com/arcgis/rest/services/WorldElevation/Terrain/ImageServer/";

const GAME_BOUNDRY_FEATURE_LAYER_URL = "https://services8.arcgis.com/YY0zev9RpFX809lW/arcgis/rest/services/Game_Boundry/FeatureServer/0";
const IDAHO_PARKS_FEATURE_LAYER_URL = "https://services8.arcgis.com/YY0zev9RpFX809lW/arcgis/rest/services/Parks_in_IF/FeatureServer/0";
const PUBLIC_LAND_URL = "https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/PAD_US/FeatureServer";
const CAMPUS_MAP_URL = "https://services1.arcgis.com/z5tlnpYHokW9isdE/arcgis/rest/services/IdahoFallsCurrentCampusMap/FeatureServer/0";
const HISTORICAL_FEATURE_LAYER_URL = "https://gis.itd.idaho.gov/arcgisprod/rest/services/ArcGISOnline/IdahoTransportationLayersForOpenData/MapServer/43";

const MISCELLANEOUS_FEATURE_LAYER_URL = "https://services8.arcgis.com/YY0zev9RpFX809lW/arcgis/rest/services/Miscellaneous_Features/FeatureServer/0";
// const southWest = [-112.182817, 43.304475];
// const northEast = [-111.59577, 44.071117];

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
            id: "a1ba14d09df14f42ad6ca3c4bcebf3b4"
        },
        opacity: 0.7,
        visible: false
    });

    map.add(altitude, 0);



    // Add Game Boundaries
    const gameBoundarySketch = new FeatureLayer({
        url: GAME_BOUNDRY_FEATURE_LAYER_URL,
        opacity: 0.15
    });
    map.add(gameBoundarySketch, 1);

    // Configure parks
    const popupPark = {
        "title": "Parks",
        "content": "<b>Park name:</b> {Park_Name}<br></br>\
        <b>Address:</b> {Directions}<br></br>\
        <b>Accessories:</b> {Accessories}<br></br>\
        <b>Comments:</b> {Comments}<br>"
        
    };

    const parks = new FeatureLayer({
        url: IDAHO_PARKS_FEATURE_LAYER_URL,
        outFields: ["Park_Name",  "Directions", "Accessories", "Comments"],
        popupTemplate: popupPark
    });

    parks.renderer = {
        type: "simple",  // autocasts as new SimpleRenderer()
        symbol: {
          type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
          size: 6,
          color: "green",
          outline: {  // autocasts as new SimpleLineSymbol()
            width: 0.5,
            color: "dark-green"
          }
        }
      };
    
    map.add(parks, 2);

    // Configure public spaces
    const popupPublicSpace = {
        "title": "Public Space",
        "content": "<b>Place Name: </b> {Unit_Nm}<br></br>\
        <b>Feature Class:</b> {FeatClass}<br></br>\
        <b>Category:</b> {Category}<br></br>\
        <b>Owner Type:</b> {Own_Type}<br></br>\
        <b>Owner Name:</b> {Own_Name}<br></br>\
        <b>Local Owner:</b> {Loc_Own}<br></br>\
        <b>Manager Type:</b> {Mang_Type}<br></br>\
        <b>Manager Name:</b> {Mang_Name}<br></br>\
        <b>Local Manager:</b> {Loc_Mang}<br></br>\
        <b>Designation Type:</b> {Des_Tp}<br></br>\
        <b>Local Designation:</b> {Loc_Ds}<br></br>\
        <b>Local Name:</b> {Loc_Nm}<br></br>\
        <b>GIS Source Date:</b> {Src_Date}<br></br>\
        <b>GIS Acres:</b> {GIS_Acres}<br></br>\
        <b>Public Access:</b> {Pub_Access}<br></br>\
        <b>Public Access Date:</b> {Access_Dt}<br></br>\
        <b>GAP Status Code:</b> {GAP_Sts}<br></br>\
        <b>Date of Establishment:</b> {Date_Est}<br></br>\
        <b>Comments:</b> {Comments}<br></br>\
        <b>Shape Area:</b> {Shape__Area}<br></br>\
        <b>Shape Length:</b> {Shape__Length}<br></br>"
    }

    const publicSpaces = new FeatureLayer({
        url: PUBLIC_LAND_URL,
        outFields: [
            "FeatClass",
            "Category",
            "Own_Type",
            "Own_Name",
            "Loc_Own",
            "Mang_Type",
            "Mang_Name",
            "Loc_Mang",
            "Des_Tp",
            "Loc_Ds",
            "Unit_Nm",
            "Loc_Nm",
            "Src_Date",
            "GIS_Acres",
            "Pub_Access",
            "Access_Dt",
            "GAP_Sts",
            "Date_Est",
            "Comments",
            "Shape__Area",
            "Shape__Length",
        ],
        popupTemplate: popupPublicSpace,
        opacity: 0.5
    });

    map.add(publicSpaces, 2);
    

    // Add Campus

    const campus = new FeatureLayer({
        url: CAMPUS_MAP_URL,
        visible: false
    });

    map.add(campus, 2);

    // Add historical layer

    const historicalPointPopup = {
        "title": "Historical Facts",
        "content": "<b>Title:</b> {Title}<br></br>\
        <b>Location:</b> {Location}<br></br>\
        <b>Remarks:</b> {Remarks}<br></br>\
        <b>Text on Sign:</b> {TextonSign}<br></br>\
        <b>Photo of Sign:</b> <a href=\"{PhotoURL}\">Photo</a><br>"
    }

    const historicalPoints = new FeatureLayer({
        url: HISTORICAL_FEATURE_LAYER_URL,
        outFields: [
            "Title",
            "Location",
            "Remarks",
            "TextOnSign",
            "PhotoURL",
        ],
        popupTemplate: historicalPointPopup,
        visible: false
    });

    historicalPoints.renderer = {
        type: "simple",  // autocasts as new SimpleRenderer()
        symbol: {
          type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
          size: 6,
          color: "brown",
          outline: {  // autocasts as new SimpleLineSymbol()
            width: 0.5,
            color: "white"
          }
        }
      };

    map.add(historicalPoints, 2);

    // Miscellaneous Features

    const miscellaneousPopup = {
        "title": "Miscellaneous Feature",
        "content": "<b>Name:</b> {Name}<br></br>\
        <b>Address:</b> {Address}<br></br>\
        <b>Comments:</b> {Comments}<br></br>"
    }

    const miscellaneous = new FeatureLayer ({
        url: MISCELLANEOUS_FEATURE_LAYER_URL,
        outFields: ["Name", "Address", "Comments"],
        popupTemplate: miscellaneousPopup,
        visible: false
    });

    miscellaneous.renderer = {
        type: "simple",  // autocasts as new SimpleRenderer()
        symbol: {
          type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
          size: 6,
          color: "black",
          outline: {  // autocasts as new SimpleLineSymbol()
            width: 0.5,
            color: "white"
          }
        }
      };

    map.add(miscellaneous, 2);

    // Toggle map features
    const altitudeButton = document.getElementById("altitude");
    altitudeButton.addEventListener("click", function() {
        altitude.visible = !(altitude.visible);
        altitudeButton.value = "Show altitude ⛰: " + tellOnOrOff(altitude);
    });

    const boundaryButton = document.getElementById("boundary");
    boundaryButton.addEventListener("click", function() {
      gameBoundarySketch.visible = !(gameBoundarySketch.visible);
      boundaryButton.value = "Show game boundary 🟦: " + tellOnOrOff(gameBoundarySketch);
    });

    const parksButton = document.getElementById("parks");
    parksButton.addEventListener("click", function() {
      parks.visible = !(parks.visible);
      parksButton.value = "Show park points 🏞️: " + tellOnOrOff(parks);
    });

    const publicSpacesButton = document.getElementById("public-land");
    publicSpacesButton.addEventListener("click", function() {
      publicSpaces.visible = !(publicSpaces.visible);
      publicSpacesButton.value = "Show public lands 🚶: " + tellOnOrOff(publicSpaces);
    });

    const campusButton = document.getElementById("campus");
    campusButton.addEventListener("click", function() {
      campus.visible = !(campus.visible);
      campusButton.value = "Show Idaho Campus 🧑‍🎓: " + tellOnOrOff(campus);
    });

    const historicButton = document.getElementById("history");
    historicButton.addEventListener("click", function() {
      historicalPoints.visible = !(historicalPoints.visible);
      historicButton.value = "Show Historical Points 📖: " + tellOnOrOff(historicalPoints);
    });

    const otherButton = document.getElementById("other");
    otherButton.addEventListener("click", function() {
      miscellaneous.visible = !(miscellaneous.visible);
      otherButton.value = "Show Bodifi, Musuems locations: " + tellOnOrOff(miscellaneous);
    });

    function tellOnOrOff(feature) {
        if (feature.visible)
          return "On"
        else
          return "Off"
    }

});

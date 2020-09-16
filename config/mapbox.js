// var mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
console.log("help");
mapboxgl.accessToken =
  "pk.eyJ1IjoidmVyb25pY2FkZWxlb25oIiwiYSI6ImNrZjU0ZzM0cDBqYzgyc21kazBwbWlxemcifQ.PD9lxFAUmHtAh5TUogPICw";
var map = new mapboxgl.Map({
  container: "foodsharingmap",
  style: "mapbox://styles/mapbox/streets-v11",
});

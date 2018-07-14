// CREATES THE LEGEND. THIS IS UNUSED NOW.

var margin2 = { top: 0, right: 0, bottom: 0, left: 0 };
var width2 = $("#legend").width();
var mapRatio2 = .3;
var height2 = width2 * mapRatio2;
var w = 100;
var h = 7;

var svgLeg = d3.select("#legend").append("svg")
    .attr("width", width2)
    .attr("height", height2)
    .append("g")
//.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

var g2 = svgLeg.append('g');

var projection2 = d3.geoAlbersUsa()
    .scale(width2)
    .translate([width2 / 2, height2 / 2]);

states = d3.map();
rigosname = d3.map();
rigos = {};
population = d3.map();
overlapped = [];
rigo_information = {};


var path2 = d3.geoPath()
    .projection(projection2);

//var svg = d3.select("body").append("svg").attr("height",height).attr("width",width);



d3.queue()
    .defer(d3.json, 'us.topo.json')
    .defer(d3.json, 'vt.topo.json')
    .defer(d3.json, 'ma.topo.json')
    .defer(d3.json, 'nh.topo.json')
    .defer(d3.json, 'ri.topo.json')
    .defer(d3.json, 'ct.topo.json')
    .await(USARigo);



function USARigo(error, json1, vt, ma, nh, ri, ct) {

    const texture =
        textures.lines()
        .size(3)
        .strokeWidth(1);

    const texture1 =
        textures.lines()
        .size(4)
        .stroke("gray")
        .strokeWidth(1);
    svgLeg.call(texture);





    var legendGroup = g2.selectAll("legend")
        .data(color_c)
        .enter().append("g");

    legendGroup.append("text")
        .attr("x", function(d, i) { return ((2.5) * w * .50); })
        .attr("y", 15)
        .attr("font-size", "15px")
        .attr("font-weight", "Bold")
        .text("Rigo Boundaries");

    legendGroup.append("polyline")
        .attr("fill", "#6dcedf")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .style("stroke", "black")
        .attr("points", "20,30  40,60  60,30  20,10 20,30")
        .attr("transform", "translate(" + ((0.3 + 2.5) * w * .50) + "," + (25) + ")");


    legendGroup.append("text")
        .attr("x", function(d, i) { return ((1.2 + 2.5) * w * .70); })
        .attr("y", 15)
        .attr("font-size", "15px")
        .attr("font-weight", "Bold")
        .text("Overlapped Rigos & MSAs");


    legendGroup.append("polyline")
        .attr("fill", "#B0E689")
        .attr("stroke-width", 0.5)
        .style("stroke", "gray")
        .attr("points", "20,30  40,60  60,30  20,10 20,30")
        .attr("transform", "translate(" + ((1.8 + 2.5) * w * .70) + "," + (25) + ")");


    legendGroup.append("text")
        .attr("x", function(d, i) { return ((2.7 + 2.5) * w * .90); })
        .attr("y", 15)
        .attr("font-size", "15px")
        .attr("font-weight", "Bold")
        .text("MSA Counties");
    legendGroup.call(texture1);
    legendGroup.append("polyline")
        .attr("fill", "#f1fc37")
        .attr("stroke-width", 0.5)
        .style("stroke", "gray")
        .attr("points", "20,30  40,60  60,30  20,10 20,30")
        .attr("transform", "translate(" + ((2.8 + 2.5) * w * .90) + "," + (25) + ")");



    legendGroup.append("text")
        .attr("x", function(d, i) { return ((3.2 + 2.5) * w * 1.05); })
        .attr("y", 15)
        .attr("font-size", "15px")
        .attr("font-weight", "Bold")
        .text("Unattached Counties");
    legendGroup.call(texture1);
    legendGroup.append("polyline")
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("stroke-width", 0.5)
        .attr("points", "20,30  40,60  60,30  20,10 20,30")
        .attr("transform", "translate(" + ((3.5 + 2.5) * w * 1.05) + "," + (25) + ")");

};
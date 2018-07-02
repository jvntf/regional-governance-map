function msa2(){
    var margin2 = {top: 0, right: 0, bottom: 0, left: 0};
    var width2 = $("#legend").width();
    var mapRatio2 = .3;
    var height2 = width2 * mapRatio2;
    var w = 100;
    var h = 7;

    var svgLeg = d3.select("#legend").append("svg")
        .attr("width", width2)
        .attr("height", height2)
        .append("g");
        //.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
    var color_c= ["#FFF9CF","#FFF685", "#FFFD38", "#FED631", "#FDB92C","#ED9A2A"]; 

    var g2 = svgLeg.append("g");

    var projection2 =  d3.geoAlbersUsa()
        .scale(width2)
        .translate([width2 / 2, height2 / 2]);

    var MsaName =d3.map();
    var msaDic = {};
    var population =d3.map();
    var countyandMSAname = {};

    var path2 = d3.geoPath()
        .projection(projection2);

    //var svg = d3.select("body").append("svg").attr("height",height).attr("width",width);

    queue()
        .defer(d3.json, "us.topo.json")
        .defer(d3.json, "vt.topo.json")
        .defer(d3.json, "ma.topo.json")
        .defer(d3.json, "nh.topo.json")
        .defer(d3.json, "ri.topo.json")
        .defer(d3.json, "ct.topo.json")
        .await(USAMSA); 
                      
    function USAMSA(error, us, vt, ma, nh, ri, ct){

     


                       

        var legendGroup = g2.selectAll("legend")
            .data(color_c)
            .enter().append("g");

        legendGroup.append("rect")
            .attr("x", function(d, i){ return ((i+1.3)*w*1.02);})             
            .attr("y", 17)
            .attr("width", w)
            .attr("height", h)
            .attr("fill", function(d){ return d;})
            .attr("opacity", 0.7);

        legendGroup.append("text")
            .attr("x", function(d, i){ return ((1.3)*w*1.02);})             
            .attr("y", 10)
            .attr("font-size", "15px") 
            .attr("font-weight", "Bold")
            .text("MSA Population");

        legendGroup.append("text")
            .attr("x", function(d, i){ return ((1.3)*w*1.02);})             
            .attr("y", 40)
            .attr("font-size", "12px") 
            .text("Low Population");

                                
        legendGroup.append("text")
            .attr("x", function(d, i){ return ((5.1+1.3)*w*1.02);})             
            .attr("y", 40)
            .attr("font-size", "12px") 
            .text("High Population");

        legendGroup.append("text")
            .attr("x", function(d, i){ return ((2.5)*w*0.50);})             
            .attr("y", 70)
            .attr("font-size", "15px") 
            .attr("font-weight", "Bold")
            .text("MSA Boundaries");

        legendGroup.append("polyline")     
            .attr("fill", "#FDB92C")
            .attr("stroke","black")
            .attr("stroke-width", 2)
            .style("stroke", "black")
            .attr("points", "20,30  40,60  60,30  20,10 20,30")
            .attr("transform", "translate("+((.3+2.5)*w*0.5)+","+(80)+")");


        legendGroup.append("text")
            .attr("x", function(d, i){ return ((.8+2.5)*w*1.05);})             
            .attr("y", 70)
            .attr("font-size", "15px") 
            .attr("font-weight", "Bold")
            .text("Counties Boundaries");


        legendGroup.append("polyline")     
            .attr("fill", "#FDB92C")
            .attr("stroke-width", 0.5)
            .style("stroke", "gray")
            .attr("points", "20,30  40,60  60,30  20,10 20,30")
            .attr("transform", "translate("+((1.1+2.5)*w*1.05)+","+(80)+")");


        legendGroup.append("text")
            .attr("x", function(d, i){ return ((3.0+2.5)*w*1.05);})             
            .attr("y", 70)
            .attr("font-size", "15px") 
            .attr("font-weight", "Bold")
            .text("Not Applicable Counties");

        legendGroup.append("polyline")     
            .attr("fill", "white")
            .attr("stroke-width", 0.5)
            .style("stroke", "gray")
            .attr("points", "20,30  40,60  60,30  20,10 20,30")
            .attr("transform", "translate("+((3.3+2.5)*w*1.05)+","+(80)+")");

    }
}
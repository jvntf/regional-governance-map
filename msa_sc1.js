function msa1(){
    var margin = {top: 10, right: 0, bottom: 10, left: 0};
    var width = $("#national-map").width();
    var mapRatio = .5;
    var height = width * mapRatio;
    var w = 100;
    var h = 10;

    var svg = d3.select("#national-map").append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
        .append("g");
    //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                        
    var g1 = svg.append("g");

    var projection =  d3.geoAlbersUsa()
        .scale(width)
        .translate([width / 2, height / 2]);


    var MsaName =d3.map();
    var msaDic = {};
    var population =d3.map();
    var countyandMSAname = {};

    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }



    var color = d3.scaleThreshold()
        .domain([55273,100000, 500000, 1000000,5000000,15000000])
        .range(["#FFF9CF","#FFF685", "#FFFD38", "#FED631", "#FDB92C","#ED9A2A"]);
       
    var color_c= ["#FFF9CF","#FFF685", "#FFFD38", "#FED631", "#FDB92C","#ED9A2A"]; 

    var path = d3.geoPath()
        .projection(projection);


    d3.json("drawStateBorders.json", function(drawStateBorders){
        g1.append("path")
            .datum(topojson.feature(drawStateBorders, drawStateBorders.objects.us))
            .attr("fill", "none")
            .attr("stroke-width","2.5")
            .attr("d", path)
            .attr("stroke","black");
    });


    d3.csv("County and Muni MSA.csv", function(csv) {
                  
        csv.forEach(function(row) {

            population.set(row.MSA, row.MSAPOP);
            if(countyandMSAname[row.MSA]==null)
            {
                countyandMSAname[row.MSA]=new Array();
                countyandMSAname[row.MSA].push((row.MSA));
                countyandMSAname[row.MSA].push((row.State));
                countyandMSAname[row.MSA].push((row.MSAPOP));
                countyandMSAname[row.MSA].push((row.Place));



                                    
            }
                      
        });

        csv.forEach(function(row)
        {
            if(row.MSA != "Not Applicable")
            {
                if(msaDic[row.MSA]==null)
                {
                    msaDic[row.MSA]=new Array();
                    msaDic[row.MSA].push(parseInt(row.Code));
                }
                else
                {
                    msaDic[row.MSA].push(parseInt(row.Code));

                }

                if(MsaName.get(row.MSA)==undefined)
                {

                    MsaName.set(row.MSA,row.MSA);
                }
            }
        });
    });
    queue()
        .defer(d3.json, "us.topo.json")
        .defer(d3.json, "vt.topo.json")
        .defer(d3.json, "ma.topo.json")
        .defer(d3.json, "nh.topo.json")
        .defer(d3.json, "ri.topo.json")
        .defer(d3.json, "ct.topo.json")
        .await(USAMSA); 
                      
    function USAMSA(error, us, vt, ma, nh, ri, ct){


        g1.append("path")
            .datum(topojson.feature(us, us.objects.collection))
            .attr("fill", "none")
            .attr("d", path)
            .attr("stroke-width",0.5)
            .attr("stroke","gray");
                    
                    

        for(keys in msaDic){

            g1.append("path")
                .datum(topojson.merge(us, us.objects.collection.geometries.filter(function(d) {
                    return msaDic[keys].includes(parseInt(d.properties.fips));
                })))
                .attr("d", path)
                .attr("stroke","black")
                .style("fill", function(d){return color(population.get(keys));})
                .attr("fill-opacity", 0.7)
                .attr("stroke-width", "1.5")
                .attr("stroke-linejoin","round")
                .attr("stroke-linecap","round")
                .attr("id", function(d){  
                    return keys;
                }) 
                .style("cursor", "pointer")
                .on("click",zoom)
                .on("mouseover", hover)
                .on("mouseout", nohover);

        }

        g1.append("path")
            .data(topojson.feature(vt, vt.objects.vt).features)
            .attr("fill", "lightgray")
            .attr("d", path)
            .attr("stroke-width",0.5)
            .attr("stroke","white");

        for(keys in msaDic){
            g1.append("path")
                .datum(topojson.merge(vt, vt.objects.vt.geometries.filter(function(d) {
                    return msaDic[keys].includes(parseInt(d.id));})))
                .attr("d", path)
                .attr("stroke","black")
                .style("fill", function(d){return color(population.get(keys));})
                .attr("fill-opacity", 0.7)
                .attr("stroke-width", "1.5")
                .attr("stroke-linejoin","round")
                .attr("stroke-linecap","round")
                .attr("id", function(d){   
                    return keys;
                }) 
                .style("cursor", "pointer") 
                .on("click",zoom)
                .on("mouseover", hover)
                .on("mouseout", nohover);
        }

        g1.append("path")
            .data(topojson.feature(ma, ma.objects.ma).features)
            .attr("fill", "lightgray")
            .attr("d", path)
            .attr("stroke-width",0.5)
            .attr("stroke","white");

        for(keys in msaDic){
            g1.append("path")
                .datum(topojson.merge(ma, ma.objects.ma.geometries.filter(function(d) {
                    return msaDic[keys].includes(parseInt(d.id));})))
                .attr("d", path)
                .attr("stroke","black")
                .style("fill", function(d){return color(population.get(keys));})
                .attr("fill-opacity", 0.7)
                .attr("stroke-width", "1.5")
                .attr("stroke-linejoin","round")
                .attr("stroke-linecap","round")
                .attr("id", function(d){   
                    return keys;
                })
                .style("cursor", "pointer")  
                .on("click",zoom)
                .on("mouseover", hover)
                .on("mouseout", nohover);
        }

        g1.append("path")
            .data(topojson.feature(nh, nh.objects.nh).features)
            .attr("fill", "lightgray")
            .attr("d", path)
            .attr("stroke-width",0.5)
            .attr("stroke","white");

        for(keys in msaDic){
            g1.append("path")
                .datum(topojson.merge(nh, nh.objects.nh.geometries.filter(function(d) {
                    return msaDic[keys].includes(parseInt(d.id));})))
                .attr("d", path)
                .attr("stroke","black")
                .style("fill", function(d){return color(population.get(keys));})
                .attr("fill-opacity", 0.7)
                .attr("stroke-width", "1.5")
                .attr("stroke-linejoin","round")
                .attr("stroke-linecap","round")
                .attr("id", function(d){   
                    return keys;
                })
                .style("cursor", "pointer")  
                .on("click",zoom)
                .on("mouseover", hover)
                .on("mouseout", nohover);
        }

        g1.append("path")
            .data(topojson.feature(ri, ri.objects.ri).features)
            .attr("fill", "lightgray")
            .attr("d", path)
            .attr("stroke-width",0.5)
            .attr("stroke","white");

        for(keys in msaDic){
            g1.append("path")
                .datum(topojson.merge(ri, ri.objects.ri.geometries.filter(function(d) {
                    return msaDic[keys].includes(parseInt(d.id));})))
                .attr("d", path)
                .attr("stroke","black")
                .style("fill", function(d){return color(population.get(keys));})
                .attr("fill-opacity", 0.7)
                .attr("stroke-width", "1.5")
                .attr("stroke-linejoin","round")
                .attr("stroke-linecap","round")
                .attr("id", function(d){   
                    return keys;
                }) 
                .style("cursor", "pointer") 
                .on("click",zoom) 
                .on("mouseover", hover)
                .on("mouseout", nohover);
        }

        g1.append("path")
            .data(topojson.feature(ct, ct.objects.ct).features)
            .attr("fill", "lightgray")
            .attr("d", path)
            .attr("stroke-width",0.5)
            .attr("stroke","white");

        for(keys in msaDic){
            g1.append("path")
                .datum(topojson.merge(ct, ct.objects.ct.geometries.filter(function(d) {
                    return msaDic[keys].includes(parseInt(d.id));})))
                .attr("d", path)
                .attr("stroke","black")
                .style("fill", function(d){return color(population.get(keys));})
                .attr("fill-opacity", 0.7)
                .attr("stroke-width", "1.5")
                .attr("stroke-linejoin","round")
                .attr("stroke-linecap","round")
                .attr("id", function(d){   
                    return keys;
                })
                .style("cursor", "pointer")  
                .on("click",zoom)
                .on("mouseover", hover)
                .on("mouseout", nohover);
        }

        var centered;
      

        function zoom(d){
            var zoomSettings = {
                duration: 300,
                ease: d3.easeCubicOut,
                zoomLevel: 4
            }; 
            var x;
            var y;
            var zoomLevel;

            if(d && centered !== d){
                var centroid = path.centroid(d);
                x = centroid [0];
                y = centroid [1];

                zoomLevel=zoomSettings.zoomLevel;
                centered = d;
            }else{
                x = width/2;
                y = height / 2;
                zoomLevel = 1;
                centered = null;
            }

            g1.transition()
                .duration(zoomSettings.duration)
                .ease(zoomSettings.ease)
                .attr("transform", "translate(" + width/2 +","+ height/2 +")scale(" + zoomLevel + ")translate("+ -x +","+ -y +")");
        }
                  
                  
                  
        function hover()
        {
            d3.select(this).attr("stroke","red");
            d3.select("#info_MSA_population").html(countyandMSAname[d3.select(this).attr("id")][2]);
            d3.select("#info_MSA_name").html(countyandMSAname[d3.select(this).attr("id")][0]);
            d3.select("#info_MSA_state").html(countyandMSAname[d3.select(this).attr("id")][1]);
        } 

        function nohover()
        {
            d3.select(this).attr("stroke","black");
        }

                  
    }

    msa3();
}
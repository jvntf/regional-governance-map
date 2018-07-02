function msa3(){
    var margin = {top: 10, right: 10, bottom: 10, left: 10};
    var width = $("#us_state_div").width();
    var mapRatio = .5;
    var height = width*mapRatio;
    var w = 100;
    var h = 10;

    var svg2 = d3.select("#us_state_div").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var color = d3.scaleThreshold()
        .domain([55273,100000, 500000, 1000000,5000000,15000000])
        .range(["#FFF9CF","#FFF685", "#FFFD38", "#FED631", "#FDB92C","#ED9A2A"]);

    MsaName =d3.map();
    msaDic = {};
    population =d3.map();
    countyandMSAname = {};


    var g = svg2.append("g");


    d3.csv("County and Muni MSA.csv", function(csv) {
                  
        csv.forEach(function(row) {

            population.set(row.Code, row.MSAPOP);

            if(countyandMSAname[row.Code]==null)
            {
                countyandMSAname[row.Code]=new Array();
                countyandMSAname[row.Code].push((row.MSA));
                countyandMSAname[row.Code].push((row.Place));
                countyandMSAname[row.Code].push(parseInt(row.MSAPOP));

                                    
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

    // var selected = localStorage.getItem("selected");
    var selected = $('#stateview').val();
    if (selected) {
        $("#stateview").val(selected);
    }

    // $("#stateview").change(function() {
    //     localStorage.setItem("selected", $(this).val());
    //     location.reload();
    // });

    var vt1=50,ma1=25,nh1=33,ri1=44,ct1=9;              
    queue()
        .defer(d3.json, "us.topo.json")
        .defer(d3.json, "vt.topo.json")
        .defer(d3.json, "ma.topo.json")
        .defer(d3.json, "nh.topo.json")
        .defer(d3.json, "ri.topo.json")
        .defer(d3.json, "ct.topo.json")
        .await(USAMSA);  

                  

    function USAMSA(error, json, vt, ma, nh, ri, ct){
                   

                      
    /* =============================================== Start Texture and Projection Section ===========================================================*/


        var myData = topojson.feature(json, {
            type: "GeometryCollection",
            geometries: json.objects.collection.geometries.filter(function(d) { return parseInt(d.properties.state_fips) == selected;
            })});

        var projection = d3.geoAlbersUsa()
            .fitExtent([[20, 20], [width, height]], myData);

        var path = d3.geoPath()
            .projection(projection);
        /* =============================================== End Texture and Projection Section ============================================================= */


        /* ======================================================== Start New England Section ==============================================================*/

        // Vermont State
        // Vermont State
        if(selected == vt1){

            for(keys in msaDic){
                g.append("path")
                    .datum(topojson.merge(vt, vt.objects.vt.geometries.filter(function(d) {
                        if(vt1 == selected)
                        {
                            return msaDic[keys].includes(parseInt(d.id));
                        }
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
                    }); 
            }
            g.append("g")
                .attr("id", "state")
                .selectAll("path")
                .data(topojson.feature(vt, vt.objects.vt).features)
                .enter().append("path")
                .attr("d", path)
                .attr("id",function(d) { return d.id; })
                .attr("stroke","black")
                .attr("stroke-width", "0.5")
                .attr("fill-opacity", 0.000009)
                .attr("fill", "white")
                .style("cursor", "pointer")    
                .on("click",clicked) 
                .on("mouseover", hover)
                .on("mouseout", nohover);
        }
        // Massachusetts State
        else if(selected == ma1){     
         

            for(keys in msaDic){
                g.append("path")
                    .datum(topojson.merge(ma, ma.objects.ma.geometries.filter(function(d) {
                        if(ma1 == selected)
                        {
                            return msaDic[keys].includes(parseInt(d.id));
                        }
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
                    });
            }
            g.append("g")
                .attr("id", "state")
                .selectAll("path")
                .data(topojson.feature(ma, ma.objects.ma).features)
                .enter().append("path")
                .attr("d", path)
                .attr("id",function(d) { return d.id; })
                .attr("stroke","black")
                .attr("stroke-width", "0.5")
                .attr("fill-opacity", 0.000009)
                .attr("fill", "white")   
                .style("cursor", "pointer")
                .on("click",clicked) 
                .on("mouseover", hover)
                .on("mouseout", nohover);


        }
        // New Hampshire State
        else if(selected == nh1){
            for(keys in msaDic){
                g.append("path")
                    .datum(topojson.merge(nh, nh.objects.nh.geometries.filter(function(d) {
                        if(nh1 == selected)
                        {
                            return msaDic[keys].includes(parseInt(d.id));
                        }
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
                    });
            }
            g.append("g")
                .attr("id", "state")
                .selectAll("path")
                .data(topojson.feature(nh, nh.objects.nh).features)
                .enter().append("path")
                .attr("d", path)
                .attr("id",function(d) { return d.id; })
                .attr("stroke","black")
                .attr("stroke-width", "0.5")
                .attr("fill-opacity", 0.000009)
                .attr("fill", "white")   
                .style("cursor", "pointer")
                .on("click",clicked) 
                .on("mouseover", hover)
                .on("mouseout", nohover);
                                
        }
        // Rhode Island State
        else if(selected == ri1){
            for(keys in msaDic){
                g.append("path")
                    .datum(topojson.merge(ri, ri.objects.ri.geometries.filter(function(d) {
                        if(ri1 == selected)
                        {
                            return msaDic[keys].includes(parseInt(d.id));
                        }
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
                    });
            }
            g.append("g")
                .attr("id", "state")
                .selectAll("path")
                .data(topojson.feature(ri, ri.objects.ri).features)
                .enter().append("path")
                .attr("d", path)
                .attr("id",function(d) { return d.id; })
                .attr("stroke","black")
                .attr("stroke-width", "0.5")
                .attr("fill-opacity", 0.000009)
                .attr("fill", "white")   
                .style("cursor", "pointer")
                .on("click",clicked) 
                .on("mouseover", hover)
                .on("mouseout", nohover);  
        }
        // Connecticut State
        else if(selected == ct1){
            for(keys in msaDic){
                g.append("path")
                    .datum(topojson.merge(ct, ct.objects.ct.geometries.filter(function(d) {
                        if(ct1 == selected)
                        {
                            return msaDic[keys].includes(parseInt(d.id));
                        }
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
                    });
            }
            g.append("g")
                .attr("id", "state")
                .selectAll("path")
                .data(topojson.feature(ct, ct.objects.ct).features)
                .enter().append("path")
                .attr("d", path)
                .attr("id",function(d) { console.log(d.id); return d.id; })
                .attr("stroke","black")
                .attr("stroke-width", "0.5")
                .attr("fill-opacity", 0.000009)
                .attr("fill", "white")   
                .style("cursor", "pointer")
                .on("click",clicked) 
                .on("mouseover", hover)
                .on("mouseout", nohover);
                      
        }
        /* ======================================================== End New England Section ======================================================== */
        /* ======================================================  Final Layer =====================================================================*/
        else
        {
                




            for(keys in msaDic){
                g.append("path")
                    .datum(topojson.merge(json, json.objects.collection.geometries.filter(function(d) {
                        if(d.properties.state_fips == selected)
                        {
                            return msaDic[keys].includes(parseInt(d.properties.fips));
                        }
                    })))
                    .attr("d", path)
                    .attr("stroke","black")
                    .style("fill", function(d){return color(population.get(keys));})
                    .attr("fill-opacity", 0.7)
                    .attr("stroke-width", "2");
            }

            g.append("g")
                .attr("id", "state")
                .selectAll("path")
                .data(topojson.feature(json, json.objects.collection).features.filter(function(d) { return d.properties.state_fips == selected; }))
                .enter().append("path")
                .attr("d", path)
                .attr("id",function(d) { 
                    return d.properties.fips; })
                .attr("stroke","black")
                .attr("fill-opacity", 0.000009)
                .attr("stroke-width", "0.5")
                .attr("fill", "white")
                .on("click",clicked) 
                .on("mouseover", hover)
                .style("cursor", "pointer")
                .on("mouseout", nohover);


                       
        }
        /* ====================================================== Hover Section ====================================================== */
        function clicked() {
                          
            d3.select("#MSAName").html(countyandMSAname[d3.select(this).attr("id")][0]);
            d3.select("#CountyName").html(countyandMSAname[d3.select(this).attr("id")][1]);
                             
        }
    }

    function hover()
    {
        d3.select(this).attr("stroke","red");

    } 

    function nohover()
    {
        d3.select(this).attr("stroke","black");

    }
}
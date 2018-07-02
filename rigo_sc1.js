  var margin = {top: 10, right: 0, bottom: 10, left: 0};
                    var width = $("#national-map").width();
                    var mapRatio = .5;
                    var height = width * mapRatio;
                    var w = 100;
                    var h = 10;

                    var svg = d3.select("#national-map").append("svg")
                      .attr("width", width)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    
                    var g1 = svg.append('g');

                    var projection =  d3.geoAlbersUsa()
                      .scale(width)
                      .translate([width / 2, height / 2]);

                    states = d3.map();
                    rigosname =d3.map();
                    rigos = {};
                    population =d3.map();
                    overlapped = [];
                    rigo_information={};

                    function insertAfter(referenceNode, newNode) {
                        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
                    }

                    var color = d3.scaleThreshold()
                      .domain([10000,100000, 500000, 1000000,5000000,10000000])
                      .range(["#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#2b8cbe","#045a8d"]);
                    var color_c= ["#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#2b8cbe","#045a8d"]; 

                    var path = d3.geoPath()
                      .projection(projection);

    //var svg = d3.select("body").append("svg").attr("height",height).attr("width",width);

                    d3.csv("County and Muni RIGO Boundaries.csv", function(overrigo) {
                      overrigo.forEach(function(row) { 
                        if(row.RIGOCode!=0&&row.RIGO2!=0){
                          overlapped.push(parseInt(row.Code));
                        }
                      });
                    });

                    d3.csv("CrossBoundary Org Data Rigo.csv", function(csvpop) {

                    csvpop.forEach(function(row) {
                        population.set(row.Code, row.POPULATION);
                      });
                    });

    d3.csv("CrossBoundary Org Data Rigo.csv", function(csvinfo) {

      csvinfo.forEach(function(row) 
                {
                  
                    if(rigo_information[row.Code]==null)
                    {
                      rigo_information[row.Code]=new Array();
                      rigo_information[row.Code].push(row.State);
                      rigo_information[row.Code].push(row.RIGOName);
                      rigo_information[row.Code].push(parseInt(row.POPULATION));

                    }
                  });
    });




    d3.csv("County and Muni RIGO Boundaries.csv", function(csv) {

    csv.forEach(function(row) {
        states.set(row.Code, row.RIGO);
      });





      csv.forEach(function(row) 
                {
                    if(row.RIGOCodeNo <50)
                  // if(row.RIGOCodeNo != 99)
                  {
                    if(rigos[row.RIGOCode]==null)
                    {
                      rigos[row.RIGOCode]=new Array();
                      rigos[row.RIGOCode].push(parseInt(row.Code));
                    }
                    else
                    {
                      rigos[row.RIGOCode].push(parseInt(row.Code));
                    }

                    if(rigosname.get(row.Rigo)==undefined)
                    {
                      rigosname.set(row.RIGOCode,row.RIGO);
                    }
                  }
                  });
      });






                  d3.queue()
                      .defer(d3.json, 'us.topo.json')
                      .defer(d3.json, 'vt.topo.json')
                      .defer(d3.json, 'ma.topo.json')
                      .defer(d3.json, 'nh.topo.json')
                      .defer(d3.json, 'ri.topo.json')
                      .defer(d3.json, 'ct.topo.json')
                      .await(USARigo);  

                  

      function USARigo(error, json1, vt, ma, nh, ri, ct){

         const texture =
      textures.lines()
      .size(3)
      .strokeWidth(1);

        const texture1 =
      textures.lines()
      .size(4)
        .stroke("gray")
      .strokeWidth(1);
    svg.call(texture);


    function clicked()
    {
    d3.select(this).attr("stroke","red");
     d3.select("#info_rigo_state").html(rigo_information[d3.select(this).attr('id')][0]);
      d3.select("#info_rigo_name").html(rigo_information[d3.select(this).attr('id')][1]);
        d3.select("#info_rigo_population").html(rigo_information[d3.select(this).attr('id')][2]);
    } 

    function hover()
    {
    d3.select(this).attr("stroke","red");
    } 

    function nohover()
    {
    d3.select(this).attr("stroke","black");
    }


        g1.append("path")
          .datum(topojson.merge(json1, json1.objects.collection.geometries.filter(function(d) { 
              var temp=parseInt(d.properties.fips);
            if(overlapped.includes(temp))
            {
              return true; 
            }
            else
            {
              return false;
            }

          })))
          .attr("d", path)
          .attr("fill", texture.url())
          .attr("stroke-linejoin","round")
          .attr("stroke-linecap","round");

    g1.append("path")
          .datum(topojson.feature(json1, json1.objects.collection))
          .attr("fill", "none")
          .attr("d", path)
          .attr("stroke-width",0.3)
          .attr("stroke","gray");

    g1.append("path")
          .datum(topojson.merge(json1, json1.objects.collection.geometries.filter(function(d) { 
              var temp=parseInt(d.properties.fips);
            if(overlapped.includes(temp))
            {
              return true; 
            }
            else
            {
              return false;
            }

          })))
          .attr("d", path)
          .attr("fill", texture.url())
          .attr("stroke-linejoin","round")
          .attr("stroke-linecap","round");

    //texture.url()
    for(keys in rigos){

       g1.append("path")
          .datum(topojson.merge(json1, json1.objects.collection.geometries.filter(function(d) {
            return rigos[keys].includes(parseInt(d.properties.fips));
          })))
          .attr("d", path)
          .attr("stroke","black")
          .style("fill", function(d){ return color(population.get(keys))})
          .attr("fill-opacity", 0.7)
          .attr("stroke-width", "0.7")
          .attr("stroke-linejoin","round")
          .attr("stroke-linecap","round")
          .attr("id", function(d){   
                    return keys;
                })
                .style("cursor", "pointer")
          .on('click', zoom)
          .on('mouseover',clicked)
          .on('mouseout', nohover);
    }


    for(keys in rigos){
                       g1.append("path")
                          .datum(topojson.merge(vt, vt.objects.vt.geometries.filter(function(d) {
                            return rigos[keys].includes(parseInt(d.id));})))
                          .attr("d", path)
                          .attr("stroke","black")
                          .style("fill", function(d){return color(population.get(keys))})
                          .attr("fill-opacity", 0.7)
                          .attr("stroke-width", "1.5")
                          .attr("stroke-linejoin","round")
                          .attr("stroke-linecap","round")
                          .attr("id", function(d){   
                                    return keys;
                                })
                                .style("cursor", "pointer")
                          .on('click', zoom)
          .on('mouseover',clicked)
          .on('mouseout', nohover);;
                    }

                    g1.append("path")
                          .data(topojson.feature(ma, ma.objects.ma).features)
                          .attr("fill", "lightgray")
                          .attr("d", path)
                          .attr("stroke-width",0.5)
                          .attr("stroke","white");



                    for(keys in rigos){
                       g1.append("path")
                          .datum(topojson.merge(ma, ma.objects.ma.geometries.filter(function(d) {
                            return rigos[keys].includes(parseInt(d.id));})))
                          .attr("d", path)
                          .attr("stroke","black")
                          .style("fill", function(d){return color(population.get(keys))})
                          .attr("fill-opacity", 0.7)
                          .attr("stroke-width", "1.5")
                          .attr("stroke-linejoin","round")
                          .attr("stroke-linecap","round")
                          .attr("id", function(d){   
                                    return keys;
                                }) 
                                .style("cursor", "pointer")
                          .on('click', zoom)
          .on('mouseover',clicked)
          .on('mouseout', nohover);;
                    }

                    g1.append("path")
                          .data(topojson.feature(nh, nh.objects.nh).features)
                          .attr("fill", "lightgray")
                          .attr("d", path)
                          .attr("stroke-width",0.5)
                          .attr("stroke","white");

                    for(keys in rigos){
                       g1.append("path")
                          .datum(topojson.merge(nh, nh.objects.nh.geometries.filter(function(d) {
                            return rigos[keys].includes(parseInt(d.id));})))
                          .attr("d", path)
                          .attr("stroke","black")
                          .style("fill", function(d){return color(population.get(keys))})
                          .attr("fill-opacity", 0.7)
                          .attr("stroke-width", "1.5")
                          .attr("stroke-linejoin","round")
                          .attr("stroke-linecap","round")
                          .attr("id", function(d){   
                                    return keys;
                                })  
                                .style("cursor", "pointer")
                          .on('click', zoom)
          .on('mouseover',clicked)
          .on('mouseout', nohover);;
                    }

                    g1.append("path")
                          .data(topojson.feature(ri, ri.objects.ri).features)
                          .attr("fill", "lightgray")
                          .attr("d", path)
                          .attr("stroke-width",0.5)
                          .attr("stroke","white");

                    for(keys in rigos){
                       g1.append("path")
                          .datum(topojson.merge(ri, ri.objects.ri.geometries.filter(function(d) {
                            return rigos[keys].includes(parseInt(d.id));})))
                          .attr("d", path)
                          .attr("stroke","black")
                          .style("fill", function(d){return color(population.get(keys))})
                          .attr("fill-opacity", 0.7)
                          .attr("stroke-width", "1.5")
                          .attr("stroke-linejoin","round")
                          .attr("stroke-linecap","round")
                          .attr("id", function(d){   
                                    return keys;
                                })  
                                .style("cursor", "pointer")
                          .on('click', zoom)
          .on('mouseover',clicked)
          .on('mouseout', nohover);;
                    }

                    g1.append("path")
                          .data(topojson.feature(ct, ct.objects.ct).features)
                          .attr("fill", "lightgray")
                          .attr("d", path)
                          .attr("stroke-width",0.5)
                          .attr("stroke","white");

                    for(keys in rigos){
                       g1.append("path")
                          .datum(topojson.merge(ct, ct.objects.ct.geometries.filter(function(d) {
                            return rigos[keys].includes(parseInt(d.id));})))
                          .attr("d", path)
                          .attr("stroke","black")
                          .style("fill", function(d){return color(population.get(keys))})
                          .attr("fill-opacity", 0.7)
                          .attr("stroke-width", "1.5")
                          .attr("stroke-linejoin","round")
                          .attr("stroke-linecap","round")
                          .attr("id", function(d){   
                                    return keys;
                                }) .on('click', zoom)
                                .style("cursor", "pointer")
          .on('mouseover',clicked)
          .on('mouseout', nohover);
                    }

                    d3.json("drawStateBorders.json", function(drawStateBorders){
      g1.append("path")
          .datum(topojson.feature(drawStateBorders, drawStateBorders.objects.us))
          .attr("fill", "none")
          .attr("stroke-width","1.7")
          .attr("d", path)
          .attr("stroke","black");
        });
                       

    var div1=document.getElementById("national_map");
    var div2=document.getElementById("us_state_div");
    insertAfter(div1, div2);

    var centered;


                          function zoom(d){
                            console.log(d);
                            var x;
                            var y;
                            var zoomLevel;

                            if(d && centered !== d){
                              var centroid = path.centroid(d);
                              x = centroid [0];
                              y = centroid [1];

                var zoomSettings = {
                            duration: 300,
                            ease: d3.easeCubicOut,
                            zoomLevel: 4
                          }; 
              
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
              
              
              
              };
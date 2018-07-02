                var margin = {top: 10, right: 10, bottom: 10, left: 10};
                var width = $("#us_state_div").width();
                var mapRatio = .2;
                // var height = width*mapRatio;
                var height = $("#us_state_div").height();
                var w = 100;
                var h = 10;

                // var svg = d3.select("#us_state_div").append("svg")
                //   .attr("width", width + margin.left + margin.right)
                //   .attr("height", height + margin.top + margin.bottom)
                //   .append("g")
                //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                var color = d3.scaleThreshold()
                                .domain([10000,100000, 500000, 1000000,5000000,10000000])
                                      .range(["#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d"]);


                  rigosname = d3.map();
                  rigos = {};
                  population = d3.map();
                  overlapped = [];
                  countyRIGOAffiliationName = {};

            var svg = d3.select("#us_state_div").append("svg")
              .attr("width", width)
              .attr("height", height);

            var g = svg.append('g');

            d3.csv("County and Muni RIGO Boundaries.csv", function(overrigo) {
                          
              overrigo.forEach(function(row) { 
              if(row.RIGOCode!=0&&row.RIGO2!=0)
              {
                  overlapped.push(parseInt(row.Code));
              }

              var code=parseInt(row.Code);
              code=""+code;


                  
                  if(countyRIGOAffiliationName[code]==null)
                {
                  countyRIGOAffiliationName[code]=new Array();
                  countyRIGOAffiliationName[code].push((row.RIGOCode));
                  countyRIGOAffiliationName[code].push((row.RIGO2));
                  countyRIGOAffiliationName[code].push((row.Place));
                  countyRIGOAffiliationName[code].push((row.RIGO));
                  countyRIGOAffiliationName[code].push((row.Code));
                  countyRIGOAffiliationName[code].push((row.RIGOCodeSt));

                }

                
              });
            });


            d3.csv("CrossBoundary Org Data Rigo.csv", function(csvpop) {
              csvpop.forEach(function(row) {

                  population.set(row.Code, row.POPULATION);
                  
                });
            });

            d3.csv("County and Muni RIGO Boundaries.csv", function(csv) {
              csv.forEach(function(row) {
                if(row.RIGOCodeNo <50){
                  if(rigos[row.RIGOCode]==null){
                    rigos[row.RIGOCode]=new Array();
                    rigos[row.RIGOCode].push(parseInt(row.Code));
                  }
                  else{
                    rigos[row.RIGOCode].push(parseInt(row.Code));
                  }

                  if(rigosname.get(row.Rigo)==undefined){
                    rigosname.set(row.RIGOCode,row.RIGO);
                  }
                }
              });
            });
          /* ========================================================== End the Stoing Data Section =========================================================*/

          /* ========================================================== Start the jquery Section ============================================================*/
                        
            var selected = localStorage.getItem('selected');
            if (selected) {
              $("#stateview").val(selected);
            }

            $("#stateview").change(function() {
              localStorage.setItem('selected', $(this).val());
              location.reload();
            });
          /* ========================================================== End the jquery Section ==============================================================*/

                    var vt1=50,ma1=25,nh1=33,ri1=44,ct1=9;              
                    queue()
                        .defer(d3.json, 'us.topo.json')
                        .defer(d3.json, 'vt.topo.json')
                        .defer(d3.json, 'ma.topo.json')
                        .defer(d3.json, 'nh.topo.json')
                        .defer(d3.json, 'ri.topo.json')
                        .defer(d3.json, 'ct.topo.json')
                        .await(USARigo);  

                        /* =============================================== Start Texture and Projection Section ===========================================================*/
                        function USARigo(error, json, vt, ma, nh, ri, ct){
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

                          var myData = topojson.feature(json, {
                            type: "GeometryCollection",
                            geometries: json.objects.collection.geometries.filter(function(d) { return parseInt(d.properties.state_fips) == selected;
                            })});

                          var projection = d3.geoAlbersUsa()
                            .fitExtent([[20, 20], [width, height]], myData);

                          var path = d3.geoPath()
                            .projection(projection);
          /* =============================================== End Texture and Projection Section ============================================================= */

          /* =============================================== Start Merge and Texture Section ================================================================ */

                        
                        g.append("path")
                           .datum(topojson.merge(json, json.objects.collection.geometries.filter(function(d) { 
                                  var temp=parseInt(d.properties.fips);
                                if(d.properties.state_fips == selected || vt1 == selected || ma1 == selected || nh1 == selected || ri1 == selected || ct1 == selected )
                                  {
                                        if(overlapped.includes(temp))
                                        {
                                          return true; 
                                        }
                                        else
                                        {
                                          return false;
                                        }
                                  }
                                })))
                           .attr("d", path)
                           .attr("fill", texture.url());
          /* =============================================== End Merge and Texture Section ================================================================== */

          /* ======================================================== Start New England Section ==============================================================*/

          // Vermont State
                if(selected == vt1){
                          for(keys in rigos){
                             g.append("path")
                                .datum(topojson.merge(vt, vt.objects.vt.geometries.filter(function(d) {
                              if(vt1 == selected)
                              {
                              return rigos[keys].includes(parseInt(d.id));
                            }
                            })))
                                .attr("d", path)
                                .attr("stroke","black")
                                .style("fill", function(d){ return color(population.get(keys))})
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
                             .on("click", clicked)
                             .on('mouseover',hover)
                             .on('mouseout', nohover)
                                                         .style("cursor", "pointer")
          ;
                          }
                                          // Massachusetts State
               else if(selected == ma1){

                console.log(rigos[keys]);

                for(keys in rigos){
                   g.append("path")
                      .datum(topojson.merge(ma, ma.objects.ma.geometries.filter(function(d) {
                    if(ma1 == selected)
                    {
                    return rigos[keys].includes(parseInt(d.id));
                  }
                  })))
                      .attr("d", path)
                      .attr("stroke","black")
                      .style("fill", function(d){return color(population.get(keys))})
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
                  .on("click", clicked)
                  .on('mouseover',hover)
                  .on('mouseout', nohover)
                  .style("cursor", "pointer");
              }
                                  // New Hampshire State
                else if(selected == nh1){
                  for(keys in rigos){
                     g.append("path")
                        .datum(topojson.merge(nh, nh.objects.nh.geometries.filter(function(d) {
                      if(nh1 == selected)
                      {
                      return rigos[keys].includes(parseInt(d.id));
                    }
                    })))
                        .attr("d", path)
                        .attr("stroke","black")
                        .style("fill", function(d){return color(population.get(keys))})
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
                      .on("click", clicked)
                      .on('mouseover',hover)
                      .on('mouseout', nohover)
                      .style("cursor", "pointer");
                              
                }
                                                  // Rhode Island State
                else if(selected == ri1){
                  for(keys in rigos){
                     g.append("path")
                        .datum(topojson.merge(ri, ri.objects.ri.geometries.filter(function(d) {
                      if(ri1 == selected)
                      {
                      return rigos[keys].includes(parseInt(d.id));
                    }
                    })))
                        .attr("d", path)
                        .attr("stroke","black")
                        .style("fill", function(d){return color(population.get(keys))})
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
                    .on("click", clicked)
                    .on('mouseover',hover)
                    .on('mouseout', nohover)
                    .style("cursor", "pointer");   
                  }
                                                  // Connecticut State
              else if(selected == ct1){
                for(keys in rigos){
                   g.append("path")
                      .datum(topojson.merge(ct, ct.objects.ct.geometries.filter(function(d) {
                    if(ct1 == selected)
                    {
                    return rigos[keys].includes(parseInt(d.id));
                  }
                  })))
                      .attr("d", path)
                      .attr("stroke","black")
                      .style("fill", function(d){return color(population.get(keys))})
                      .attr("fill-opacity", 0.7)
                      .attr("stroke-width", "1.5")
                      .attr("stroke-linejoin","round")
                      .attr("stroke-linecap","round")
                      .attr("id", function(d){   
                                return keys;
                            });
                }

                  g.append("g")
                     .selectAll("path")
                     .data(topojson.feature(ct, ct.objects.ct).features)
                     .enter().append("path")
                     .attr("d", path)
                     .attr("id",function(d) {  return d.id; })
                     .attr("stroke","black")
                     .attr("stroke-width", "0.5")
                     .attr("fill-opacity", 0.000009)
                     .attr("fill", "white")
                     .on("click", clicked)
                     .on('mouseover',hover)
                     .on('mouseout', nohover)
                     .style("cursor", "pointer");    
                }
/* ======================================================== End New England Section ======================================================== */
/* ======================================================  Final Layer =====================================================================*/
          else{
            var beyond=[];
                g.append("g")
                   .selectAll("path")
                   .data(topojson.feature(json, json.objects.collection).features.filter(function(d) { return d.properties.state_fips == selected; }))
                   .enter()
                   .append("path")
                   .attr("d", path)
                   .attr("id",function(d) { 
                    beyond.push(parseInt(d.properties.fips));
                    return d.properties.fips; })
                   .attr("stroke","black")
                   .attr("stroke-width", "0.3")
                   .style("fill", function(d){
                    var id=parseInt(d.properties.fips);
                    id=""+id;
                    return color(population.get(countyRIGOAffiliationName[id][0]));
                  })
                    .attr("fill-opacity", 0.7)

                   .on("click", clicked)
                   .on('mouseover',hover)
                   .on('mouseout', nohover)
                   .style("cursor", "pointer"); 

                   for(keys in rigos){
                  g.append("path")
                  .datum(topojson.merge(json, json.objects.collection.geometries.filter(function(d) {
                    if(d.properties.state_fips == selected)
                    {
                    return rigos[keys].includes(parseInt(d.properties.fips));
                  }
                  })))
                  .attr("d", path)
                  .attr("stroke","black")
                  .style("fill", "none")
                  .attr("fill-opacity", 0.7)
                  .attr("stroke-width", "2");

            }              

                   //console.log(beyond);
                   var myRigo=[];
                   
                  for (i = 0; i < beyond.length; i++) {

                  if(!myRigo.includes(countyRIGOAffiliationName[beyond[i]][0])) 
                  {
                    myRigo.push(countyRIGOAffiliationName[beyond[i]][0]);
                    if(countyRIGOAffiliationName[beyond[i]][1]!=0){ 
                    myRigo.push(countyRIGOAffiliationName[beyond[i]][1]);
                  }
                  }
                  }

                 // console.log(countyRIGOAffiliationName);

                  var redraw=[];
                  for (key in countyRIGOAffiliationName) {
                    if(myRigo.includes(countyRIGOAffiliationName[key][0])||myRigo.includes(countyRIGOAffiliationName[key][1]))
                    {
                      if(!beyond.includes(countyRIGOAffiliationName[key][4]))
                      {
                        redraw.push(countyRIGOAffiliationName[key][4]);
                       }
                      }   
                    }





            g.append("g")
                   .selectAll("path")
                   .data(topojson.feature(json, json.objects.collection).features.filter(function(d) { return redraw.includes(parseInt(d.properties.fips)); }))
                   .enter()
                   .append("path")
                   .attr("d", path)
                   .style("fill", function(d){
                    var id=parseInt(d.properties.fips);
                    id=""+id;
                    return color(population.get(countyRIGOAffiliationName[id][1]));
                  })
                   .attr("id",function(d) {
                      return d.properties.fips; })
                   .attr("stroke","black")
                   .attr("fill-opacity", 0.7)
                   .attr("stroke-width", "0.5")
                   .on("click", clicked)
                   .on('mouseover',hover)
                   .on('mouseout', nohover)
                   .style("cursor", "pointer");

                   g.append("g")
                   .selectAll("path")
                   .data(topojson.feature(json, json.objects.collection).features.filter(function(d) { return redraw.includes(parseInt(d.properties.fips)); }))
                   .enter()
                   .append("path")
                   .attr("d", path)
                   .style("fill", function(d){
                        var id=parseInt(d.properties.fips);
                    id=""+id;
                    return color(population.get(countyRIGOAffiliationName[id][0]));
                  })
                   .attr("id",function(d) {
                      return d.properties.fips; })
                   .attr("stroke","black")
                   .attr("fill-opacity", 0.7)
                   .attr("stroke-width", "0.5")
                   .on("click", clicked)
                   .on('mouseover',hover)
                   .on('mouseout', nohover)
                   .style("cursor", "pointer");               
              }               
/* ====================================================== Hover Section ====================================================== */

                      var states_names={
                          "AL": "Alabama",
                          "AK": "Alaska",
                          "AS": "American Samoa",
                          "AZ": "Arizona",
                          "AR": "Arkansas",
                          "CA": "California",
                          "CO": "Colorado",
                          "CT": "Connecticut",
                          "DE": "Delaware",
                          "DC": "District Of Columbia",
                          "FM": "Federated States Of Micronesia",
                          "FL": "Florida",
                          "GA": "Georgia",
                          "GU": "Guam",
                          "HI": "Hawaii",
                          "ID": "Idaho",
                          "IL": "Illinois",
                          "IN": "Indiana",
                          "IA": "Iowa",
                          "KS": "Kansas",
                          "KY": "Kentucky",
                          "LA": "Louisiana",
                          "ME": "Maine",
                          "MH": "Marshall Islands",
                          "MD": "Maryland",
                          "MA": "Massachusetts",
                          "MI": "Michigan",
                          "MN": "Minnesota",
                          "MS": "Mississippi",
                          "MO": "Missouri",
                          "MT": "Montana",
                          "NE": "Nebraska",
                          "NV": "Nevada",
                          "NH": "New Hampshire",
                          "NJ": "New Jersey",
                          "NM": "New Mexico",
                          "NY": "New York",
                          "NC": "North Carolina",
                          "ND": "North Dakota",
                          "MP": "Northern Mariana Islands",
                          "OH": "Ohio",
                          "OK": "Oklahoma",
                          "OR": "Oregon",
                          "PW": "Palau",
                          "PA": "Pennsylvania",
                          "PR": "Puerto Rico",
                          "RI": "Rhode Island",
                          "SC": "South Carolina",
                          "SD": "South Dakota",
                          "TN": "Tennessee",
                          "TX": "Texas",
                          "UT": "Utah",
                          "VT": "Vermont",
                          "VI": "Virgin Islands",
                          "VA": "Virginia",
                          "WA": "Washington",
                          "WV": "West Virginia",
                          "WI": "Wisconsin",
                          "WY": "Wyoming"
                      };

                    console.log(countyRIGOAffiliationName);
                    function clicked() {

                      var id = parseInt(d3.select(this).attr('id'));
                      id = ""+id;
                      console.log(countyRIGOAffiliationName);
                      console.log(id);
                          d3.select("#StateName").html(states_names[countyRIGOAffiliationName[id][5]]);
                          d3.select("#CountyName").html(countyRIGOAffiliationName[id][2]);
                          d3.select("#RIGOAffiliation1").html(rigosname.get(countyRIGOAffiliationName[id][0]));
                          if(countyRIGOAffiliationName[id][1] != "0")
                          {
                             d3.select("#RIGOAffiliation2").html(rigosname.get(countyRIGOAffiliationName[id][1]));
                          }
                          else
                          {
                            d3.select("#RIGOAffiliation2").html("NA");
                          }
                   }

                  function hover() {
                    d3.select(this).attr("stroke","red");
                  } 

                  function nohover(){
                    d3.select(this).attr("stroke","black");
                  }


                  };
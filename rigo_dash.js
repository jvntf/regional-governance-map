window.onload=dashboardUpdate();

function dashboardUpdate() {
            
       
    // ***** DONUT CHART SECTION *****
            
    // Create variable to hold category counts
    var singleRIGO = 0;
    var singleMSA = 0;
    var singleRIGOandMSA = 0;
    var multipleRIGO = 0;
    var multipleRIGOandMSA = 0;
    var noAffiliation = 0;
    var totalCounties = 0;
            
            
    // Access tsv file with RIGO/MSA data
    d3.tsv("County_Muni_RIGO_Boundaries.tsv", function(data) {

        // Iterate through rows determining which counts to increase
                
        data.forEach(function(d) {
            // Increase County Tally
            totalCounties++;
            // One RIGO and MSA Affiliation
            // if (d.RIGOCodeNo != 99 && d.RIGO2 == 0 && d.Muni == 1) {
            if (d.RIGOCodeNo <50 && d.RIGO2 == 0 && d.Muni == 1) {
                singleRIGOandMSA++;
                // Multiple RIGO and MSA Affiliation    
            } else if (d.RIGOCodeNo <50 && d.RIGO2 != 0 && d.Muni == 1) {
                multipleRIGOandMSA++;   
                // Single RIGO Affiliation    
            } else if (d.RIGOCodeNo <50 && d.RIGO2 == 0 && d.Muni == 0) {
                singleRIGO++;
                // Multiple RIGO Affiliation    
            } else if (d.RIGOCodeNo <50 && d.RIGO2 != 0 && d.Muni == 0) {
                multipleRIGO++;  
                // Single MSA Affiliation    
            } else if (d.RIGOCodeNo == 99 && d.RIGO2 == 0 && d.Muni == 1) {
                singleMSA++;
                // No Affiliation
            } else if (d.RIGOCodeNo == 99 && d.RIGO2 == 0 && d.Muni == 0) {
                noAffiliation++;
            }  
        });
                
        var countsJSON = [
            { countName: "Single RIGO", count: singleRIGO },
            { countName: "Single MSA", count: singleMSA },
            { countName: "Both RIGO & MSA", count: singleRIGOandMSA },
            { countName: "Multiple RIGOs", count: multipleRIGO },
            { countName: "Multiple RIGOs & MSA", count: multipleRIGOandMSA },
            { countName: "No Affilation", count: noAffiliation }
        ];
            
        var donutWidth = $("#affiliation").height()/1.4;
        var donutHeight = $("#affiliation").height()/1.4;
        var donutRadius = Math.min(donutWidth, donutHeight) / 2;
        var donutHole = 25;

        var color = d3.scaleOrdinal()
            .range(["#B0C7EB","#F1D629","#9EE082","#2F76B9","#3CA110","#F3B5D3"]);

        var svg = d3.select("#donutChart")
            .append("svg")
            .attr("width", donutWidth*2)
            .attr("height", donutHeight*2)
            .append("g")
            .attr("transform", "translate(" + (donutHeight / 1) +  "," + (donutHeight / 2) + ")");
            
        var arc = d3.arc()
            .innerRadius(donutRadius - donutHole)
            .outerRadius(donutRadius); 
            
        var pie = d3.pie()
            .padAngle(.01)
            .value(function(d) { 
                return d.count; 
            })
            .sort(null);
                
        var tooltip = d3.select("#donutChart")  
            .append("div")
            .attr("class", "tooltip");                                   

        tooltip.append("div")                                          
            .attr("class", "label");                                     

        tooltip.append("div")                                          
            .attr("class", "count");                                     

        tooltip.append("div")                                          
            .attr("class", "percent");                                      

        countsJSON.forEach(function(d) {
            d.enabled = true;
        });
                
        var path = svg.selectAll("path")
            .data(pie(countsJSON))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", function(d, i) {
                return color(d.data.countName);
            })
            .each(function(d) {
                this._current = d;
            }); 
                
                
        path.on("mouseover", function(d) { 
            d3.select(this).style("opacity", .5);
            var total = d3.sum(countsJSON.map(function(d) {               
                return (d.enabled) ? d.count : 0;                                           
            })); 
                
            var percent = Math.round(1000 * d.data.count / total) / 10; 
                
            tooltip.select(".label").html(d.data.countName);               
            tooltip.select(".count").html(function() {
                if (d.data.count > 1){
                    return d.data.count + " Counties";
                } else {
                    return d.data.count + " County";
                }
            });                          
            tooltip
                .style("display", "block");                         
        });                                                          
                            
        path.on("mouseout", function() { 
            d3.select(this).style("opacity", 1);  
            tooltip.style("display", "none");                           
        });                                                           
    
                
        var legendRectSize = 10;
        var legendSpacing = 4;
            
        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset =  height * color.domain().length / 2;
                var horz = -3 * legendRectSize;
                var vert = i * height - offset;
                return "translate(" + horz + "," + vert + ")";
            });    
                
        legend.append("rect")
            .attr("width", legendRectSize)
            .attr("height", legendRectSize)
            .style("fill", color)
            .style("stroke", color)
            .on("click", function(countName) {
                var rect = d3.select(this);
                var enabled = true;
                var totalEnabled = d3.sum(countsJSON.map(function(d) {
                    return (d.enabled) ? 1 : 0;
                }));

                if (rect.attr("class") === "disabled") {
                    rect.attr("class", "");
                } else {
                    if (totalEnabled < 2) return;
                    rect.attr("class", "disabled");
                    enabled = false;
                }

                pie.value(function(d) {
                    if (d.countName === countName) d.enabled = enabled;
                    return (d.enabled) ? d.count : 0;
                });

                path = path.data(pie(countsJSON));

                path.transition()
                    .duration(750)
                    .attrTween("d", function(d) {
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {
                            return arc(interpolate(t));
                        };
                    });       
            });
                
            
        legend.append("text")
            .attr("x", legendRectSize + legendSpacing)
            .attr("y", legendRectSize - legendSpacing)
            .text(function(d) { return d; });
    });  // End of Donut Chart
            
            
    // ***** STATS SECTION *****
    var totalRIGO;
    var totalMSA;
            
    d3.tsv("counties.tsv", function (data) {
        // Count Unique RIGOs
        var distinctRIGO = d3.map(data, function(d) {
            return d.rgo_code;   
        });
        totalRIGO = Object.keys(distinctRIGO).length;  
                
        // Count Unique MSAs
        var distinctMSA = d3.map(data, function(d) {
            return d.msa_code;
        });     
        totalMSA = Object.keys(distinctMSA).length; 
                
                
        //jQerry Counter animation script from
        // https://codepen.io/hi-im-si/pen/uhxFn
        //Hard coded value because .tsv formatting 
        //results in an incorrect value
        $("#rigoCounter").attr("data-count", 477);  
        $("#msaCounter").attr("data-count", 338);    
              
        $(".counter").each(function() {
            var $this = $(this),
                countTo = $this.attr("data-count");

            $({ countNum: $this.text()}).animate({
                countNum: countTo
            },

            {

                duration: 1000,
                easing:"linear",
                step: function() {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function() {
                    $this.text(this.countNum);
                    //alert('finished');
                }

            });  



        });

       
                    
    }); // End of Animated Stats
            
    // INSTRUCTION ACCORDION //
    // Source: https://codepen.io/vikasverma93/pen/raxGaM //
            
    $(document).ready(function(){
        $(".set > a").on("click", function(){
            if($(this).hasClass("active")){
                $(this).removeClass("active");
                $(this).siblings(".content").slideUp(200);
                $(".set > a i").removeClass("fa-minus").addClass("fa-plus");
            }else{
                $(".set > a i").removeClass("fa-minus").addClass("fa-plus");
                $(this).find("i").removeClass("fa-plus").addClass("fa-minus");
                $(".set > a").removeClass("active");
                $(this).addClass("active");
                $(".content").slideUp(200);
                $(this).siblings(".content").slideDown(200);
            }

        });
        
    });

            
            
} // End dashboardUpdate
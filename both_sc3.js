var margin = { top: 10, right: 10, bottom: 10, left: 10 };
var width = $("#us_state_div").width();
var mapRatio = .5;
var height = width * mapRatio;
var w = 100;
var h = 10;

var svg2 = d3.select("#us_state_div").append("svg")
    .attr("width", width)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var color = d3.scaleThreshold()
    .domain([10000, 100000, 500000, 1000000, 5000000, 10000000])
    .range(["#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d"]);
var colorMSA = d3.scaleThreshold()
    .domain([10000, 100000, 500000, 1000000, 5000000, 10000000])
    .range(["#FFF9CF", "#FFF685", "#FFFD38", "#FED631", "#FDB92C", "#ED9A2A"]);

var projection = d3.geoAlbersUsa()
    .scale(width)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);


var g = svg2.append('g');



MsaName = d3.map();
msaDic = {};
population = d3.map();

//------Rigo-----//
states = d3.map();
rigosname = d3.map();
rigos = {};
population = d3.map();
overlapped = [];
rigo_information = {};
countyRIGOAffiliationName = {};

d3.csv("County and Muni RIGO Boundaries.csv", function(overrigo) {
    overrigo.forEach(function(row) {
        if (row.RIGOCode != 0 && row.RIGO2 != 0) {
            overlapped.push(parseInt(row.Code));
        }
    });
});

d3.csv("CrossBoundary Org Data Rigo.csv", function(csvinfo) {

    csvinfo.forEach(function(row) {

        if (rigo_information[row.Code] == null) {
            rigo_information[row.Code] = new Array();
            rigo_information[row.Code].push(row.State);
            rigo_information[row.Code].push(row.RIGOName);
            rigo_information[row.Code].push(parseInt(row.POPULATION));

        }
    });
});


d3.csv("CrossBoundary Org Data RIGO.csv", function(csvpop) {

    csvpop.forEach(function(row) {
        population.set(row.Code, row.POPULATION);
    });
});



d3.csv("County and Muni RIGO Boundaries.csv", function(csv) {

    csv.forEach(function(row) {
        states.set(row.Code, row.RIGO);



        if (countyRIGOAffiliationName[row.Code] == null) {
            countyRIGOAffiliationName[row.Code] = new Array();
            countyRIGOAffiliationName[row.Code].push((row.RIGOCode));
            countyRIGOAffiliationName[row.Code].push((row.RIGO2));
            countyRIGOAffiliationName[row.Code].push((row.Place));
            countyRIGOAffiliationName[row.Code].push((row.RIGO));
            countyRIGOAffiliationName[row.Code].push(parseInt(row.Code));
            countyRIGOAffiliationName[row.Code].push((row.RIGOCodeSt));

        }
    });

    csv.forEach(function(row) {
        if (row.RIGOCodeNo < 50) {
            if (rigos[row.RIGOCode] == null) {
                rigos[row.RIGOCode] = new Array();
                rigos[row.RIGOCode].push(parseInt(row.Code));
            } else {
                rigos[row.RIGOCode].push(parseInt(row.Code));
            }

            if (rigosname.get(row.Rigo) == undefined) {
                rigosname.set(row.RIGOCode, row.RIGO);
            }
        }
    });
});









d3.csv("County and Muni MSA.csv", function(csv) {

    csv.forEach(function(row) {

        population.set(row.MSA, row.MSAPOP);

    });

    csv.forEach(function(row) {
        if (row.MSA != "Not Applicable") {
            if (msaDic[row.MSA] == null) {
                msaDic[row.MSA] = new Array();
                msaDic[row.MSA].push(parseInt(row.Code));
            } else {
                msaDic[row.MSA].push(parseInt(row.Code));
            }

            if (MsaName.get(row.MSA) == undefined) {

                MsaName.set(row.MSA, row.MSA);
            }
        }
    });
});

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

queue()
    .defer(d3.json, 'us.topo.json')
    .defer(d3.json, 'vt.topo.json')
    .defer(d3.json, 'ma.topo.json')
    .defer(d3.json, 'nh.topo.json')
    .defer(d3.json, 'ri.topo.json')
    .defer(d3.json, 'ct.topo.json')
    .await(USAboth);

var vt1 = 50,
    ma1 = 25,
    nh1 = 33,
    ri1 = 44,
    ct1 = 09;

function USAboth(error, us, vt, ma, nh, ri, ct) {

    /* =============================================== Start Texture and Projection Section ===========================================================*/
    const texture =
        textures.lines()
        .size(3)
        .strokeWidth(1);
    const texture1 =
        textures.lines()
        .size(4)
        .stroke("gray")
        .strokeWidth(1);
    console.log(texture1);

    g.call(texture1);

    var myData = topojson.feature(us, {
        type: "GeometryCollection",
        geometries: us.objects.collection.geometries.filter(function(d) {
            return parseInt(d.properties.state_fips) == selected;
        })
    });

    var projection = d3.geoAlbersUsa()
        .fitExtent([
            [20, 20],
            [width, height]
        ], myData);

    var path = d3.geoPath()
        .projection(projection);


    /* =============================================== End Texture and Projection Section ============================================================= */

    /* ======================================================== Start New England Section ==============================================================*/

    // Vermont State
    if (selected == vt1) {
        for (keys in msaDic) {
            g.append("path")
                .datum(topojson.merge(vt, vt.objects.vt.geometries.filter(function(d) {
                    if (vt1 == selected) {
                        return msaDic[keys].includes(parseInt(d.id));
                    }
                })))
                .attr("d", path)
                .attr("stroke", "black")
                .style("fill", "#f1fc37")
                .attr("fill-opacity", 0.7)
                .attr("stroke-width", "1.5")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("id", function(d) {
                    return keys;
                });
        }

        for (keys in rigos) {
            g.append("path")
                .datum(topojson.merge(vt, vt.objects.vt.geometries.filter(function(d) {
                    if (vt1 == selected) {
                        return rigos[keys].includes(parseInt(d.id));
                    }
                })))
                .attr("d", path)
                .attr("stroke", "black")
                .style("fill", "#6dcedf")
                .attr("fill-opacity", 0.7)
                .attr("stroke-width", "1.5")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("id", function(d) {
                    return keys;
                });
        }
        g.append("g")
            .attr("id", "state")
            .selectAll("path")
            .data(topojson.feature(vt, vt.objects.vt).features)
            .enter().append("path")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("stroke", "black")
            .attr("stroke-width", "0.5")
            .attr("fill", "white")
            .attr("fill-opacity", 0.000009)
            .on('click', clicked)
            .on('mouseover', hover)
            .on('mouseout', nohover);


    }
    // Massachusetts State
    else if (selected == ma1) {
        for (keys in msaDic) {
            g.append("path")
                .datum(topojson.merge(ma, ma.objects.ma.geometries.filter(function(d) {
                    if (ma1 == selected) {
                        return msaDic[keys].includes(parseInt(d.id));
                    }
                })))
                .attr("d", path)
                .attr("stroke", "black")
                .style("fill", "#f1fc37")
                .attr("fill-opacity", 0.7)
                .attr("stroke-width", "1.5")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("id", function(d) {
                    return keys;
                });
        }

        for (keys in rigos) {
            g.append("path")
                .datum(topojson.merge(ma, ma.objects.ma.geometries.filter(function(d) {
                    if (ma1 == selected) {
                        return rigos[keys].includes(parseInt(d.id));
                    }
                })))
                .attr("d", path)
                .attr("stroke", "black")
                .style("fill", "#6dcedf")
                .attr("fill-opacity", 0.7)
                .attr("stroke-width", "1.5")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("id", function(d) {
                    return keys;
                });
        }
        g.append("g")
            .attr("id", "state")
            .selectAll("path")
            .data(topojson.feature(ma, ma.objects.ma).features)
            .enter().append("path")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("stroke", "black")
            .attr("stroke-width", "0.5")
            .attr("fill", "white")
            .attr("fill-opacity", 0.000009)
            .on('click', clicked)
            .on('mouseover', hover)
            .on('mouseout', nohover);

    }
    // New Hampshire State
    else if (selected == nh1) {
        for (keys in msaDic) {
            g.append("path")
                .datum(topojson.merge(nh, nh.objects.nh.geometries.filter(function(d) {
                    if (nh1 == selected) {
                        return msaDic[keys].includes(parseInt(d.id));
                    }
                })))
                .attr("d", path)
                .attr("stroke", "black")
                .style("fill", "#f1fc37")
                .attr("fill-opacity", 0.7)
                .attr("stroke-width", "1.5")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("id", function(d) {
                    return keys;
                });
        }

        for (keys in rigos) {
            g.append("path")
                .datum(topojson.merge(nh, nh.objects.nh.geometries.filter(function(d) {
                    if (nh1 == selected) {
                        return rigos[keys].includes(parseInt(d.id));
                    }
                })))
                .attr("d", path)
                .attr("stroke", "black")
                .style("fill", "#6dcedf")
                .attr("fill-opacity", 0.7)
                .attr("stroke-width", "1.5")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("id", function(d) {
                    return keys;
                });
        }
        g.append("g")
            .attr("id", "state")
            .selectAll("path")
            .data(topojson.feature(nh, nh.objects.nh).features)
            .enter().append("path")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("stroke", "black")
            .attr("stroke-width", "0.5")
            .attr("fill", "white")
            .attr("fill-opacity", 0.000009)
            .on('click', clicked)
            .on('mouseover', hover)
            .on('mouseout', nohover);

    }
    // Connecticut State
    else if (selected == ct1) {

        for (keys in msaDic) {
            g.append("path")
                .datum(topojson.merge(ct, ct.objects.ct.geometries.filter(function(d) {
                    if (ct1 == selected) {
                        return msaDic[keys].includes(parseInt(d.id));
                    }
                })))
                .attr("d", path)
                .attr("stroke", "black")
                .style("fill", "#f1fc37")
                .attr("fill-opacity", 0.7)
                .attr("stroke-width", "1.5")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("id", function(d) {
                    return keys;
                });
        }

        for (keys in rigos) {
            g.append("path")
                .datum(topojson.merge(ct, ct.objects.ct.geometries.filter(function(d) {
                    if (ct1 == selected) {
                        return rigos[keys].includes(parseInt(d.id));
                    }
                })))
                .attr("d", path)
                .attr("stroke", "black")
                .style("fill", "#6dcedf")
                .attr("fill-opacity", 0.7)
                .attr("stroke-width", "1.5")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("id", function(d) {
                    return keys;
                });
        }
        g.append("g")
            .attr("id", "state")
            .selectAll("path")
            .data(topojson.feature(ct, ct.objects.ct).features)
            .enter().append("path")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("stroke", "black")
            .attr("stroke-width", "0.5")
            .attr("fill", "white")
            .attr("fill-opacity", 0.000009)
            .on('click', clicked)
            .on('mouseover', hover)
            .on('mouseout', nohover);
    }


    /* ======================================================== End New England Section ======================================================== */
    /* ======================================================  Final Layer =====================================================================*/
    else {

        for (keys in msaDic) {
            g.append("path")
                .datum(topojson.merge(us, us.objects.collection.geometries.filter(function(d) {
                    if (d.properties.state_fips == selected) {
                        return msaDic[keys].includes(parseInt(d.properties.fips));
                    }
                })))
                .attr("id", "te")
                .attr("d", path)
                .attr("stroke", "black")
                .style("fill", "#f1fc37")
                .attr("stroke-width", "1.5");
        }
        for (keys in rigos) {
            g.append("path")
                .datum(topojson.merge(us, us.objects.collection.geometries.filter(function(d) {
                    if (d.properties.state_fips == selected) {
                        return rigos[keys].includes(parseInt(d.properties.fips));
                    }
                })))
                .attr("d", path)
                .attr("stroke", "black")
                .style("fill", "#6dcedf")
                .attr("fill-opacity", 0.7)
                .attr("stroke-width", "1.5");
        }


        g.append("g")
            .attr("id", "state")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.collection).features.filter(function(d) { return d.properties.state_fips == selected; }))
            .enter().append("path")
            .attr("d", path)
            .attr("id", function(d) {
                return d.properties.fips;
            })
            .attr("stroke", "black")
            .attr("fill-opacity", 0.000009)
            .attr("stroke-width", "0.5")
            .attr("fill", "white")
            .on('click', clicked)
            .on('mouseover', hover)
            .on('mouseout', nohover);
    }
    /* ====================================================== Hover Section ====================================================== */

    var states_names = {
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

    function clicked() {
        console.log(d3.select(this).attr('id'));
        d3.select("#StateName").html(states_names[countyRIGOAffiliationName[d3.select(this).attr('id')][5]]);
        d3.select("#CountyName").html(countyRIGOAffiliationName[d3.select(this).attr('id')][2]);
        d3.select("#RIGOAffiliation1").html(rigosname.get(countyRIGOAffiliationName[d3.select(this).attr('id')][0]));
        if (countyRIGOAffiliationName[d3.select(this).attr('id')][1] != "0") {
            d3.select("#RIGOAffiliation2").html(rigosname.get(countyRIGOAffiliationName[d3.select(this).attr('id')][1]));
        } else {
            d3.select("#RIGOAffiliation2").html("NA");
        }
    }

    function hover() {
        d3.select(this).attr("stroke", "red");

    }

    function nohover() {
        d3.select(this).attr("stroke", "black");

    }


};
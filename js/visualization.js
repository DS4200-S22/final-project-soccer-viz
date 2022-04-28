// Set margins and dimensions for scatterplot and bar
const scatterMargin = { top: 25, right: 25, bottom: 65, left: 100 };
const barMargin = { top: 25, right: 25, bottom: 150, left: 50 };
const scatterWidth = 800; //- scatterMargin.left - scatterMargin.right;
const scatterHeight = 800; //- scatterMargin.top - scatterMargin.bottom;
const barWidth = 800; //- barMargin.left - barMargin.right;
const barHeight = 800; //- barMargin.top - barMargin.bottom;

// global variables
let teams;
let players;
let scatterBrush;  // Brush on the scatter
let selectSquads = new Array();  // The current teams
let xScaleScatter
let yScaleScatter
let xScaleBar
let yScaleBar
// these lets would be needed for global variables if we implement statistic switching options
let xKeyScatter
let yKeyScatter
let xKeyBar
let yKeyBar

// Append svg object to the body of the page to house the scatter plot
const scatterplotDiv = d3.select("#vis-container")
  .append("div")
  .attr("id","csv-div")

// Append svg object to the body of the page to house the scatter plot
const scatterPlot = d3.select("#csv-div")
  .append("svg")
  .attr("id","csv-scatter")
  .attr("width", scatterWidth - scatterMargin.left - scatterMargin.right)
  .attr("height", scatterHeight - scatterMargin.top - scatterMargin.bottom)
  .attr("viewBox", [0, 0, scatterWidth, scatterHeight]);

// Append svg object to the body of the page to house the bar plot
const barPlotDiv = d3.select("#vis-container")
  .append("div")
  .attr("id","bp-div")

// Append svg object to the body of the page to house the bar plot
const barPlot = d3.select("#bp-div")
  .append("svg")
  .attr("class","csv-barplot")
  .attr("width", barWidth - barMargin.left - barMargin.right)
  .attr("height", barHeight - barMargin.top - barMargin.bottom)
  .attr("viewBox", [0, 0, barWidth, barHeight]);

// create the graphs on opening
plotScatter();
plotBarChart();

// rounding function
function roundToTwo(num) {
  return +(Math.round(num + "e+2")  + "e-2");
}

// Updating scatter plot function
function updateScatter() {
  selectSquads = new Array();
  scatterPlot.call(scatterBrush.move, null);
  scatterPlot.selectAll("*").remove();
  plotScatter();
}

// Updating bar chart function
function updateBar() {
  barPlot.selectAll("*").remove();
  plotBarChart();
};

// color function
function returnHEX(team) {
  if (team == 'Arsenal') {color = '#EF0107'}
  if (team == 'Bournemouth') {color = '#B50E127'}
  if (team == 'Brighton') {color = '#0057B8'}
  if (team == 'Burnley') {color = '#6C1D45'}
  if (team == 'Chelsea') {color = '#034694'}
  if (team == 'Crystal Palace') {color = '#1B458F'}
  if (team == 'Everton') {color = '#003399'}
  if (team == 'Huddersfield') {color = '#0E63AD'}
  if (team == 'Leicester City') {color = '#003090'}
  if (team == 'Liverpool') {color = '#C8102E'}
  if (team == 'Manchester City') {color = '#6CABDD'}
  if (team == 'Manchester Utd') {color = '#DA291C'}
  if (team == 'Newcastle Utd') {color = '#241F20'}
  if (team == 'Southampton') {color = '#D71920'}
  if (team == 'Swansea City') {color = '#121212'}
  if (team == 'Stoke City') {color = '#E03A3E'}
  if (team == 'Tottenham') {color = '#132257'}
  if (team == 'Watford') {color = '#FBEE23'}
  if (team == 'West Brom') {color = '#122F67'}
  if (team == 'West Ham') {color = '#7A263A'}
  if (team == 'Cardiff City') {color = '#0070B5'}
  if (team == 'Fulham') {color = '#000000'}
  if (team == 'Wolves') {color = '#FDB913'}
  if (team == 'Aston Villa') {color = '#670E36'}
  if (team == 'Norwich City') {color = '#FFF200'}
  if (team == 'Sheffield Utd') {color = '#EE2737'}
  if (team == 'Leeds United') {color = '#FFCD00'}
  if (team == 'Brentford') {color = '#E30613'}
  return color
}


// Plot scatter plot function
function plotScatter() {
  d3.csv("data/team_data.csv").then((data) => {
    xKeyScatter = "xG Against per 90";
    yKeyScatter = "xG per 90";
    teamName = "Squad";

    // Find max x and min x
    let maxX = d3.max(data, (d) => { return d[xKeyScatter]; });
    let minX = d3.min(data, (d) => { return d[xKeyScatter]; });

    // Find max y and min y
    let maxY = d3.max(data, (d) => { return d[yKeyScatter]; });
    let minY = d3.min(data, (d) => { return d[yKeyScatter]; });

    // Find max and min
    let maxXY = Math.max(maxY, maxX)
    let minXY = Math.min(minX, minY)

    // Create X scale
    xScaleScatter = d3.scaleLinear()
      .domain([minXY * .9, maxX * 1.1])
      .range([scatterMargin.left, scatterWidth - scatterMargin.right]);

    // Add x axis 
    scatterPlot.append("g")
      .attr("transform", `translate(0,${scatterHeight - scatterMargin.bottom})`)
      .call(d3.axisBottom(xScaleScatter))
      .attr("font-size", '20px')
      .call((g) => g.append("text")
        .attr("x", scatterWidth - scatterMargin.right)
        .attr("y", scatterMargin.bottom)
        .attr("fill", "black")
        .attr("text-anchor", "end")
        .text(xKeyScatter)
      );

    // Create Y scale
    yScaleScatter = d3.scaleLinear()
      .domain([minXY * .9, maxY * 1.1])
      .range([scatterHeight - scatterMargin.bottom, scatterMargin.top]);

    // Add y axis 
    scatterPlot.append("g")
      .attr("transform", `translate(${scatterMargin.left}, 0)`)
      .call(d3.axisLeft(yScaleScatter))
      .attr("font-size", '20px')
      .call((g) => g.append("text")
        .attr("x", -5)
        .attr("y", scatterMargin.top)
        .attr("fill", "black")
        .attr("text-anchor", "end")
        .text(yKeyScatter)
      );
    
    // add diagonal line
    scatterPlot.append("line")
      .attr("x1", xScaleScatter(minXY * .9))
      .attr("y1", yScaleScatter(minXY * .9))
      .attr("x2", xScaleScatter(maxX * 1.1))
      .attr("y2", yScaleScatter(maxY * 1.1))
      .attr("stroke-width", 2)
      .attr("stroke", "red")
      .attr("stroke-dasharray", "5,5"  //style of svg-line
      );

    // create tooltip
    const tooltipSP = d3.select("#csv-div") // selects all svgs with id
                    .append("div") // preps for adding to div
                    .attr('id', "tooltipSP") // adds id to svg called tooltip3
                    .style("opacity", 0)  // sets style to opacity = 0
                    .attr("class", "tooltip"); // sets class to svg called tooltip
    
    // mouseover scatterplot watcher
    const mouseoverSP = function(event, d) { // creates a function based off of event and data (mouseover)
      tooltipSP.html("Team: ".bold() + d["Squad-Season"] + "<hr>" +
                    "xG: ".bold() + roundToTwo(d["xG per 90"]) + "<hr>" +
                    "xG Against: ".bold() + roundToTwo(d["xG Against per 90"]) + "<hr>" +
                    "Goals: ".bold() + roundToTwo(d["G per 90"]) + "<hr>" +
                    "Goals Against: ".bold() + roundToTwo(d["G Against per 90"])) // adds text to tooltipSP
              .style("opacity", 1);  // sets opacity = 1 (can be seen)
    }

    const yTooltipOffset = 15

    // function based off of event and data (mouse moving)
    const mousemoveSP = function(event, d) { 
      tooltipSP.style("left", (event.pageX)+"px") 
              .style("top", (event.pageY + 15) +"px"); 
    }

    // function to remove tooltip opacity when off of point
    const mouseleaveSP = function(event, d) { // creates a function based off of event and data (mouse leaving)
      tooltipSP.style("opacity", 0); // set opacity of tooltip back to 0 (cant be seen)
    }

    // Create the brush
    scatterBrush = d3.brush().extent([[0, 0], [scatterWidth, scatterHeight]]);

    // Add brush then points
    scatterPlot.call(scatterBrush
      .on("end", handleBrush));

    // Add points
    teams = scatterPlot.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", (d) => xScaleScatter(d[xKeyScatter]))
        .attr("cy", (d) => yScaleScatter(d[yKeyScatter]))
        .attr("r", 8)
        .attr("id", (d) => (d[teamName]))
        .style("fill", (d) => returnHEX(d[teamName]))
        .style("opacity", 0.75)
        .style("stroke", "black")
      .on("mouseover", mouseoverSP) // calls funct when event happens to the circle
      .on("mousemove", mousemoveSP) // calls funct when event happens to the circle
      .on("mouseleave", mouseleaveSP); // calls funct when event happens to the circle

    

  });
}

// Plot bar chart
function plotBarChart() {
  d3.csv("data/player_dataV3.csv").then((data) => {
    data = data.filter(players => players.Min > 300) // player mustve played 300 mins

    // sort data
    squadData = data.sort(function(a, b) {
      return d3.descending(a['xG per 90'], b['xG per 90']);
    })

    // brush 
    if (selectSquads.length > 0) {
      squadData = squadData.filter(players => selectSquads.includes(players['Squad-Season']));
    }

    // Restrict chart to top 30 players
    barData = squadData.slice(0, 30); 
    
    // set bar variables
    xKeyBar = "Player-Season";
    yKeyBar = "xG per 90";

    // Create X scale
    xScaleBar = d3.scaleBand()
      .domain(barData.map(d => d['Player-Season']))
      .range([barMargin.left, barWidth - barMargin.right])
      .padding(0.1);

    // Add x axis 
    barPlot.append("g")
      .attr("transform", `translate(0,${barHeight - barMargin.bottom})`)
      .call(d3.axisBottom(xScaleBar))
      .attr("font-size", '14px')
      .call((g) => g.append("text")
        .attr("x", barWidth - barMargin.right)
        .attr("y", barMargin.bottom)
        .attr("fill", "black")
        .attr("text-anchor", "end"))
      .selectAll("text")  
      .style("text-anchor", "end")
      .attr("dx", "-.1em")
      .attr("dy", ".25em")
      .attr("transform", "rotate(-35)");

    // Find max y 
    let maxY = d3.max(barData, (d) => { return d[yKeyBar]; });

    // Create Y scale
    yScaleBar = d3.scaleLinear()
      .domain([0, maxY])
      .range([barHeight - barMargin.bottom, barMargin.top]);

    // Add y axis 
    barPlot.append("g")
      .attr("transform", `translate(${barMargin.left}, 0)`)
      .call(d3.axisLeft(yScaleBar))
      .attr("font-size", '20px')
      .call((g) => g.append("text")
        .attr("x", 0)
        .attr("y", barMargin.top)
        .attr("fill", "black")
        .attr("text-anchor", "end")
        .text(yKeyBar)
      );

    // create tooltip
    const tooltipBP = d3.select("#bp-div") // selects all svgs with id
                    .append("div") // preps for adding to div
                    .attr('id', "tooltipBP") // adds id to svg called tooltip3
                    .style("opacity", 0)  // sets style to opacity = 0
                    .attr("class", "tooltip"); // sets class to svg called tooltip
    
    // mouseover bar plot watcher 
    const mouseoverBP = function(event, d) { // creates a function based off of event and data (mouseover)
      tooltipBP.html("Player: ".bold() + d["Player-Season"] + "<hr>" +
                    "Team: ".bold() + d["Team"] + "<hr>" +
                    "Nation: ".bold() + d["Nation"] + "<hr>" +
                    "Position: ".bold() + d["Position"] + "<hr>" +
                    "Goals: ".bold() + d["Goals"] + "<hr>" +
                    "xG per 90: ".bold() + roundToTwo(d["xG per 90"]) + "<hr>" +
                    "G per 90: ".bold() + roundToTwo(d["Goals per 90"])) // adds text to tooltipSP
              .style("opacity", 1);  // sets opacity = 1 (can be seen)
    }

    // function based off of event and data (mouse moving)
    const mousemoveBP = function(event, d) { 
      tooltipBP.style("left", (event.pageX)+"px") 
              .style("top", (event.pageY + 15) +"px");
    }

    // function to remove tooltip when no longer hovering
    const mouseleaveBP = function(event, d) { // creates a function based off of event and data (mouse leaving)
      tooltipBP.style("opacity", 0); // set opacity of tooltip back to 0 (cant be seen)
    }

    // Add bars
    players = barPlot.selectAll(".bar")
      .data(barData)
      .enter()
      .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScaleBar(d[xKeyBar]))
        .attr("y", (d) => yScaleBar(d[yKeyBar]))
        .attr("height", (d) => (barHeight - barMargin.bottom) - yScaleBar(d[yKeyBar]))
        .attr("width", xScaleBar.bandwidth())
        .style("fill", (d) => returnHEX(d["Team"]))
        .style("opacity", 0.75)
      .on("mouseover", mouseoverBP) // calls funct when event happens to the circle
      .on("mousemove", mousemoveBP) // calls funct when event happens to the circle
      .on("mouseleave", mouseleaveBP); // calls funct when event happens to the circle
});
};

// brush event function to update bar chart and take care of brushed points from scatter
function handleBrush(brushEvent) {
  extent = brushEvent.selection;
  selectSquads = new Array();
  teams.attr("class", "");
  if (extent) {   
    teams.classed("selected", function (d) {
      inBrush = isBrushed(extent, xScaleScatter(d[xKeyScatter]), yScaleScatter(d[yKeyScatter]));

      if (inBrush) {
        selectSquads.push(d["Squad-Season"]); // add wanted season and team combos to array
      }

      return inBrush; // returns teams selected to be given know class attribute
    });
  }
  updateBar();
}

// function from class to see if points are in brushed area
function isBrushed(brush_coords, cx, cy) {
  if (brush_coords === null) return;

  var x0 = brush_coords[0][0],
    x1 = brush_coords[1][0],
    y0 = brush_coords[0][1],
    y1 = brush_coords[1][1];
  return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1; // This return TRUE or FALSE depending on if the points is in the selected area
}


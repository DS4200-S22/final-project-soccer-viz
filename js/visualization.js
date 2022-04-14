d3.csv("data/team_data.csv").then((data) => {
  // Log the first 10 rows of team data to the console
  console.log(data.slice(0, 10));
});

d3.csv("data/player_dataV2.csv").then((data) => {
  // Log the first 10 rows of player data to the console
  console.log(data.slice(0, 10));
});

// Set margins and dimensions for scatterplot
const margin = { top: 50, right: 50, bottom: 200, left: 200 };
const width = 900; //- margin.left - margin.right;
const height = 650; //- margin.top - margin.bottom;

// Append svg object to the body of the page to house the scatter plot
const scatterplotDiv = d3.select("#vis-container")
  .append("div")
  .attr("id","csv-div")

// Append svg object to the body of the page to house the scatter plot
const scatterPlot = d3.select("#csv-div")
  .append("svg")
  .attr("id","csv-scatter")
  .attr("width", width - margin.left - margin.right)
  .attr("height", height - margin.top - margin.bottom)
  .attr("viewBox", [0, 0, width, height]);

// rounding function
function roundToTwo(num) {
  return +(Math.round(num + "e+2")  + "e-2");
}

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

let teams;
let players;

// Plot scatter plot
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
  xScale = d3.scaleLinear()
    .domain([minXY * .9, maxX * 1.1])
    .range([margin.left, width - margin.right]);

  // Add x axis 
  scatterPlot.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale))
    .attr("font-size", '20px')
    .call((g) => g.append("text")
      .attr("x", width - margin.right)
      .attr("y", margin.bottom)
      .attr("fill", "black")
      .attr("text-anchor", "end")
      .text(xKeyScatter)
    );

  // Create Y scale
  yScale = d3.scaleLinear()
    .domain([minXY * .9, maxY * 1.1])
    .range([height - margin.bottom, margin.top]);

  // Add y axis 
  scatterPlot.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale))
    .attr("font-size", '20px')
    .call((g) => g.append("text")
      .attr("x", -5)
      .attr("y", margin.top)
      .attr("fill", "black")
      .attr("text-anchor", "end")
      .text(yKeyScatter)
    );
  
  // add diagonal line
  scatterPlot.append("line")
    .attr("x1", xScale(minXY * .9))
    .attr("y1", yScale(minXY * .9))
    .attr("x2", xScale(maxX * 1.1))
    .attr("y2", yScale(maxY * 1.1))
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
  
  // THIRD EVENT WATCHERS 
  const mouseoverSP = function(event, d) { // creates a function based off of event and data (mouseover)
    tooltipSP.html("Team: ".bold() + d["Squad-Season"] + "<hr>" +
                   "xG: ".bold() + roundToTwo(d["xG per 90"]) + "<hr>" +
                   "xG Against: ".bold() + roundToTwo(d["xG Against per 90"]) + "<hr>" +
                   "Goals: ".bold() + roundToTwo(d["G per 90"]) + "<hr>" +
                   "Goals Against: ".bold() + roundToTwo(d["G Against per 90"])) // adds text to tooltipSP
            .style("opacity", 1);  // sets opacity = 1 (can be seen)
  }

  const yTooltipOffset = 15

  // TODO: What does each line of this code do? 
  const mousemoveSP = function(event, d) { // creates a function based off of event and data (mouse moving)
    tooltipSP.style("left", (event.pageX)+"px") //  UNSURE
            .style("top", (event.pageY + 15) +"px"); // UNSURE
  }

  // TODO: What does this code do? 
  const mouseleaveSP = function(event, d) { // creates a function based off of event and data (mouse leaving)
    tooltipSP.style("opacity", 0); // set opacity of tooltip back to 0 (cant be seen)
  }

  // Add points
  teams = scatterPlot.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", (d) => xScale(d[xKeyScatter]))
      .attr("cy", (d) => yScale(d[yKeyScatter]))
      .attr("r", 8)
      .attr("id", (d) => (d[teamName]))
      .style("fill", (d) => returnHEX(d[teamName]))
      .style("opacity", 0.7)
    .on("mouseover", mouseoverSP) // calls funct when event happens to the circle
    .on("mousemove", mousemoveSP) // calls funct when event happens to the circle
    .on("mouseleave", mouseleaveSP); // calls funct when event happens to the circle

});

// BAR PLOT

teamNameBP = "Team";

// Append svg object to the body of the page to house the bar plot
const barPlotDiv = d3.select("#vis-container")
  .append("div")
  .attr("id","bp-div")


// Append svg object to the body of the page to house the bar plot
const barPlot = d3.select("#bp-div")
  .append("svg")
  .attr("class","csv-barplot")
  .attr("width", width - margin.left - margin.right)
  .attr("height", height - margin.top - margin.bottom)
  .attr("viewBox", [0, 0, width, height]);

// Plot bar chart
d3.csv("data/player_dataV2.csv").then((data) => {
    data = data.sort(function(a, b) {
      return d3.descending(a['xG per 90'], b['xG per 90']);
    }).slice(0, 30); // Restrict chart to top 30 players
  
  xKeyBar = "Player-Season";
  yKeyBar = "xG per 90";

  // Create X scale
  xScale = d3.scaleBand()
    .domain(data.map(d => d['Player-Season']))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  // Add x axis 
  barPlot.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale))
    .attr("font-size", '12px')
    .call((g) => g.append("text")
      .attr("x", width - margin.right)
      .attr("y", margin.bottom - 4)
      .attr("fill", "black")
      .attr("text-anchor", "end")
      .text(xKeyBar))
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

  // Find max y 
  let maxY = d3.max(data, (d) => { return d[yKeyBar]; });

  // Create Y scale
  yScale = d3.scaleLinear()
    .domain([0, maxY])
    .range([height - margin.bottom, margin.top]);

  // Add y axis 
  barPlot.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale))
    .attr("font-size", '20px')
    .call((g) => g.append("text")
      .attr("x", 0)
      .attr("y", margin.top)
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
  
  // THIRD EVENT WATCHERS 
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

  // TODO: What does each line of this code do? 
  const mousemoveBP = function(event, d) { // creates a function based off of event and data (mouse moving)
    tooltipBP.style("left", (event.pageX)+"px") //  UNSURE
            .style("top", (event.pageY + 15) +"px"); // UNSURE
  }

  // TODO: What does this code do? 
  const mouseleaveBP = function(event, d) { // creates a function based off of event and data (mouse leaving)
    tooltipBP.style("opacity", 0); // set opacity of tooltip back to 0 (cant be seen)
  }

  // Add bars
  players = barPlot.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d[xKeyBar]))
      .attr("y", (d) => yScale(d[yKeyBar]))
      .attr("height", (d) => (height - margin.bottom) - yScale(d[yKeyBar]))
      .attr("width", xScale.bandwidth())
      .style("fill", (d) => returnHEX(d[teamNameBP]))
      .style("opacity", 0.5)
    .on("mouseover", mouseoverBP) // calls funct when event happens to the circle
    .on("mousemove", mousemoveBP) // calls funct when event happens to the circle
    .on("mouseleave", mouseleaveBP); // calls funct when event happens to the circle
});

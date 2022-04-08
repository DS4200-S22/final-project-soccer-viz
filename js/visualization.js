d3.csv("data/team_data.csv").then((data) => {
  // Log the first 10 rows of team data to the console
  console.log(data.slice(0, 10));
});

d3.csv("data/player_data.csv").then((data) => {
  // Log the first 10 rows of player data to the console
  console.log(data.slice(0, 10));
});

// Set margins and dimensions 
const margin = { top: 50, right: 50, bottom: 50, left: 200 };
const width = 900; //- margin.left - margin.right;
const height = 650; //- margin.top - margin.bottom;

// Append svg object to the body of the page to house the scatter plot
const scatterPlot = d3.select("#vis-container")
  .append("svg")
  .attr("width", width - margin.left - margin.right)
  .attr("height", height - margin.top - margin.bottom)
  .attr("viewBox", [0, 0, width, height]);

// Append svg object to the body of the page to house the bar plot
const barPlot = d3.select("#vis-container")
  .append("svg")
  .attr("width", width - margin.left - margin.right)
  .attr("height", height - margin.top - margin.bottom)
  .attr("viewBox", [0, 0, width, height]);

let teams;
let players;

// Plot scatter plot
d3.csv("data/team_data.csv").then((data) => {
  xKeyScatter = "xG";
  yKeyScatter = "xG Against";

  // Find max x
  let maxX = d3.max(data, (d) => { return d[xKeyScatter]; });

  // Create X scale
  xScale = d3.scaleLinear()
    .domain([0, maxX])
    .range([margin.left, width - margin.right]);

  // Add x axis 
  scatterPlot.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale))
    .attr("font-size", '20px')
    .call((g) => g.append("text")
      .attr("x", width - margin.right)
      .attr("y", margin.bottom - 4)
      .attr("fill", "black")
      .attr("text-anchor", "end")
      .text(xKeyScatter)
    );

  // Find max y 
  let maxY = d3.max(data, (d) => { return d[yKeyScatter]; });

  // Create Y scale
  yScale = d3.scaleLinear()
    .domain([0, maxY])
    .range([height - margin.bottom, margin.top]);

  // Add y axis 
  scatterPlot.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale))
    .attr("font-size", '20px')
    .call((g) => g.append("text")
      .attr("x", 0)
      .attr("y", margin.top)
      .attr("fill", "black")
      .attr("text-anchor", "end")
      .text(yKeyScatter)
    );
  
  // add diagonal line
  scatterPlot.append("line")
    .attr("x1", xScale(0))
    .attr("y1", yScale(0))
    .attr("x2", xScale(6000))
    .attr("y2", yScale(6000))
    .attr("stroke-width", 2)
    .attr("stroke", "red")
    .attr("stroke-dasharray", "5,5"  //style of svg-line
    );

  // Add points
  teams = scatterPlot.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d[xKeyScatter]))
    .attr("cy", (d) => yScale(d[yKeyScatter]))
    .attr("r", 8)
    .style("fill", "red")
    .style("opacity", 0.5);
});

// Plot bar chart
d3.csv("data/player_data.csv").then((data) => {
  data = data.slice(0, 10); // Restrict chart to top 10 players

  xKeyBar = "Player";
  yKeyBar = "xG";

  // Create X scale
  xScale = d3.scaleBand()
    .domain(data.map(d => d.Player))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  // Add x axis 
  barPlot.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale))
    .attr("font-size", '20px')
    .call((g) => g.append("text")
      .attr("x", width - margin.right)
      .attr("y", margin.bottom - 4)
      .attr("fill", "black")
      .attr("text-anchor", "end")
      .text(xKeyBar)
    );

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

  // Add points
  players = barPlot.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d[xKeyBar]))
    .attr("y", (d) => yScale(d[yKeyBar]))
    .attr("height", (d) => (height - margin.bottom) - yScale(d[yKeyBar]))
    .attr("width", xScale.bandwidth())
    .style("fill", "blue")
    .style("opacity", 0.5);
});

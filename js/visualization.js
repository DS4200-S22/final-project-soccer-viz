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
  
//brushing--------------------------
  
  
   // Call to removes existing brushes 
  function clear() {
    // clear existing brush from svg1
    svg1.call(brush1.move, null);
      
    // clear existing brush from svg2
    svg2.call(brush2.move, null);
    
  }

   // Called when Scatterplot1 is brushed 
   function updateChart1(brushEvent) {
      
    // Find coordinates of brushed region 
    brushArea = brushEvent.selection

    // Give bold outline to all points within the brush region in Scatterplot1
    myCircles1.classed("selected", function(d) { return isBrushed(brushArea, x1(d[xKey1]), y1(d[yKey1]))});

    // Give bold outline to all points in Scatterplot2 corresponding to points within the brush region in Scatterplot1
    myCircles2.classed("selected", function(d){ return isBrushed(brushArea, x1(d[xKey1]), y1(d[yKey1]))});
  }


  // Called when Scatterplot2 is brushed 
  function updateChart2(brushEvent) {
    
    // Find coordinates of brushed region 
    brushArea = brushEvent.selection

    // Start an empty set that you can store names of selected species in 
    let selectedSpecies = new Set()

    // Give bold outline to all points within the brush region in Scatterplot2 & collected names of brushed species
    myCircles2.classed("selected", function(d){ 
      if (isBrushed(brushArea, x2(d[xKey2]), y2(d[yKey2]))) // if brushed
      {
        selectedSpecies.add(d.Species) // add species to set
      }
      return isBrushed(brushArea, x2(d[xKey2]), y2(d[yKey2]))
    });
    
    // Give bold outline to all points in Scatterplot1 corresponding to points within the brush region in Scatterplot2
    myCircles1.classed("selected", function(d){ return isBrushed(brushArea, x2(d[xKey2]), y2(d[yKey2]))});
  
    // Give bold outline to all bars in bar chart with corresponding to species selected by Scatterplot2 brush
    myBars.classed("selected", function(d){ 
                                            return selectedSpecies.has(d.species) // adds selected class to those species in Set
    }); 
  }

    //Finds dots within the brushed region
  function isBrushed(brush_coords, cx, cy) {
    if (brush_coords === null) return;

    var x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1; // This return TRUE or FALSE depending on if the points is in the selected area
    };
});

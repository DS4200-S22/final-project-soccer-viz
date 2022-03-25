//This is filler -- delete it and start coding your visualization tool here
d3.select("#vis-container")
  .append("text")
  .attr("x", 20)
  .attr("y", 20)
  .text("Hello World!");

d3.csv("data/player_data.csv").then((data) => {
  // Log the first 10 rows of player data to the console
  console.log(data.slice(0, 10));
});

d3.csv("data/team_data.csv").then((data) => {
  // Log the first 10 rows of team data to the console
  console.log(data.slice(0, 10));
});
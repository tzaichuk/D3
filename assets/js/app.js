

// When the browser window is resized, makeResponsive() is called.
console.log('starting to create graphic...'); 

d3.select(window).on("resize", makeResponsive);

// When the browser loads, makeResponsive() is called.
makeResponsive();

function makeResponsive() {
  console.log('making responsive...'); 

  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Append SVG element
  var svg = d3
    .select(".chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", 'translate(${margin.left}, ${margin.top})');
  // Read CSV
  d3.csv("data.csv", function(err, csvData) {

    // parse data
    csvData.forEach(function(data){
      data.phys_act = +data.phys_act;
      data.poverty = +data.poverty;
    });

    // create scales
    var xScale = d3.scale.linear()
      .domain(d3.extent(csvData, d => d.poverty))
      .range([0, width]);

    var yScale = d3.scale.linear()
      .domain([0, d3.max(csvData, d => d.phys_act)])
      .range([height, 0]);

    // create axes
    var xAxis = d3.svg.axis().orient("bottom").scale(xScale); 
    var yAxis = d3.svg.axis().ticks(6).orient("left").scale(yScale); 

    // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    // line generator
    var line = d3.svg.line()
      .x(d => xScale(d.poverty))
      .y(d => yScale(d.phys_act));

    // append line
    chartGroup.append("path")
      .data([csvData])
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "red")

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(csvData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.poverty))
      .attr("cy", d => yScale(d.phys_act))
      .attr("r", "10")
      .attr("fill", "gold")
      .attr("stroke-width", "1")
      .attr("stroke", "black")

    // Step 1: Initialize Tooltip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d){
        return (`<strong>${d.poverty}<strong><hr>${d.phys_act} Lacks Healthcare`)
      })

    // Step 2: Create the tooltip in chartGroup.
    chartGroup.call(toolTip)

    // Step 3: Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(d){
        toolTip.show(d)
    })
    // Step 4: Create "mouseout" event listener to hide tooltip
      .on("mouseout", function(d){
        toolTip.hide(d)
      });

  });
};
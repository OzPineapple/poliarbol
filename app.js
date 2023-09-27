// var svg = d3.select("#svg");

var width = 700;
var height = 500;
const color = d3.scaleOrdinal(d3.schemeCategory10);

var svg, link, node, simulation;

var data;
var backup;
d3.json("data.json").then( function( json ){
	console.log( json );
	backup = json;
	data = {
		nodes: json.nodes.map( d => {console.log( d );   return {id: d.id} } ),
		links: json.links.map( d => { console.log( d );return {source: d.source, target: d.target } } )
	}

	console.log( data );



  // Create the SVG container.
  svg = d3.select("#svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

  // Add a line for each link, and a circle for each node.
  link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll()
    .data(data.links)
    .join("line")
      //.attr("stroke-width", d => Math.sqrt(d.value));

  node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll()
    .data(data.nodes)
    .join("circle")
      .attr("r", 10)
      .attr("fill", d => color(d.group) );

// Create a simulation with several forces.
  simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

  node.append("title")
      .text(d => d.id);

  // Add a drag behavior.
  node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

	node.on("click", function( obj1, obj ){
		alert( obj );
		console.log( obj1, obj );
		console.log( backup.nodes.find( d => d.id = obj.id ) );
	});
});

  // Set the position attributes of links and nodes each time the simulation ticks.
  function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  }

  // Reheat the simulation when drag starts, and fix the subject position.
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // Update the subject (dragged node) position during drag.
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  // When this cell is re-run, stop the previous simulation. (This doesn’t
  // really matter since the target alpha is zero and the simulation will
  // stop naturally, but it’s a good practice.)
//  invalidation.then(() => simulation.stop());


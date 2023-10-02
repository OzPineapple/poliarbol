var data = {
	nodes: [
		{ id: 1, r: 8, dis: 1, fill: "green", /*x: 250, y: 350*/ },
		{ id: 2, r: 8, dis: 1, fill: "red",   /*x: 225, y: 325*/ },
		{ id: 3, r: 8, dis: 1, fill: "blue",  /*x: 200, y: 300*/ },
		{ id: 4, r: 8, dis: 2, fill: "blue",  /*x: 200, y: 300*/ },
		{ id: 5, r: 8, dis: 2, fill: "blue",  /*x: 200, y: 300*/ },
		{ id: 6, r: 8, dis: 2, fill: "blue",  /*x: 200, y: 300*/ },
		{ id: 7, r: 8, dis: 2, fill: "blue",  /*x: 200, y: 300*/ },
		{ id: 8, r: 8, dis: 1, fill: "blue",  /*x: 200, y: 300*/ },
	],
	links: [
		{ source: 2, target: 3 },
		{ source: 2, target: 1 },
		{ source: 4, target: 2 },
		{ source: 7, target: 6 },
		{ source: 5, target: 4 },
		{ source: 6, target: 3 },
		{ source: 8, target: 3 },
	]
}

var svg,links,nodes,simulation;

svg = d3.select("#svg");

links = svg.append("g").selectAll().data( data.links ).join("line")
	.attr("stroke", "black")
	.attr("stroke-opacity", 1)
	.attr("stroke-width", 3 );

nodes = svg.append("g").selectAll().data( data.nodes ).join("circle")
	.attr("r", d => d.r )
	.attr( "fill", d => d.fill );

simulation = d3.forceSimulation(data.nodes)
	.force("center", d3.forceCenter(
		svg.attr("width")/2,
		svg.attr("height")/2,
	))
	.force("collide", d3.forceCollide().radius(d=>d.r+10))
	.force("links", d3.forceLink(data.links)
		.distance((d)=>{
			return d.source.dis * 50;
		})
		.id(d=>d.id)
	)
	.on("tick", ticked );

nodes.on( "click", (e,o) => {
	var node = { id: data.nodes.length + 1, r: 9, dis: 1, fill: "purple", /*x: 250, y: 350*/ };
	var link = { source: data.nodes.length, target: o.id }
	data.nodes.push( node )
	data.links.push( link )

	simulation.nodes( data.nodes ).on("tick", ticked);
	simulation.force("links").links(data.links);
	simulation.alpha(1).restart();

	var up_links = links.selectAll().data( data.links )
	links = up_links.enter().append("line").merge(up_links);
	up_links.exit().remove();

	var up_nodes = nodes.selectAll().data( data.nodes )
	nodes = up_nodes.enter().append("circle").merge(up_nodes);
	up_nodes.exit().remove();
});

function ticked() {
	links
		.attr("x2", d => d.source.x)
		.attr("y2", d => d.source.y)
		.attr("x1", d => d.target.x)
		.attr("y1", d => d.target.y)
	;

	nodes
		.attr("cx", d => d.x)
		.attr("cy", d => d.y)
	;
}

// ISC LICENCE
// Add a drag behavior.
nodes.call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

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

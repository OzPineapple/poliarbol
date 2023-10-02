var svg, nodes, links, simulation;

svg = d3.select("#view");

links = svg.append("g").selectAll("line");
nodes = svg.append("g").selectAll("circle");

simulation = d3.forceSimulation( getData().nodes )
	.force("link",    d3.forceLink( getData().links ).id( d => d.id ))
	.force("collide", d3.forceCollide().radius(10) )
	.force("charge",  d3.forceManyBody().strength(-120))
	.force("center",  d3.forceCenter( 
		svg.attr("width")/2,
		svg.attr("height")/2
	))
	.on("tick", () => {
		links
			.attr("x1", d => d.source.x)
			.attr("y1", d => d.source.y)
			.attr("x2", d => d.target.x)
			.attr("y2", d => d.target.y)
		;
		nodes
			.attr("cx", d => d.x)
			.attr("cy", d => d.y)
		;
	});
simulation.stop();

function update(){
	var data = getData();

	links = links.data( data.links )
		.join(
			enter => enter.append("line").attr("class", d => "link " + d.type ),
			update => update,
			exit => exit.remove()
		);

	nodes = nodes.data( data.nodes )
		.join(
			enter => enter.append("circle").attr("class", d => d.type ),
			update => update,
			exit => exit.remove()
		);

	nodes.call(d3.drag()
	      .on("start", dragstarted)
	      .on("drag", dragged)
	      .on("end", dragended));

	nodes.on("click", (e,o) => info(o) );

	simulation.nodes( data.nodes );
	simulation.force("link").links(data.links);
	simulation.alpha(1).restart();
}

var modal = document.getElementById("modal");
var content = document.getElementById("content");
var modal_close = document.getElementById("close");

modal_close.addEventListener("click", () => modal.style.display = "none" );

function info( node ){
	modal.style.display = "block";
	content.innerHTML = node.name + "<br>" + node.type;
	add( node );
}

function add( node ){
	data.links.push( { source: node.id, target: data.nodes.length + 1} );
	data.nodes.push( { id: data.nodes.length + 1, x: node.x, y: node.y, type: "OBLIGATORIA" } );
	update();
}

function remove() {
	data.links.pop();
	data.nodes.pop();
	update();
}

// Add a drag behavior.
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

update();

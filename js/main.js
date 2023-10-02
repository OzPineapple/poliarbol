var svg, nodes, links, simulation;
var data = getData();

svg = d3.select("#view");

svg.attr("width", document.body.offsetWidth )
svg.attr("height", document.body.offsetHeight * 0.9 )

links = svg.append("g").selectAll("line");
nodes = svg.append("g").selectAll("circle");

simulation = d3.forceSimulation( data.nodes )
	.force("link",    d3.forceLink( data.links ).id( d => d.id ))
	.force("collide", d3.forceCollide().radius(20) )
	.force("charge",  d3.forceManyBody().strength(-30))
	.force("center",  d3.forceCenter( 
		svg.attr("width")/2,
		svg.attr("height")/2
	))
	.tick(10)
	.on("tick", () => {
		var radius = 10;
		var width = svg.attr("width");
		var height = svg.attr("height");
		links
			.attr("x1", d => Math.max( radius, Math.min( width  - radius, d.source.x) ) )
			.attr("y1", d => Math.max( radius, Math.min( height - radius, d.source.y) ) )
			.attr("x2", d => Math.max( radius, Math.min( width  - radius, d.target.x) ) )
			.attr("y2", d => Math.max( radius, Math.min( height - radius, d.target.y) ) )
		;
		nodes
			.attr("cx", d => Math.max(radius, Math.min(width - radius, d.x) ) )
			.attr("cy", d => Math.max(radius, Math.min(height - radius, d.y) ) )
		;
	});
simulation.stop();


function update(){
	let new_data = getData();
	for( let index in new_data.nodes ){
		new_data.nodes[index].cx = data.nodes[index].cx;
		new_data.nodes[index].cy = data.nodes[index].cy;
	}
	for( let index in new_data.links ){
		new_data.links[index].x1 = data.links[index].x1;
		new_data.links[index].x2 = data.links[index].x2;
		new_data.links[index].y1 = data.links[index].y1;
		new_data.links[index].y2 = data.links[index].y2;
	}

	data = new_data;

	links = links.data( data.links, d => d )
		.join(
			enter => enter.append("line").attr("class", d => getNode( d.source ).status == "LOCK" || getNode( d.target ).status == "LOCK" ? "LINKLOCK" : "LINK" ),
			update => update,
			exit => exit.remove()
		);

	nodes = nodes.data( data.nodes, d => { return d } )
		.join(
			enter => enter.append("circle").attr("class", d => { return d.type + ' ' + d.status }),
			update => update,
			exit => exit.remove()
		);

	nodes.call(d3.drag()
	      .on("start", dragstarted)
	      .on("drag", dragged)
	      .on("end", dragended));

	nodes.on("click", (e,o) => info(o) );
	nodes.on("mouseover", (e, o)=>{
		nav.innerHTML = o.name + '<br><i>' + o.id+ '</i>';
		if( o.description ) 
			nav.innerHTML += '<br>' + o.description;
	});

	simulation.nodes( data.nodes );
	simulation.force("link").links(data.links);
	simulation.alpha(1).restart()
}

var modal = document.getElementById("modal");
var content = document.getElementById("content");
var modal_close = document.getElementById("close");
var modal_done = document.getElementById("done");
var nav = document.getElementById("nav");
var active_node;
var update_nodes = false;

modal_close.addEventListener("click", () => {
	modal.style.display = "none";
	if( update_nodes ){
		update();
		update_nodes = false;
	}
});

modal_done.addEventListener("click", () => {
	getNode( active_node.id, node => node.status = "DONE" );
	modal_done.style.display = "none";
	update_nodes = true;
});

function info( node ){
	active_node = node;
	modal_done.style.display = node.status == "DONE" || node.status == "LOCK" ? "none" : "block";
	modal.style.display = "block";
	content.innerHTML = node.name + "<br><i>" + node.id + "</i>";
	if( node.description ) 
		content.innerHTML += "<br>" + node.description;
	if( node.depends ){
		content.innerHTML += "<br><b>Depende de:</b> ";
		for( let dep of node.depends )
			 getNode( dep, node => {
				content.innerHTML += node.name + ', ';
			});
	}
//	add( node );
}

function add( node ){
	var data = getData();
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
	if( event.subject.fixed ) return;
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

// Update the subject (dragged node) position during drag.
function dragged(event) {
	if( event.subject.fixed ) return;
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

// Restore the target alpha so the simulation cools after dragging ends.
// Unfix the subject position now that it’s no longer being dragged.
function dragended(event) {
	if( event.subject.fixed ) return;
  if (!event.active) simulation.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}

update();

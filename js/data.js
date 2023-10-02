console.log( document.cookie );
var source = document.cookie ? JSON.parse( document.cookie ) : source_default;

function getData(){
	var nodes = [];
	var links = [];
	for( let node of source.main ){
		if( node.depends ){
			let aval = 0;
			for( let dependecy of node.depends ){
				links.push({
					source: node.id,
					target: dependecy
				})
				getNode(dependecy, node => {
					if( node.status == "DONE" )
						aval++;
				});
			}
			if( node.status != "DONE" ){
				if( node.morethan && node.lessthan ){
					node.status = aval >= node.morethan && aval <= node.lessthan ? "AVAL" : "LOCK";
				} else if( node.morethan || node.lessthan ){
					if( node.morethan ){
						node.status = aval >= node.morethan ? "AVAL" : "LOCK";
					} else if( node.lessthan ){
						node.status = aval <= node.lessthan ? "AVAL" : "LOCK";
					}
				} else {
					node.status = aval == node.depends.length ? "AVAL" : "LOCK";
				}
			}
		}
		nodes.push( node );
	}
	return { nodes: nodes, links: links };
}

function getNode( id, callback ){
	if( callback ) callback( source.main.find( e => e.id == id ) ) 
	else return source.main.find( e => e.id == id )
}

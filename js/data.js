var source = {
	main: [
		{
			id: "START",
			type: "INFO",
			name: "Inicio"
		},
		{
			id: "R01",
			type: "TASK",
			name: "Inscripción",
			depends: [ "START" ]
		},
		{
			id: "C101",
			name: "FUNDAMENTOS DE PROGRAMACION", 
			type: "MISSION",
			depends: [ "R01" ],
			period: 1,
			need: "OBLIGATORIA",
			credits: 7.50,
		},
		{
			id: "C102",
			name: "MATEMATICAS DISCRETAS",
			type: "MISSION",
			depends: [ "R01" ],
			period: 1,
			need: "OBLIGATORIA",
			credits: 10.50
		},
		{
			id: "C103",
			name: "CALCULO",
			type: "MISSION",
			depends: [ "R01" ],
			period: 1,
			need: "OBLIGATORIA",
			credits: 7.50
		},
		{
			id: "C104",
			name: "ANALISIS VECTORIAL",
			type: "MISSION",
			depends: [ "R01" ],
			period: 1,
			need: "OBLIGATORIA",
			credits: 7.50
		},
		{
			id: "C105",
			name: "COMUNICACION ORAL Y ESCRITA",
			type: "MISSION",
			depends: [ "R01" ],
			period: 1,
			need: "OBLIGATORIA",
			credits: 7.50
		},
		{
			id: "J01",
			name: "Semestre 1ro",
			type: "JOINER",
			depends: [ "C101", "C102", "C103", "C104", "C105" ],
		}

	]
};

function getData(){
	var nodes = [];
	var links = [];
	for( let node of source.main ){
		nodes.push( node );
		if( node.depends )
			for( let dependecy of node.depends )
				links.push({
					source: node.id,
					target: dependecy
				})
	}
	return { nodes: nodes, links: links };
}

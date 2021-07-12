let cavern_lookup = {};
let caverns_sorted = [];
let opened_chests = 0, num_chests
let visited_caverns = [], num_caverns;
let explored_squares = 0, open_squares;
let chests_div, caverns_div, explored_div;

let get_map_stats = function(){
	let package_div = document.createElement("div");
	let chests_label = document.createElement("label"); chests_label.innerText = "CHESTS: ";
	let caverns_label = document.createElement("label"); caverns_label.innerText = "CAVERNS: ";
	let explored_label = document.createElement("label"); explored_label.innerText = "EXPLORED: ";
	chests_div = document.createElement("div"), caverns_div = document.createElement("div"), explored_div = document.createElement("div");
	package_div.append(chests_label, chests_div, caverns_label, caverns_div, explored_label, explored_div);
	document.querySelector("body").prepend(package_div);

	let stats = get_stats();
	num_chests = stats.chests;
	num_caverns = stats.caverns;
	open_squares = stats.open;
}

let get_stats = function(){
	let visited = [];
	let chests = 0, caverns = 0, open_squares = 0;

	for(let i=0; i<COL; i++){
		for(let j=0; j<ROW; j++){
			if(map[i][j] != 0 && map[i][j] != 1){
				chests++;
			}

			if(!visited[COL*j + i] && map[i][j] != 1){
				caverns++;
				floodfill(i, j, caverns, visited);
			}

			if(map[i][j] == 0){
				open_squares++;
			}
		}
	}

	return {
		chests: chests,
		caverns: caverns,
		open: open_squares
	};
}

let floodfill = function(i, j, cavern, visited){
	let queue = [];

	queue.push({i:i, j:j});
	visited[COL*j + i] = true;
	cavern_lookup[COL*j + i] = cavern;
	caverns_sorted[cavern] == undefined ? caverns_sorted[cavern] = [COL*j + i] : caverns_sorted[cavern].push(COL*j + i);

	while(queue.length){
		let current = queue.pop();
		visited[COL*current.j + current.i] = true;
		cavern_lookup[COL*current.j + current.i] = cavern;
		caverns_sorted[cavern] == undefined ? caverns_sorted[cavern] = [COL*current.j + current.i] : caverns_sorted[cavern].push(COL*current.j + current.i);

		let neighbors = [[current.i, current.j - 1], [current.i + 1, current.j], [current.i, current.j + 1], [current.i - 1, current.j]];
		for(let k=0; k<neighbors.length; k++){
			let x = neighbors[k][0];
			let y = neighbors[k][1];

			if(!in_map(map, x, y)){
				continue;
			}

			if(!visited[COL*y + x] && map[x][y] != 1){
				queue.push({i:x, j:y});
			}
		}
	}
}

let stats_update = function(){
	if(chests_div){
		chests_div.innerText = opened_chests + "/" + num_chests;
	}

	if(caverns_div){
		let temp_i = Math.floor(player.pos.x/TILE);
		let temp_j = Math.floor(player.pos.y/TILE);
		let location_code = COL*temp_j + temp_i;

		let visited = false;
		for(let i=0; i<visited_caverns.length; i++){
			if(visited_caverns[i] == cavern_lookup[location_code]){
				visited = true;
			}
		}

		if(!visited){
			visited_caverns.push(cavern_lookup[location_code]);
		}

		caverns_div.innerText = visited_caverns.length + "/" + num_caverns;
	}

	if(explored_div){
		explored_div.innerText = ((explored_squares/open_squares)*100).toFixed(2) + "%"
	}
}
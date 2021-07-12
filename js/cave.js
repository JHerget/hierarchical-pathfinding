let procedural_cave = function(num_cols, num_rows, tile_size, birth_rate = 5, survival_rate = 4, iterations = 12, seed = Math.random()*10000){
	let map = [];
	seedrandom = seedrandom(seed);

	for(let i=0; i<num_cols; i++){
		map[i] = [];
		for(let j=0; j<num_rows; j++){
			if(seedrandom() < 0.5){
				map[i][j] = 1;
			}else{
				map[i][j] = 0;
			}
		}
	}

	for(let i=0; i<iterations; i++){
		apply_rules(map, birth_rate, survival_rate);
	}

	set_chests(map);

	return map;
}

let apply_rules = function(map, birth_rate, survival_rate){
	let new_map = map.slice();
	let col = new_map.length;
	let row = new_map[0].length;

	for(let i=0; i<col; i++){
		for(let j=0; j<row; j++){
			let neighbors = neighbor_data(map, i, j);

			if(!new_map[i][j] && neighbors.alive >= birth_rate){
				new_map[i][j] = 1;
			}else if(new_map[i][j] && neighbors.alive >= survival_rate){
				continue;
			}else{
				new_map[i][j] = 0;
			}
		}
	}

	map = new_map;
}

let set_chests = function(map){
	let col = map.length;
	let row = map[0].length;

	for(let i=0; i<col; i++){
		for(let j=0; j<row; j++){
			let neighbors = neighbor_data(map, i, j);

			if(neighbors.alive >= 5 && neighbors.alive <= 7 && map[i][j] == 0 && neighbors.chests == 0 && Math.random() < 0.6){
				map[i][j] = new Chest(i*TILE, j*TILE);
			}

			if(neighbors.alive == 0 && neighbors.chests == 0 && Math.random() <= 0.001){
				map[i][j] = new Chest(i*TILE, j*TILE);
			}
		}
	}
}

let neighbor_data = function(map, i, j){
	let neighbors = [[i, j - 1], [i - 1, j - 1], [i - 1, j], [i - 1, j + 1], [i, j + 1], [i + 1, j + 1], [i + 1, j], [i + 1, j - 1]];
	let alive = 0;
	let dead = 0;
	let chests = 0;

	for(let i=0; i<neighbors.length; i++){
		let x = neighbors[i][0];
		let y = neighbors[i][1];

		if(!in_map(map, x, y)){
			alive++;
			continue;
		}

		if(map[x][y] == 1){
			alive++;
		}else{
			dead++;

			if(map[x][y] == 2){
				chests++;
			}
		}
	}

	return {
		dead: dead,
		alive: alive,
		chests: chests
	};
}

let in_map = function(map, i, j){
	let col = map.length;
	let row = map[0].length;

	if(i >= 0 && i < col && j >= 0 && j < row){
		return true;
	}

	return false;
}

let seedrandom = function(seed){
	return function(){
		var t = seed += 0x6D2B79F5;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	}
}
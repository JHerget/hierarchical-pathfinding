let COL = 256, ROW = 256, TILE = 25, qt;
let map = [], qt_leaves = {}, path = [], keys = [], explored = [];
let start, end;
let player, camera;
let bombs = [];
let can_place = true;

function setup(){
	let canvas = createCanvas(800, 800);
	canvas.parent("canvas");

	map = procedural_cave(COL, ROW, TILE, 5, 4, 12, 1667.5863615996711); //1667.5863615996711
	get_map_stats();

	qt = new Quadtree(0, 0, COL*TILE);
	qt.subdivide();
	// qt_leaves = Quadtree.get_neighbors(qt);
	Quadtree.get_neighbors(qt);

	let random_location = get_random_cavern_location();
	player = new Player(random_location.x, random_location.y);
	camera = new Camera(0, 0, width, height);

	options_init();
}

function draw(){
	background(127); //118, 88, 66

	if(keys[37]){
		player.pos.x -= player.speed;
	}
	if(keys[38]){
		player.pos.y -= player.speed;
	}
	if(keys[39]){
		player.pos.x += player.speed;
	}
	if(keys[40]){
		player.pos.y += player.speed;
	}
	if(keys[32]){
		if(can_place){
			bombs.push(new Bomb(player.pos.x, player.pos.y));
			can_place = false;
		}

		setTimeout(function(){
			can_place = true;
		}, 1000);
	}

	for(let i=(camera.pos.x/TILE)|0; i<(camera.pos.x + camera.w)/TILE; i++){
		for(let j=(camera.pos.y/TILE)|0; j<(camera.pos.y + camera.h)/TILE; j++){
			if(map[i][j] == 1){
				fill(50);
				stroke(50);
				strokeWeight(1);
				rect(i*TILE - camera.pos.x, j*TILE - camera.pos.y, TILE, TILE);
			}else if(map[i][j] != 0){
				map[i][j].draw();
			}

			if(map[i][j] != 1 && !explored[COL*j + i]){
				explored[COL*j + i] = true;
				explored_squares++;
			}
		}
	}

	options_update();
	stats_update();

	player.move();
	player.update();
	player.draw();

	camera.update();

	for(let bomb of bombs){
		bomb.update();
		bomb.draw();
	}
}

let find_path = function(){
	if(start && end){
		for(let location in qt_leaves){
			qt_leaves[location].node.gscore = Infinity;
			qt_leaves[location].node.fscore = Infinity;
			qt_leaves[location].node.previous = null;
		}
		start.node.gscore = 0;
		path = smooth(astar(start.node, end.node));
		player.path = path.slice();
	}
}

function mouseClicked(){
	let i = (mouseX + camera.pos.x)/TILE;
	let j = (mouseY + camera.pos.y)/TILE;

	if(i < 0 || i >= (camera.pos.x + camera.w)/TILE || j < 0 || j >= (camera.pos.y + camera.h)/TILE){
		return;
	}

	for(let location in qt_leaves){
		qt_leaves[location].node.pos.x = qt_leaves[location].x + qt_leaves[location].d/2;
		qt_leaves[location].node.pos.y = qt_leaves[location].y + qt_leaves[location].d/2;
	}

	start = qt.query(player.pos.x/TILE, player.pos.y/TILE);
	start.node.pos = player.pos.copy();

	end = qt.query(i, j);
	end.node.pos.x = mouseX + camera.pos.x;
	end.node.pos.y = mouseY + camera.pos.y;

	if(start && end){
		find_path();
	}
}

let get_random_cavern_location = function(){
	let index = 1;
	for(let i=1; i<caverns_sorted.length; i++){
		if(caverns_sorted[i].length > caverns_sorted[index].length){
			index = i;
		}
	}
	let location_index = random(caverns_sorted[index]);

	return{
		x: (location_index % COL)*TILE + TILE/2,
		y: Math.floor(location_index/ROW)*TILE + TILE/2
	};
}

let get_neighbors = function(i, j){
	let neighbors = [[i, j - 1], [i + 1, j - 1], [i + 1, j], [i + 1, j + 1], [i, j + 1], [i - 1, j + 1], [i - 1, j], [i - 1, j - 1]];

	for(let k=0; k<neighbors.length; k++){
		let x = neighbors[k][0];
		let y = neighbors[k][1];

		if(!in_map(map, x, y)){
			neighbors.splice(k, 1);
		}
	}

	return neighbors;
}

function keyPressed(){
	keys[keyCode] = true;
}

function keyReleased(){
	keys[keyCode] = false;
}
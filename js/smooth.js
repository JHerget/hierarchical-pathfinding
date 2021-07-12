let smooth = function(path){
	if(path.length <= 1){
		return path;
	}

	let check_point = path[path.length - 1];
	let current_point = check_point.previous;

	while(current_point.previous){
		if(walkable(check_point, current_point)){
			check_point.previous = current_point;
			current_point = current_point.previous;
		}else{
			check_point = current_point;
			current_point = current_point.previous;
		}
	}

	let node = path[path.length - 1];
	let new_path = [];
	while(node.previous){
		new_path.unshift(node);
		node = node.previous;
	}
	new_path.unshift(start.node);

	return new_path;
}

let walkable = function(a, b){
	let start = (a.pos.x <= b.pos.x) ? a : b;
	let end = (a.pos.x > b.pos.x) ? a : b;

	let u = Vector.subtract(start.pos, end.pos);
	u.norm();

	let counter = 0;
	let interval = 10;
	while(distsq(start.pos.x - u.x*counter, start.pos.y - u.y*counter, end.pos.x, end.pos.y) >= interval*interval){
		if(player_collision(start.pos.x - u.x*counter, start.pos.y - u.y*counter)){
			return false;
		}

		counter += interval;
	}

	return true;
}

let distsq = function(x1, y1, x2, y2){
	let xs = (x1 - x2)*(x1 - x2);
	let ys = (y1 - y2)*(y1 - y2);

	return xs + ys;
}

let player_collision = function(x, y){
	let v = 8;
	let ui = Math.floor(x/TILE), uj = Math.floor((y - v)/TILE);
	let ri = Math.floor((x + v)/TILE), rj = Math.floor(y/TILE);
	let di = Math.floor(x/TILE), dj = Math.floor((y + v)/TILE);
	let li = Math.floor((x - v)/TILE), lj = Math.floor(y/TILE);
	let lui = Math.floor((x - v)/TILE), luj = Math.floor((y - v)/TILE);
	let rui = Math.floor((x + v)/TILE), ruj = Math.floor((y - v)/TILE);
	let rdi = Math.floor((x + v)/TILE), rdj = Math.floor((y + v)/TILE);
	let ldi = Math.floor((x - v)/TILE), ldj = Math.floor((y + v)/TILE);

	if((map[lui][luj] == 1 && map[ui][uj] == 1) || (map[ui][uj] == 1 && map[rui][ruj] == 1)){
		return true;
	}
	if((map[rui][ruj] == 1 && map[ri][rj] == 1) || (map[ri][rj] == 1 && map[rdi][rdj] == 1)){
		return true;
	}
	if((map[rdi][rdj] == 1 && map[di][dj] == 1) || (map[di][dj] == 1 && map[ldi][ldj] == 1)){
		return true;
	}
	if((map[ldi][ldj] == 1 && map[li][lj] == 1) || (map[li][lj] == 1 && map[lui][luj] == 1)){
		return true;
	}

	return false;
}
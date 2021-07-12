class Node {
	constructor(){
		this.gscore = Infinity;
		this.fscore = Infinity;
		this.previous = null;
		this.neighbors = [];
		this.distances = [];
	}
}

let astar = function(start, end){
	let open = [];
	open.push(start);

	start.gscore = 0;

	while(open.length > 0){
		quicksort(open, 0, open.length - 1);

		let current = open[0];
		if(current == end){
			break;
		}

		for(let i=0; i<current.neighbors.length; i++){
			if(!current.neighbors[i].visible){
				continue;
			}

			let edge_cost = current.neighbors[i].is_edge ? 1000 : 0;
			let tentative = current.gscore + current.distances[i] + edge_cost;
			if(tentative < current.neighbors[i].gscore){
				current.neighbors[i].gscore = tentative;
				current.neighbors[i].fscore = h(current.neighbors[i], end) + tentative;
				current.neighbors[i].previous = current;

				let in_open = false;
				for(let j=0; j<open.length; j++){
					if(open[j] == current.neighbors[i]){
						in_open = true;
						break;
					}
				}

				if(!in_open){
					open.push(current.neighbors[i]);
				}
			}
		}

		open.shift();
	}

	// if(!end.previous){
	// 	let min_dist = Infinity;
	// 	let closest = null;
	// 	for(let quadrant of end.neighbors){
	// 		if(!quadrant.node.visible){
	// 			continue;
	// 		}

	// 		let d = quadrant.node.pos.distsq(end.pos);
	// 		if(d < min_dist){
	// 			min_dist = d;
	// 			closest = quadrant;
	// 		}
	// 	}

	// 	if(closest){
	// 		end = closest;
	// 	}
	// }

	let path = [];
	let node = end;
	while(node.previous){
		path.unshift(node);
		node = node.previous;
	}
	path.unshift(start);

	return path;
}

let h = function(node, end){
	let xs = (node.pos.x - end.pos.x)*(node.pos.x - end.pos.x);
	let ys = (node.pos.y - end.pos.y)*(node.pos.y - end.pos.y);

	return xs + ys;
}

let quicksort = function(arr, low, high){
	if(low < high){
		let p = partition(arr, low, high);
		quicksort(arr, low, p);
		quicksort(arr, p + 1, high);
	}
}

let partition = function(arr, low, high){
	let pivot = arr[Math.floor((low + high)/2)].gscore;
	let x = low - 1;
	let y = high + 1;

	while(true){
		x += 1;
		while(arr[x].gscore < pivot){
			x += 1;
		}

		y -= 1;
		while(arr[y].gscore > pivot){
			y -= 1;
		}

		if(x >= y){
			return y;
		}

		let temp = arr[x];
		arr[x] = arr[y];
		arr[y] = temp;
	}
}
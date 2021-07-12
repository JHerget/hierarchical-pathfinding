let location_lookup = {};
let fsm = [[],
/*Q1*/[/*UP*/[3, 0],  /*RIGHT-UP*/[4, 0],  /*RIGHT*/[2, -1], /*RIGHT-DOWN*/[4, -1], /*DOWN*/[3, -1], /*LEFT-DOWN*/[4, 6],  /*LEFT*/[2, 6],  /*LEFT-UP*/[4, 7]],
/*Q2*/[/*UP*/[4, 0],  /*RIGHT-UP*/[3, 1],  /*RIGHT*/[1, 2],  /*RIGHT-DOWN*/[3, 2],  /*DOWN*/[4, -1], /*LEFT-DOWN*/[3, -1], /*LEFT*/[1, -1], /*LEFT-UP*/[3, 0]],
/*Q3*/[/*UP*/[1, -1], /*RIGHT-UP*/[2, -1], /*RIGHT*/[4, -1], /*RIGHT-DOWN*/[2, 4],  /*DOWN*/[1, 4],  /*LEFT-DOWN*/[2, 5],  /*LEFT*/[4, 6],  /*LEFT-UP*/[2, 6]],
/*Q4*/[/*UP*/[2, -1], /*RIGHT-UP*/[1, 2],  /*RIGHT*/[3, 2],  /*RIGHT-DOWN*/[1, 3],  /*DOWN*/[2, 4],  /*LEFT-DOWN*/[1, 4],  /*LEFT*/[3, -1], /*LEFT-UP*/[1, -1]],
];

class Quadtree {
	constructor(x, y, d){
		this.x = x;
		this.y = y;
		this.d = d;
		this.location = 0;
		this.neighbors = [];

		this.node = new Node();
		this.node.pos = createVector(x + d/2, y + d/2);
		this.node.is_edge = (this.d == TILE ? true : false);

		this.nw_child;
		this.ne_child;
		this.sw_child;
		this.se_child;
	}

	subdivide(){
		let has_empty = false;
		let has_nonempty = false;

		for(let i=to_tile(this.x); i<to_tile(this.x + this.d); i++){
			for(let j=to_tile(this.y); j<to_tile(this.y + this.d); j++){
				if(map[i][j] != 1){
					has_empty = true;
				}else{
					has_nonempty = true;
				}
			}
		}

		if((has_empty && !has_nonempty) || (has_nonempty && !has_empty)){
			this.clear();

			if(has_empty && !has_nonempty){
				this.node.visible = true;
			}else{
				this.node.visible = false;
			}
		}else if(has_empty && has_nonempty && this.d > TILE){
			this.nw_child = new Quadtree(this.x, this.y, this.d/2);
			this.ne_child = new Quadtree(this.x + this.d/2, this.y, this.d/2);
			this.sw_child = new Quadtree(this.x, this.y + this.d/2, this.d/2);
			this.se_child = new Quadtree(this.x + this.d/2, this.y + this.d/2, this.d/2);

			this.nw_child.location = parseInt(this.location.toString() + "1");
			this.ne_child.location = parseInt(this.location.toString() + "2");
			this.sw_child.location = parseInt(this.location.toString() + "3");
			this.se_child.location = parseInt(this.location.toString() + "4");

			location_lookup[this.nw_child.location] = this.nw_child;
			location_lookup[this.ne_child.location] = this.ne_child;
			location_lookup[this.sw_child.location] = this.sw_child;
			location_lookup[this.se_child.location] = this.se_child;
		}

		if(this.nw_child){
			this.nw_child.subdivide();
			this.ne_child.subdivide();
			this.sw_child.subdivide();
			this.se_child.subdivide();
		}
	}

	query(i, j){
		if(i >= to_tile(this.x) && i <= to_tile(this.x + this.d) &&
			j >= to_tile(this.y) && j <= to_tile(this.y + this.d)){

			if(this.nw_child){
				return(this.nw_child.query(i, j) ||
				this.ne_child.query(i, j) ||
				this.sw_child.query(i, j) ||
				this.se_child.query(i, j));
			}else{
				return this;
			}
		}
	}

	neighbor(direction){
		let code = this.location.toString().slice().split("");
		let new_code = code.slice();
		let index = code.length - 1;
		let dir = direction;

		while(index >= 0){
			let digit = parseInt(code[index]);
			let data = fsm[digit][dir];

			new_code[index] = data[0];
			dir = data[1];
			index--;

			if(dir == -1){
				break;
			}
		}
		new_code = parseInt(new_code.join(""));

		while(!location_lookup[new_code]){
			new_code = Math.floor(new_code/10);
		}

		return location_lookup[new_code];
	}

	get_neighbors(){
		for(let initial_dir=0; initial_dir<8; initial_dir++){
			if(this.x <= 0 && initial_dir > 4){continue;}
			if(this.y <= 0 && (initial_dir == 7 || initial_dir < 2)){continue;}
			if(this.x + this.d >= COL*TILE && initial_dir > 0 && initial_dir < 4){continue;}
			if(this.y + this.d >= ROW*TILE && initial_dir > 2 && initial_dir < 6){continue;}

			let neighbor = this.neighbor(initial_dir);
			if(neighbor.nw_child){
				neighbor = neighbor.compare_children(this, (initial_dir + 4) % 8);
			}

			this.neighbors = this.neighbors.concat(neighbor);
		}

		for(let i=0; i<this.neighbors.length; i++){
			this.node.neighbors[i] = this.neighbors[i].node;

			let xs = (this.node.pos.x - this.neighbors[i].node.pos.x)*(this.node.pos.x - this.neighbors[i].node.pos.x);
			let ys = (this.node.pos.y - this.neighbors[i].node.pos.y)*(this.node.pos.y - this.neighbors[i].node.pos.y);
			this.node.distances[i] = Math.sqrt(xs + ys);
		}
	}

	compare_children(quadrant, dir){
		let quadrants = [];

		if(this.nw_child){
			quadrants = quadrants.concat(this.nw_child.compare_children(quadrant, dir));
			quadrants = quadrants.concat(this.ne_child.compare_children(quadrant, dir));
			quadrants = quadrants.concat(this.sw_child.compare_children(quadrant, dir));
			quadrants = quadrants.concat(this.se_child.compare_children(quadrant, dir));
			return quadrants;
		}

		if(this.neighbor(dir) == quadrant){
			quadrants.push(this);
		}

		return quadrants;
	}

	clear(){
		if(this.nw_child){
			this.nw_child.clear();
			this.ne_child.clear();
			this.sw_child.clear();
			this.se_child.clear();

			delete location_lookup[this.nw_child.location];
			delete location_lookup[this.ne_child.location];
			delete location_lookup[this.sw_child.location];
			delete location_lookup[this.se_child.location];
		}

		this.nw_child = undefined;
		this.ne_child = undefined;
		this.sw_child = undefined;
		this.se_child = undefined;
	}

	static get_neighbors(qt){
		// let quadrants = [];

		// if(qt.nw_child){
		// 	quadrants = quadrants.concat(Quadtree.get_neighbors(qt.nw_child));
		// 	quadrants = quadrants.concat(Quadtree.get_neighbors(qt.ne_child));
		// 	quadrants = quadrants.concat(Quadtree.get_neighbors(qt.sw_child));
		// 	quadrants = quadrants.concat(Quadtree.get_neighbors(qt.se_child));
		// 	return quadrants;
		// }

		// qt.get_neighbors();
		// quadrants.push(qt);

		// return quadrants;

		if(qt.nw_child){
			Quadtree.get_neighbors(qt.nw_child);
			Quadtree.get_neighbors(qt.ne_child);
			Quadtree.get_neighbors(qt.sw_child);
			Quadtree.get_neighbors(qt.se_child);
			return;
		}

		qt.get_neighbors();
		qt_leaves[qt.location] = qt;
	}
}

let to_tile = function(value){
	return floor(value/TILE);
}
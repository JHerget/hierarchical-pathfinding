class Bomb {
	constructor(x, y){
		this.pos = createVector(x, y);
		this.d = TILE;
		this.fuse = 1;
		this.exploded = false;
	}

	update(){
		this.fuse -= 0.003;

		if(this.fuse < 0 && !this.exploded){
			this.exploded = true;
			this.explode();
		}
	}

	draw(){
		if(!this.exploded){
			stroke(lerpColor(color(255, 30, 0), color(71, 0, 97), this.fuse));
			fill(lerpColor(color(255, 145, 0), color(101, 0, 138), this.fuse));
			strokeWeight(3);
			circle(this.pos.x - camera.pos.x, this.pos.y - camera.pos.y, this.d);
		}
	}

	explode(){
		let i = Math.floor(this.pos.x/TILE);
		let j = Math.floor(this.pos.y/TILE);
		let neighbors = get_neighbors(i, j);

		if(map[i][j] == 1){
			map[i][j] = 0;

			let quadrant = qt.query(i, j);
			let parent = location_lookup[Math.floor(quadrant.location/10)];
			remove_from_qt_leaves(parent);
			parent.clear();
		}

		for(let k=0; k<neighbors.length; k++){
			let x = neighbors[k][0];
			let y = neighbors[k][1];

			if(map[x][y] == 1){
				map[x][y] = 0;

				let quadrant = qt.query(x, y);
				let parent = location_lookup[Math.floor(quadrant.location/10)];
				remove_from_qt_leaves(parent);
				parent.clear();
			}
		}

		let quadrant = qt.query(i, j);
		quadrant.get_neighbors();
		quadrant.subdivide();
		add_to_qt_leaves(quadrant);
		Quadtree.get_neighbors(quadrant);

		for(let neighbor of quadrant.neighbors){
			neighbor.get_neighbors();
		}
	}
}

let add_to_qt_leaves = function(quadrant){
	if(quadrant.nw_child){
		add_to_qt_leaves(quadrant.nw_child);
		add_to_qt_leaves(quadrant.ne_child);
		add_to_qt_leaves(quadrant.sw_child);
		add_to_qt_leaves(quadrant.se_child);
		return;
	}

	qt_leaves[quadrant.location] = quadrant;
}

let remove_from_qt_leaves = function(quadrant){
	if(quadrant.nw_child){
		remove_from_qt_leaves(quadrant.nw_child);
		remove_from_qt_leaves(quadrant.ne_child);
		remove_from_qt_leaves(quadrant.sw_child);
		remove_from_qt_leaves(quadrant.se_child);

		delete qt_leaves[quadrant.nw_child.location];
		delete qt_leaves[quadrant.ne_child.location];
		delete qt_leaves[quadrant.sw_child.location];
		delete qt_leaves[quadrant.se_child.location];
	}

	delete qt_leaves[quadrant.location];
}
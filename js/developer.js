let quadtree_checkbox, path_checkbox, nodes_checkbox, outlines_checkbox, neighbors_checkbox, pathtree_checkbox;

let options_init = function(){
	quadtree_checkbox = createCheckbox("Show Quadtree", false);
	path_checkbox = createCheckbox("Show Path", false);
	pathtree_checkbox = createCheckbox("Show Path Tree", false);
	nodes_checkbox = createCheckbox("Show Nodes", false);
	outlines_checkbox = createCheckbox("Show Outlines", false);
	neighbors_checkbox = createCheckbox("Show Neighbors", false);
}

let options_update = function(){
	if(quadtree_checkbox.checked()){
		qt.draw();
	}

	if(nodes_checkbox.checked()){
		for(let location in qt_leaves){
			if(qt_leaves[location].node.visible){
				if(qt_leaves[location].node.pos.x >= camera.pos.x &&
					qt_leaves[location].node.pos.x <= camera.pos.x + camera.w &&
					qt_leaves[location].node.pos.y >= camera.pos.y &&
					qt_leaves[location].node.pos.y <= camera.pos.y + camera.h){

					stroke(255);
					strokeWeight(3);
					point(qt_leaves[location].node.pos.x - camera.pos.x, qt_leaves[location].node.pos.y - camera.pos.y);
				}
			}
		}
	}

	if(outlines_checkbox.checked()){
		if(start){
			noFill();
			stroke("red");
			strokeWeight(2);
			rect(start.x - camera.pos.x, start.y - camera.pos.y, start.d, start.d);
		}

		if(end){
			noFill();
			stroke("blue");
			strokeWeight(2);
			rect(end.x - camera.pos.x, end.y - camera.pos.y, end.d, end.d);
		}

		let mouse = qt.query((mouseX + camera.pos.x)/TILE, (mouseY + camera.pos.y)/TILE);
		if(mouse){
			stroke(0, 199, 196);
			noFill();
			strokeWeight(2);
			rect(mouse.x - camera.pos.x, mouse.y - camera.pos.y, mouse.d, mouse.d);
		}
	}

	if(neighbors_checkbox.checked()){
		let mouse = qt.query((mouseX + camera.pos.x)/TILE, (mouseY + camera.pos.y)/TILE);
		if(mouse){
			for(let neighbor of mouse.neighbors){
				stroke("orange");
				noFill();
				strokeWeight(2);
				rect(neighbor.x - camera.pos.x, neighbor.y - camera.pos.y, neighbor.d, neighbor.d);
			}

			stroke(0, 199, 196);
			noFill();
			strokeWeight(2);
			rect(mouse.x - camera.pos.x, mouse.y - camera.pos.y, mouse.d, mouse.d);
		}
	}

	if(pathtree_checkbox.checked()){
		for(let quadrant of qt_leaves){
			if(quadrant.node.previous){
				stroke(76, 194, 84);
				strokeWeight(1);
				line(quadrant.node.pos.x - camera.pos.x, quadrant.node.pos.y - camera.pos.y, quadrant.node.previous.pos.x - camera.pos.x, quadrant.node.previous.pos.y - camera.pos.y);
			}
		}
	}

	if(path_checkbox.checked()){
		for(let i=0; i<path.length-1; i++){
			stroke(208, 48, 37);
			strokeWeight(3);
			line(path[i].pos.x - camera.pos.x, path[i].pos.y - camera.pos.y, path[i + 1].pos.x - camera.pos.x, path[i + 1].pos.y - camera.pos.y);
		}
	}
}

Quadtree.prototype.draw = function(){
	if(this.nw_child){
		this.nw_child.draw();
		this.ne_child.draw();
		this.sw_child.draw();
		this.se_child.draw();
		return;
	}

	
	if(this.x <= camera.pos.x + camera.w &&
		this.x + this.d >= camera.pos.x &&
		this.y <= camera.pos.y + camera.h &&
		this.y + this.d >= camera.pos.y){

		stroke(42, 96, 213);
		noFill();
		strokeWeight(1);
		rect(this.x - camera.pos.x, this.y - camera.pos.y, this.d, this.d);
	}
}